/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Text rules of the real course cards, applied to the unsaved form values:
 * catalog — lms/djangoapps/courseware/robbo_catalog.py and robbo-theme js/robbo_courses_catalog.js;
 * «Мои курсы» — frontend-app-learner-dashboard CourseCardDetails / CourseCardBanners.
 */

// robbo_catalog._GUEST_COURSE_DESC_BOILERPLATE / _CATALOG_DEFAULT_DESC_PREFIX
const DESCRIPTION_BOILERPLATE = [
  'about this course',
  'include your long course description here',
  'include your course description here',
  'enter short description',
  'вставьте здесь подробное описание курса',
  'это второй абзац подробного описания',
];
const DEFAULT_DESCRIPTION_PREFIX = 'about this course include your long course';
const OVERVIEW_SNIPPET_MAX = 500;

// robbo_courses_catalog.js fitCourseDescFontSizes: 1.1rem up to 55 characters, 1rem from 165.
const DESC_SIZE_MAX = 1.1;
const DESC_SIZE_MIN = 1;
const DESC_CHARS_SHORT = 55;
const DESC_CHARS_LONG = 165;

const normalizeCatalogDescription = (text: string): string => {
  const snippet = text.trim();
  const lowered = snippet.toLowerCase();
  if (!snippet || lowered.startsWith(DEFAULT_DESCRIPTION_PREFIX)) {
    return '';
  }
  return DESCRIPTION_BOILERPLATE.some((phrase) => lowered.includes(phrase)) ? '' : snippet;
};

// robbo_catalog._html_to_snippet: plain text of the About page overview.
const htmlToSnippet = (html: string): string => {
  const parsed = new DOMParser().parseFromString(html.replace(/<[^>]+>/g, ' '), 'text/html');
  const text = (parsed.body.textContent || '').split(/\s+/).filter(Boolean).join(' ');
  if (text.length > OVERVIEW_SNIPPET_MAX) {
    return `${text.slice(0, OVERVIEW_SNIPPET_MAX - 1).trimEnd()}…`;
  }
  return text;
};

/** Catalog card description: short description, else the overview, minus the Open edX samples. */
export const getCatalogDescription = (shortDescription = '', overviewHtml = ''): string => (
  normalizeCatalogDescription(shortDescription.trim() || htmlToSnippet(overviewHtml || ''))
);

export const getCatalogDescriptionSizeRem = (text: string): number => {
  const length = text.replace(/\s+/g, ' ').trim().length;
  if (length <= DESC_CHARS_SHORT) {
    return DESC_SIZE_MAX;
  }
  if (length >= DESC_CHARS_LONG) {
    return DESC_SIZE_MIN;
  }
  const ratio = (length - DESC_CHARS_SHORT) / (DESC_CHARS_LONG - DESC_CHARS_SHORT);
  return DESC_SIZE_MAX - ratio * (DESC_SIZE_MAX - DESC_SIZE_MIN);
};

export const parseDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** robbo_catalog._course_card_meta: start date as dd.mm.yyyy (UTC, like strftime on the server). */
export const formatCatalogDate = (date: Date): string => [
  String(date.getUTCDate()).padStart(2, '0'),
  String(date.getUTCMonth() + 1).padStart(2, '0'),
  date.getUTCFullYear(),
].join('.');

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Recommended course card image: 4:3, at least 1200×900 (the thumbnail the site makes is ≤ 750×400).
export const RECOMMENDED_IMAGE: ImageSize = { width: 1200, height: 900 };
const CATALOG_FRAME_RATIO = 4 / 3;
// Shortest usual «Мои курсы» card on desktop: 300 × 168 px (one-line title, no end date or no units).
const DASHBOARD_MIN_FRAME_RATIO = 16 / 9;
const RATIO_TOLERANCE = 0.02;

/** Part of the image `object-fit: cover` shows in a frame, aligned like `object-position` (x centred). */
const getCoverVisibleRect = (
  { width, height }: ImageSize,
  frameRatio: number,
  alignY: number,
): ImageRect => {
  if (width / height > frameRatio) {
    const visibleWidth = height * frameRatio;
    return {
      x: (width - visibleWidth) / 2, y: 0, width: visibleWidth, height,
    };
  }
  const visibleHeight = width / frameRatio;
  return {
    x: 0, y: (height - visibleHeight) * alignY, width, height: visibleHeight,
  };
};

/**
 * Safe zone: the part of the image visible in both cards — the catalog (4:3, top-aligned) and the
 * shortest «Мои курсы» card (16:9, centred). For a 4:3 image it is the central 16:9 band.
 * Null when no part of the image is visible in both.
 */
