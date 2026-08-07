/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages, IntlShape } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  image: {
    id: 'course-authoring.files-and-uploads.wrapperType.image',
    defaultMessage: 'Image',
  },
  document: {
    id: 'course-authoring.files-and-uploads.wrapperType.document',
    defaultMessage: 'Document',
  },
  code: {
    id: 'course-authoring.files-and-uploads.wrapperType.code',
    defaultMessage: 'Code',
  },
  audio: {
    id: 'course-authoring.files-and-uploads.wrapperType.audio',
    defaultMessage: 'Audio',
  },
  other: {
    id: 'course-authoring.files-and-uploads.wrapperType.other',
    defaultMessage: 'Other',
  },
  video: {
    id: 'course-authoring.files-and-uploads.wrapperType.video',
    defaultMessage: 'Video',
  },
  unknown: {
    id: 'course-authoring.files-and-uploads.wrapperType.unknown',
    defaultMessage: 'Unknown',
  },
});

/** Localize known file/video wrapper types; leave format codes (MP4, MOV) as-is. */
export const getWrapperTypeLabel = (
  intl: IntlShape,
  wrapperType?: string | null,
): string => {
  if (!wrapperType) {
    return '';
  }
  const message = messages[wrapperType.toLowerCase() as keyof typeof messages];
  if (message) {
    return intl.formatMessage(message);
  }
  return wrapperType;
};

export default getWrapperTypeLabel;
