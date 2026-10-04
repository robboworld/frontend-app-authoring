/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Reads course identity (org, number, run, display name) from a Studio OLX
 * export (.tar.gz) in the browser, so "Create a course" can be prefilled
 * before the archive is imported into the new course.
 *
 * Archive layout: <root>/course.xml → <course org course url_name/>,
 * <root>/course/<url_name>.xml → <course display_name …>.
 */

export interface CourseArchiveInfo {
  org: string;
  number: string;
  run: string;
  displayName: string;
}

const BLOCK = 512;
/** Stop scanning after this much unpacked data: course.xml always lies near the top. */
const MAX_SCAN_BYTES = 256 * 1024 * 1024;
/** Only XML files up to this size are kept in memory. */
const MAX_XML_BYTES = 4 * 1024 * 1024;

const decoder = new TextDecoder('utf-8');

const readString = (buf: Uint8Array, start: number, length: number) => {
  const slice = buf.subarray(start, start + length);
  const end = slice.indexOf(0);
  return decoder.decode(end === -1 ? slice : slice.subarray(0, end));
};

const readOctal = (buf: Uint8Array, start: number, length: number) => (
  parseInt(readString(buf, start, length).trim() || '0', 8)
);

/** PAX extended header: "<len> path=<value>\n" records. */
const readPaxPath = (data: Uint8Array) => {
  const match = decoder.decode(data).match(/(?:^|\n)\d+ path=([^\n]*)\n/);
  return match ? match[1] : undefined;
};

/** Root-relative path: "<root>/course.xml" → "course.xml"; "./" prefixes are dropped. */
const stripRoot = (name: string) => {
  const parts = name.replace(/^\.\//, '').split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : '';
};

const parseXmlRoot = (text: string) => {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) {
    return null;
  }
  return doc.documentElement;
};

class TarScanner {
  private chunks: Uint8Array[] = [];

  private buffered = 0;

  push(chunk: Uint8Array) {
    this.chunks.push(chunk);
    this.buffered += chunk.length;
  }

  get available() {
    return this.buffered;
  }

  /** Removes and returns the first `length` bytes (caller ensures they are buffered). */
  take(length: number): Uint8Array {
    const out = new Uint8Array(length);
    let offset = 0;
    while (offset < length) {
      const head = this.chunks[0];
      const need = length - offset;
      if (head.length <= need) {
        out.set(head, offset);
        offset += head.length;
        this.chunks.shift();
      } else {
        out.set(head.subarray(0, need), offset);
        this.chunks[0] = head.subarray(need);
        offset += need;
      }
    }
    this.buffered -= length;
    return out;
  }

  /** Drops up to `length` bytes, returns how many were dropped. */
  skip(length: number): number {
    let dropped = 0;
    while (dropped < length && this.chunks.length) {
      const head = this.chunks[0];
      const need = length - dropped;
      if (head.length <= need) {
        dropped += head.length;
        this.chunks.shift();
      } else {
        this.chunks[0] = head.subarray(need);
        dropped += need;
      }
    }
    this.buffered -= dropped;
    return dropped;
  }
}

/**
 * Returns course identity from an OLX export, or null when the file is not a
 * course export (library archive, broken file, unsupported browser).
 */
export async function readCourseArchive(file: File): Promise<CourseArchiveInfo | null> {
  if (typeof DecompressionStream === 'undefined') {
    return null;
  }

  const reader = (file.stream()
    .pipeThrough(new DecompressionStream('gzip')) as ReadableStream<Uint8Array>)
    .getReader();
  const scanner = new TarScanner();
  const xmlFiles = new Map<string, string>();
  let scanned = 0;
  let longName: string | undefined;
  // Current entry being read or skipped
  let entry: { name: string; size: number; padded: number; keep: boolean; type: string; } | null = null;

  const result = (): CourseArchiveInfo | null => {
    const courseXml = xmlFiles.get('course.xml');
    if (!courseXml) {
      return null;
    }
    const root = parseXmlRoot(courseXml);
    if (!root || root.tagName !== 'course') {
      return null;
    }
    const run = root.getAttribute('url_name') || '';
    let displayName = root.getAttribute('display_name') || '';
    const details = xmlFiles.get(`course/${run}.xml`);
    if (details) {
      displayName = parseXmlRoot(details)?.getAttribute('display_name') || displayName;
    }
    return {
      org: root.getAttribute('org') || '',
      number: root.getAttribute('course') || '',
      run,
      displayName,
    };
  };

  const isDone = () => {
    const courseXml = xmlFiles.get('course.xml');
    if (!courseXml) {
      return false;
    }
    const run = parseXmlRoot(courseXml)?.getAttribute('url_name');
    return !run || xmlFiles.has(`course/${run}.xml`);
  };

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      scanner.push(value);
      scanned += value.length;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (!entry) {
          if (scanner.available < BLOCK) {
            break;
          }
          const header = scanner.take(BLOCK);
          if (header.every((byte) => byte === 0)) {
            continue; // end-of-archive padding
          }
          let name = readString(header, 0, 100);
          const prefix = readString(header, 345, 155);
          if (prefix) {
            name = `${prefix}/${name}`;
          }
          if (longName) {
            name = longName;
            longName = undefined;
          }
          const size = readOctal(header, 124, 12);
          const type = String.fromCharCode(header[156] || 48);
          const relative = stripRoot(name);
          const isXml = (type === '0' || type === '\0')
            && (relative === 'course.xml' || /^course\/[^/]+\.xml$/.test(relative));
          entry = {
            name: relative,
            size,
            padded: Math.ceil(size / BLOCK) * BLOCK,
            keep: (isXml || type === 'x' || type === 'L') && size <= MAX_XML_BYTES,
            type,
          };
        }

        if (entry.keep) {
          if (scanner.available < entry.padded) {
            break;
          }
          const data = scanner.take(entry.padded).subarray(0, entry.size);
          if (entry.type === 'x') {
            longName = readPaxPath(data);
          } else if (entry.type === 'L') {
            longName = readString(data, 0, data.length);
          } else {
            xmlFiles.set(entry.name, decoder.decode(data));
          }
          entry = null;
        } else {
          entry.padded -= scanner.skip(entry.padded);
          if (entry.padded > 0) {
            break;
          }
          entry = null;
        }
      }

      if (isDone() || scanned > MAX_SCAN_BYTES) {
        break;
      }
    }
  } catch {
    return null;
  } finally {
    reader.cancel().catch(() => {});
  }

  return result();
}
