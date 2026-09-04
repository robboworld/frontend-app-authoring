/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  base64ImagePasteWarning: {
    id: 'authoring.tinymce.base64ImagePasteWarning',
    defaultMessage:
      'Pasting images as base64 overloads the course. Prefer uploading the file via “Add Image” instead.',
    description:
      'Warning when an author pastes or inserts an inline base64 (data:image) image into TinyMCE',
  },
  base64ImagePasteAction: {
    id: 'authoring.tinymce.base64ImagePasteAction',
    defaultMessage: 'Add Image',
    description: 'Toast action that opens the image upload modal after a base64 paste warning',
  },
  desktopFilePasteHint: {
    id: 'authoring.tinymce.desktopFilePasteHint',
    defaultMessage:
      'Copying a file from the desktop does not put the image in the browser clipboard. Use “Add Image” or drag the file into the editor.',
    description: 'Hint when Ctrl+V after copying an image file in the OS file manager does nothing',
  },
  imageUploadFailed: {
    id: 'authoring.tinymce.imageUploadFailed',
    defaultMessage: 'Could not upload the image. Try “Add Image” instead.',
    description: 'Error toast when clipboard/drag image upload to course assets fails',
  },
  imageUploading: {
    id: 'authoring.tinymce.imageUploading',
    defaultMessage: 'Uploading image…',
    description: 'Toast while uploading a pasted or dropped image as a course asset',
  },
});

export default messages;
