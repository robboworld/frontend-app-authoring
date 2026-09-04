const getLocatorSafeName = ({ displayName }) => {
  const locatorSafeName = displayName.replace(/[^\w.%-]/gm, '');
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