export const getSafeZone = (size: ImageSize): ImageRect | null => {
  const catalog = getCoverVisibleRect(size, CATALOG_FRAME_RATIO, 0);
  const dashboard = getCoverVisibleRect(size, DASHBOARD_MIN_FRAME_RATIO, 0.5);
  const x = Math.max(catalog.x, dashboard.x);
  const y = Math.max(catalog.y, dashboard.y);
  const right = Math.min(catalog.x + catalog.width, dashboard.x + dashboard.width);
  const bottom = Math.min(catalog.y + catalog.height, dashboard.y + dashboard.height);
  if (right <= x || bottom <= y) {
    return null;
  }
  return {
    x, y, width: right - x, height: bottom - y,
  };
};

export const isCatalogRatio = ({ width, height }: ImageSize): boolean => (
  Math.abs(width / height - CATALOG_FRAME_RATIO) <= RATIO_TOLERANCE
);

export const isBelowRecommended = ({ width, height }: ImageSize): boolean => (
  width < RECOMMENDED_IMAGE.width || height < RECOMMENDED_IMAGE.height
);

// --- Crop to 4:3 (CardImageCropper) ---
export type CropRect = ImageRect;

const MAX_OUTPUT_WIDTH = 1600; // 1600×1200 is plenty: the site makes ≤ 1500×800 copies
const MIN_CROP_WIDTH = 300; // zooming further would only blow up a few source pixels
const MAX_ZOOM = 4;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getMaxCropWidth = ({ width, height }: ImageSize) => Math.min(width, height * CATALOG_FRAME_RATIO);

const clampCrop = (crop: CropRect, { width, height }: ImageSize): CropRect => ({
  ...crop,
  x: clamp(crop.x, 0, width - crop.width),
  y: clamp(crop.y, 0, height - crop.height),
});

/** Start from what the catalog shows now: the largest 4:3 part, centred, from the top. */
export const getInitialCrop = (size: ImageSize): CropRect => {
  const width = getMaxCropWidth(size);
  return {
    x: (size.width - width) / 2, y: 0, width, height: width / CATALOG_FRAME_RATIO,
  };
};

export const getMaxZoom = (size: ImageSize): number => (
  Math.max(1, Math.min(MAX_ZOOM, getMaxCropWidth(size) / MIN_CROP_WIDTH))
);

export const getCropZoom = (crop: CropRect, size: ImageSize): number => getMaxCropWidth(size) / crop.width;

export const moveCrop = (crop: CropRect, dx: number, dy: number, size: ImageSize): CropRect => (
  clampCrop({ ...crop, x: crop.x + dx, y: crop.y + dy }, size)
);

/** Frame saved in a cropped file (cropMetadata), fitted to the original as it is now. */
export const restoreCrop = (
  { x, y, width }: { x: number, y: number, width: number },
  size: ImageSize,
): CropRect => {
  const maxWidth = getMaxCropWidth(size);
  const fittedWidth = clamp(width, maxWidth / getMaxZoom(size), maxWidth);
  return clampCrop({
    x, y, width: fittedWidth, height: fittedWidth / CATALOG_FRAME_RATIO,
  }, size);
};

/** Zoom around the centre of the current crop. */
export const zoomCrop = (crop: CropRect, zoom: number, size: ImageSize): CropRect => {
  const width = getMaxCropWidth(size) / clamp(zoom, 1, getMaxZoom(size));
  const height = width / CATALOG_FRAME_RATIO;
  return clampCrop({
    x: crop.x + (crop.width - width) / 2,
    y: crop.y + (crop.height - height) / 2,
    width,
    height,
  }, size);
};

export const getOutputSize = (crop: CropRect): ImageSize => {
  const width = Math.round(Math.min(crop.width, MAX_OUTPUT_WIDTH));
  return { width, height: Math.round(width / CATALOG_FRAME_RATIO) };
};

/** «<original name>-4x3.<png|jpg>»: PNG stays PNG (transparency), anything else becomes JPEG. */
export const getCropFileName = (imageUrl: string): string => {
  const encoded = (imageUrl.split('/').pop() || '').split('block@').pop() || '';
  let name = encoded.split('?')[0];
  try {
    name = decodeURIComponent(name);
  } catch {
    // keep the encoded name
  }
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name).replace(/-4x3(-\d+)?$/, '') || 'course-image';
  return `${base}-4x3.${/\.png$/i.test(name) ? 'png' : 'jpg'}`;
};

/** Cut the crop out of the original pixels (rejects with SecurityError for a cross-origin image). */
export const cropToBlob = (image: HTMLImageElement, crop: CropRect, fileName: string): Promise<Blob> => (
  new Promise((resolve, reject) => {
    const { width, height } = getOutputSize(crop);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('Canvas is not available'));
      return;
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image'))),
      fileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
      0.9,
    );
  })
);
