/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 */
// Robbo: asset names keep Unicode letters (Python's \w on the server), so «Слайд13.JPG» must not
// become /static/13.JPG; percent-encoded names are decoded because /static/ links are not.
const decodeAssetName = (name) => {
  if (!/%[0-9A-Fa-f]{2}/.test(name)) {
    return name;
  }
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

const getLocatorSafeName = ({ displayName }) => {
  const locatorSafeName = decodeAssetName(displayName).replace(/[^\p{L}\p{N}_.%-]/gmu, '');
  return locatorSafeName;
};

export const getStaticUrl = ({ displayName }) => (`/static/${getLocatorSafeName({ displayName })}`);

export const getRelativeUrl = ({ courseId, displayName }) => {
  if (displayName) {
    const assetCourseId = courseId.replace('course', 'asset');
    const assetPathShell = `/${assetCourseId}+type@asset+block@`;
    return `${assetPathShell}${displayName}`;
  }
  return '';
};

export const parseAssetName = (relativeUrl) => {
  let assetName = '';
  if (relativeUrl.match(/\/asset-v1:\S+[+]\S+[@]\S+[+]\S+\/\w/)?.length >= 1) {
    const assetBlockName = relativeUrl.substring(0, relativeUrl.search(/("|&quot;)/));
    const dividedSrc = assetBlockName.split(/\/asset-v1:\S+[+]\S+[@]\S+[+]\S+[/@]/);
    [, assetName] = dividedSrc;
  } else {
    const assetBlockName = relativeUrl.substring(relativeUrl.indexOf('@') + 1, relativeUrl.search(/("|&quot;)/));
    assetName = assetBlockName.substring(assetBlockName.indexOf('@') + 1);
  }
  return assetName;
};

/** Detect inline base64 images (clipboard / HTML paste) that bloat course OLX. */
export const BASE64_IMAGE_SRC_RE = /(?:src|data-mce-src)\s*=\s*["']?\s*data:image\//i;

/**
 * @param {string | Element | null | undefined} htmlOrNode
 * @returns {boolean}
 */
export const containsBase64Image = (htmlOrNode) => {
  if (!htmlOrNode) {
    return false;
  }
  if (typeof htmlOrNode === 'string') {
    return BASE64_IMAGE_SRC_RE.test(htmlOrNode);
  }
  if (typeof htmlOrNode.querySelector === 'function') {
    return Boolean(htmlOrNode.querySelector('img[src^="data:image"], img[data-mce-src^="data:image"]'));
  }
  return false;
};
