/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Images in the text editor go to course Files, never stay inline as base64:
 * - every uploaded image is named `<what it is>-<content hash>.<ext>`: the original file name, or for a
 *   clipboard screenshot (`image.png`) the transliterated unit title, so «Файлы» shows where it came from;
 *   pasting the same picture into another block reuses the file found by its hash instead of uploading again;
 * - distinct pictures never share a name (browsers call every pasted screenshot `image.png`, and Studio
 *   overwrites a file with the same name — the earlier block silently showed the newer picture);
 * - on save, base64 images left in the HTML (pasted with text from Word/Docs/web, source code view,
 *   old blocks) are uploaded and replaced with links.
 */
import { getConfig } from '@edx/frontend-platform';
import { isLibraryKey } from '@src/generic/key-utils';
import { toFileSlug } from '@src/generic/robboTransliterate';
import cmsApi from '../../data/services/cms/api';
import { get } from '../../data/services/cms/utils';
import * as urls from '../../data/services/cms/urls';

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/avif': 'avif',
};

/** `src="data:image/…;base64,…"` attribute; group 3 is the data URI. */
const IMG_DATA_SRC_RE =
  /(\bsrc\s*=\s*)(["'])\s*(data:image\/[a-z0-9.+-]+(?:;[^;,"']*)*;base64,[A-Za-z0-9+/=\s]+?)\s*\2/gi;

/** 64-bit content hash (two cyrb53-style lanes) as 16 hex chars; crypto.subtle is missing on plain http. */
export const hashBytes = (bytes: Uint8Array): string => {
  let h1 = 0xdeadbeef ^ bytes.length;
  let h2 = 0x41c6ce57 ^ bytes.length;
  for (let i = 0; i < bytes.length; i += 1) {
    h1 = Math.imul(h1 ^ bytes[i], 2654435761);
    h2 = Math.imul(h2 ^ bytes[i], 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
};

/** Names browsers and OSes give to clipboard images and screenshots — they say nothing about the picture. */
const GENERIC_STEM_RE =
  /^(image|img|blob|pasted|clipboard|screenshot|screen-shot|skrinshot|snimok|snimok-ekrana|izobrazhenie)(-(\d+|at|v|am|pm))*$/;
/** Default titles of a new text block. */
const DEFAULT_BLOCK_TITLES = ['text', 'tekst', 'raw-html'];

let imageNameHint = '';

/** Title (unit, block) used for pasted images without a meaningful name; set by the text editor. */
export const setImageNameHint = (hint: string | null | undefined) => {
  imageNameHint = hint || '';
};

const nameStem = (originalStem: string, hint: string): string => {
  const own = toFileSlug(originalStem);
  if (own && !GENERIC_STEM_RE.test(own)) {
    return own;
  }
  const fromHint = toFileSlug(hint);
  return fromHint && !DEFAULT_BLOCK_TITLES.includes(fromHint) ? fromHint : 'image';
};

/**
 * `<stem>-<hash>.<ext>`, Latin only (Studio links keep only [\w.%-] of a file name): the stem is the
 * transliterated original name, or `hint` (the unit title) for clipboard images, or `image`.
 */
export const contentAssetName = (
  originalName: string,
  mimeType: string,
  hash: string,
  hint: string = imageNameHint,
): string => {
  const dot = originalName.lastIndexOf('.');
  const stem = nameStem(dot > 0 ? originalName.slice(0, dot) : originalName, hint);
  const ext = EXT_BY_MIME[mimeType.toLowerCase()]
    || (dot > 0 ? originalName.slice(dot + 1).replace(/[^A-Za-z0-9]/g, '').toLowerCase() : '')
    || 'png';
  return `${stem}-${hash}.${ext}`;
};

/** Link to put into `<img src>`: relative to LMS, like images inserted via “Add Image”. */
const assetUrl = (asset: Record<string, any>): string => {
  let url: string = asset.external_url || asset.externalUrl || asset.url || '';
  const portable: string = asset.portable_url || asset.portableUrl || '';
  if (!url && portable) {
    url = portable.startsWith('/') ? portable : `/${portable}`;
  }
  const lms = getConfig().LMS_BASE_URL || '';
  return lms && url.startsWith(lms) ? url.substring(lms.length) : url;
};

/**
 * A Files entry with this content hash and size, if the course already has one — whatever its stem
 * (the same picture pasted into blocks of different units).
 */
const findCourseAsset = async (learningContextId: string, hash: string, size: number) => {
  const studioEndpointUrl = getConfig().STUDIO_BASE_URL;
  const { data } = await get(urls.courseAssets({ studioEndpointUrl, learningContextId }), {
    params: { text_search: hash, page: 0, page_size: 20 },
  });
  const suffix = new RegExp(`-${hash}\\.[a-z0-9]+$`, 'i');
  return (data?.assets || []).find(
    (asset) => suffix.test(asset.display_name || '') && Number(asset.file_size) === size,
  ) || null;
};

/**
 * Upload an image to the course Files under a content-based name, or reuse the file that is already
 * there (e.g. the same picture pasted into another block). Libraries keep the original name.
 */
export const uploadImageAsset = async ({
  file,
  learningContextId,
  blockId,
}: {
  file: File;
  learningContextId: string;
  blockId: string;
}): Promise<{ url: string; name: string; reused: boolean; }> => {
  const studioEndpointUrl = getConfig().STUDIO_BASE_URL;
  if (isLibraryKey(learningContextId)) {
    const response = await cmsApi.uploadAsset({ asset: file, blockId, learningContextId, studioEndpointUrl });
    return { url: assetUrl(response.data?.asset || response.data || {}), name: file.name, reused: false };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = hashBytes(bytes);
  const name = contentAssetName(file.name || 'image', file.type || 'image/png', hash);
  try {
    const existing = await findCourseAsset(learningContextId, hash, bytes.length);
    if (existing) {
      return { url: assetUrl(existing), name: existing.display_name, reused: true };
    }
  } catch {
    // Lookup is an optimisation: the server reuses a file with the same content anyway.
  }
  const renamed = new File([bytes], name, { type: file.type || 'image/png' });
  const response = await cmsApi.uploadAsset({ asset: renamed, blockId, learningContextId, studioEndpointUrl });
  return {
    url: assetUrl(response.data.asset),
    name: response.data.asset?.display_name || name,
    reused: response.data.robbo_upload?.status === 'reused',
  };
};

export const dataUriToFile = (dataUri: string): File => {
  const comma = dataUri.indexOf(',');
  const mimeType = dataUri.slice(5, dataUri.indexOf(';')).toLowerCase();
  const binary = atob(dataUri.slice(comma + 1).replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], `image.${EXT_BY_MIME[mimeType] || 'png'}`, { type: mimeType });
};

export const countBase64Images = (html: string): number => (
  new Set([...html.matchAll(IMG_DATA_SRC_RE)].map((match) => match[3])).size
);

/**
 * Upload every base64 `<img>` of the HTML to course Files and replace it with a link.
 * Images that fail to upload stay inline, so saving never loses content.
 */
export const uploadBase64ImagesInHtml = async ({
  html,
  learningContextId,
  blockId,
}: {
  html: string;
  learningContextId: string;
  blockId: string;
}) => {
  const dataUris = [...new Set([...html.matchAll(IMG_DATA_SRC_RE)].map((match) => match[3]))];
  const results = await Promise.allSettled(dataUris.map((dataUri) =>
    uploadImageAsset({
      file: dataUriToFile(dataUri),
      learningContextId,
      blockId,
    })
  ));
  const urlByDataUri = new Map<string, string>();
  let reused = 0;
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.url) {
      urlByDataUri.set(dataUris[i], result.value.url);
      reused += result.value.reused ? 1 : 0;
    }
  });
  const newHtml = html.replace(IMG_DATA_SRC_RE, (match, prefix, quote, dataUri) => {
    const url = urlByDataUri.get(dataUri);
    return url ? `${prefix}${quote}${url}${quote}` : match;
  });
  return {
    html: newHtml,
    total: dataUris.length,
    moved: urlByDataUri.size,
    reused,
    failed: dataUris.length - urlByDataUri.size,
  };
};
