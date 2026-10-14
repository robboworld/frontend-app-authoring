/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Where a cropped course card image came from: the original asset path and the 4:3 frame, kept
 * inside the cropped file (PNG `tEXt` chunk / JPEG `COM` segment, ASCII JSON). Re-cropping reads
 * it and starts from the original with the same frame instead of cropping the crop.
 */
export interface CropMetadata {
  source: string; // asset path of the original, URL-encoded (/asset-v1:…+type@asset+block@name.png)
  x: number;
  y: number;
  width: number; // frame width in original pixels; height = width × 3/4
}

const KEY = 'robbo-card-crop';
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const isPng = (bytes: Uint8Array) => PNG_SIGNATURE.every((value, index) => bytes[index] === value);
const isJpeg = (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8;
const viewOf = (bytes: Uint8Array) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

// PNG text chunks are Latin-1: keep the JSON ASCII.
const toAsciiJson = (value: CropMetadata) => JSON.stringify(value).replace(
  /[\u007f-￿]/g,
  (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
);

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
};

const parseMetadata = (text: string): CropMetadata | null => {
  try {
    const data = JSON.parse(text);
    const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);
    if (typeof data.source === 'string' && data.source && isNumber(data.x) && isNumber(data.y)
      && isNumber(data.width) && data.width > 0) {
      return {
        source: data.source, x: data.x, y: data.y, width: data.width,
      };
    }
  } catch {
    // not ours
  }
  return null;
};

/** The same image with the metadata inside (unchanged for formats other than PNG and JPEG). */
export const writeCropMetadata = async (blob: Blob, metadata: CropMetadata): Promise<Blob> => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const json = toAsciiJson(metadata);

  if (isPng(bytes)) {
    // tEXt chunk right after IHDR: length, type, keyword\0text, CRC(type + data).
    const data = encoder.encode(`${KEY}\0${json}`);
    const chunk = new Uint8Array(12 + data.length);
    const chunkView = viewOf(chunk);
    chunkView.setUint32(0, data.length);
    chunk.set(encoder.encode('tEXt'), 4);
    chunk.set(data, 8);
    chunkView.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
    const afterHeader = 8 + 12 + viewOf(bytes).getUint32(8);
    return new Blob([bytes.subarray(0, afterHeader), chunk, bytes.subarray(afterHeader)], { type: blob.type });
  }

  if (isJpeg(bytes)) {
    const comment = encoder.encode(`${KEY}:${json}`);
    if (comment.length + 2 > 0xffff) {
      return blob;
    }
    const segment = new Uint8Array(4 + comment.length);
    segment[0] = 0xff;
    segment[1] = 0xfe;
    viewOf(segment).setUint16(2, comment.length + 2);
    segment.set(comment, 4);
    // COM after the JFIF APP0 segment, which has to follow SOI.
    const offset = bytes[2] === 0xff && bytes[3] === 0xe0 ? 4 + viewOf(bytes).getUint16(4) : 2;
    return new Blob([bytes.subarray(0, offset), segment, bytes.subarray(offset)], { type: blob.type });
  }

  return blob;
};

/** Metadata of an image cropped here before, or null. */
export const readCropMetadata = (bytes: Uint8Array): CropMetadata | null => {
  const view = viewOf(bytes);

  if (isPng(bytes)) {
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const length = view.getUint32(offset);
      const type = decoder.decode(bytes.subarray(offset + 4, offset + 8));
      if (type === 'IEND') {
        break;
      }
      if (type === 'tEXt') {
        const data = bytes.subarray(offset + 8, offset + 8 + length);
        const separator = data.indexOf(0);
        if (separator > 0 && decoder.decode(data.subarray(0, separator)) === KEY) {
          return parseMetadata(decoder.decode(data.subarray(separator + 1)));
        }
      }
      offset += 12 + length;
    }
    return null;
  }

  if (isJpeg(bytes)) {
    let offset = 2;
    while (offset + 4 <= bytes.length && bytes[offset] === 0xff) {
      const marker = bytes[offset + 1];
      if (marker === 0xda || marker === 0xd9) {
        break; // image data starts: no more headers
      }
      const length = view.getUint16(offset + 2);
      if (marker === 0xfe) {
        const text = decoder.decode(bytes.subarray(offset + 4, offset + 2 + length));
        if (text.startsWith(`${KEY}:`)) {
          return parseMetadata(text.slice(KEY.length + 1));
        }
      }
      offset += 2 + length;
    }
  }

  return null;
};
