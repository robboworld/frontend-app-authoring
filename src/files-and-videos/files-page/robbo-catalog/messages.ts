/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  usageCourseImage: {
    id: 'robbo.files.usage.course-image',
    defaultMessage: 'Course design: card image',
    description: 'Where a file is used: the course card image in Schedule & Details',
  },
  usageBannerImage: {
    id: 'robbo.files.usage.banner-image',
    defaultMessage: 'Course design: banner',
    description: 'Where a file is used: the course banner image in Schedule & Details',
  },
  usageVideoThumbnail: {
    id: 'robbo.files.usage.video-thumbnail',
    defaultMessage: 'Course design: course video thumbnail',
    description: 'Where a file is used: the thumbnail of the course about video',
  },
  usageAbout: {
    id: 'robbo.files.usage.about',
    defaultMessage: 'Course description',
    description: 'Where a file is used: the course about page (overview and other about texts)',
  },
  usageCertificate: {
    id: 'robbo.files.usage.certificate',
    defaultMessage: 'Certificate "{name}": signature',
    description: 'Where a file is used: a signatory signature image of a certificate',
  },
  usageCertificateSignatory: {
    id: 'robbo.files.usage.certificate-signatory',
    defaultMessage: 'Certificate "{name}": signature of {signatory}',
    description: 'Where a file is used: the signature image of a named signatory of a certificate',
  },
  usageTextbook: {
    id: 'robbo.files.usage.textbook',
    defaultMessage: 'Textbook "{name}"',
    description: 'Where a file is used: a chapter of a course textbook',
  },
  usagePage: {
    id: 'robbo.files.usage.page',
    defaultMessage: 'Page "{name}"',
    description: 'Where a file is used: a custom course page',
  },
  usageUpdates: {
    id: 'robbo.files.usage.updates',
    defaultMessage: 'Course updates',
    description: 'Where a file is used: the course updates (news) page',
  },
  usageHandouts: {
    id: 'robbo.files.usage.handouts',
    defaultMessage: 'Course handouts',
    description: 'Where a file is used: the course handouts sidebar',
  },
  usageCourseSettings: {
    id: 'robbo.files.usage.course-settings',
    defaultMessage: 'Advanced settings: {field}',
    description: 'Where a file is used: an advanced course setting (field name)',
  },
  usagePublishedOnly: {
    id: 'robbo.files.usage.published-only',
    defaultMessage: '{location} (published version only)',
    description: 'The file is used only in the published version, the draft no longer refers to it',
  },
  usageOtherCourse: {
    id: 'robbo.files.usage.other-course',
    defaultMessage: '{location} — links to the file of another course {course}',
    description: 'The reference points to a file with the same name in another course run',
  },
  // Catalog tree
  catalogNavLabel: { id: 'robbo.files.catalog.nav-label', defaultMessage: 'Files catalog', description: 'Accessible name of the catalog tree' },
  catalogSelectLabel: { id: 'robbo.files.catalog.select-label', defaultMessage: 'Show', description: 'Label of the catalog dropdown on narrow screens' },
  nodeAll: { id: 'robbo.files.catalog.all', defaultMessage: 'All files', description: 'Catalog node: every file of the course' },
  nodeDesign: { id: 'robbo.files.catalog.design', defaultMessage: 'Course design', description: 'Catalog node: course card image, banner, about page' },
  nodeCertificate: { id: 'robbo.files.catalog.certificate', defaultMessage: 'Certificate', description: 'Catalog node: certificate signatures' },
  nodePages: { id: 'robbo.files.catalog.pages', defaultMessage: 'Pages and textbooks', description: 'Catalog node: textbooks, custom pages, updates, handouts' },
  nodeSettings: { id: 'robbo.files.catalog.settings', defaultMessage: 'Course settings', description: 'Catalog node: advanced settings' },
  nodeStructure: { id: 'robbo.files.catalog.structure', defaultMessage: 'By course outline', description: 'Catalog node: files grouped by section, subsection and unit' },
  nodeFolders: { id: 'robbo.files.catalog.folders', defaultMessage: 'My folders', description: 'Catalog node: author folders' },
  nodeNoFolder: { id: 'robbo.files.catalog.no-folder', defaultMessage: 'No folder', description: 'Catalog node: files outside any author folder' },
  nodeUnused: { id: 'robbo.files.catalog.unused', defaultMessage: 'Not in use', description: 'Catalog node: files nothing in the course refers to' },
  nodeUntitled: { id: 'robbo.files.catalog.untitled', defaultMessage: 'Untitled', description: 'Name of a section, subsection or unit without a title' },
  unusedHint: {
    id: 'robbo.files.catalog.unused-hint',
    defaultMessage: 'Links from other courses and other sites are not visible here. Check before deleting.',
    description: 'Warning above the list of files not used in the course',
  },
  expandNode: { id: 'robbo.files.catalog.expand', defaultMessage: 'Expand "{name}"', description: 'Accessible label of the expand button' },
  collapseNode: { id: 'robbo.files.catalog.collapse', defaultMessage: 'Collapse "{name}"', description: 'Accessible label of the collapse button' },
  newFolder: { id: 'robbo.files.catalog.new-folder', defaultMessage: 'New folder', description: 'Button that creates an author folder' },
  folderMenu: { id: 'robbo.files.catalog.folder-menu', defaultMessage: 'Actions with folder "{name}"', description: 'Accessible label of the folder menu' },
  renameFolder: { id: 'robbo.files.catalog.rename-folder', defaultMessage: 'Rename', description: 'Folder menu item' },
  deleteFolder: { id: 'robbo.files.catalog.delete-folder', defaultMessage: 'Delete folder', description: 'Folder menu item' },
  pendingFolderHint: {
    id: 'robbo.files.catalog.pending-folder-hint',
    defaultMessage: 'While the folder is empty, it is visible only in this browser. Upload or move files into it.',
    description: 'Hint for a folder that has no files yet',
  },
  folderColumn: { id: 'robbo.files.catalog.folder-column', defaultMessage: 'Folder', description: 'Column with the author folder of a file' },

  // Folder name dialog
  newFolderTitle: { id: 'robbo.files.folder-dialog.new-title', defaultMessage: 'New folder', description: 'Title of the new folder dialog' },
  renameFolderTitle: { id: 'robbo.files.folder-dialog.rename-title', defaultMessage: 'Rename folder', description: 'Title of the rename folder dialog' },
  folderNameLabel: { id: 'robbo.files.folder-dialog.name-label', defaultMessage: 'Folder name', description: 'Label of the folder name field' },
  folderNameEmpty: { id: 'robbo.files.folder-dialog.name-empty', defaultMessage: 'Enter a name', description: 'Validation: empty folder name' },
  folderNameExists: { id: 'robbo.files.folder-dialog.name-exists', defaultMessage: 'A folder with this name already exists', description: 'Validation: duplicate folder name' },
  folderCreate: { id: 'robbo.files.folder-dialog.create', defaultMessage: 'Create', description: 'Button: create folder' },
  folderSave: { id: 'robbo.files.folder-dialog.save', defaultMessage: 'Save', description: 'Button: save folder name' },
  cancel: { id: 'robbo.files.dialog.cancel', defaultMessage: 'Cancel', description: 'Button: close a dialog without changes' },
  deleteFolderTitle: { id: 'robbo.files.folder-dialog.delete-title', defaultMessage: 'Delete folder "{name}"?', description: 'Title of the delete folder dialog' },
  deleteFolderBody: {
    id: 'robbo.files.folder-dialog.delete-body',
    defaultMessage: 'The files stay in the course and go to "No folder". Their links do not change.',
    description: 'What happens to the files of a deleted folder',
  },
  deleteFolderConfirm: { id: 'robbo.files.folder-dialog.delete-confirm', defaultMessage: 'Delete folder', description: 'Button: delete folder' },

  // Move to folder
  moveMenuItem: { id: 'robbo.files.move.menu-item', defaultMessage: 'Move to folder…', description: 'File menu item and bulk action' },
  moveTitle: {
    id: 'robbo.files.move.title',
    defaultMessage: 'Move {count, plural, one {# file} other {# files}} to folder',
    description: 'Title of the move to folder dialog',
  },
  moveNewFolder: { id: 'robbo.files.move.new-folder', defaultMessage: 'New folder…', description: 'Option: move into a new folder' },
  moveHint: {
    id: 'robbo.files.move.hint',
    defaultMessage: 'File addresses do not change, so links in the course keep working.',
    description: 'Moving files between folders does not break links',
  },
  moveConfirm: { id: 'robbo.files.move.confirm', defaultMessage: 'Move', description: 'Button: move files' },
  moveError: { id: 'robbo.files.move.error', defaultMessage: 'Could not move the files to the folder.', description: 'Error after a failed move' },
  movedToFolder: {
    id: 'robbo.files.move.done',
    defaultMessage: '{count, plural, one {# file moved} other {# files moved}} to "{folder}"',
    description: 'Toast after moving files into a folder',
  },
  movedOutOfFolders: {
    id: 'robbo.files.move.done-no-folder',
    defaultMessage: '{count, plural, one {# file is} other {# files are}} now outside folders',
    description: 'Toast after moving files out of folders',
  },

  // Upload conflicts
  conflictTitle: {
    id: 'robbo.files.conflict.title',
    defaultMessage: '{count, plural, one {A file with this name is} other {Files with these names are}} already in the course',
    description: 'Title of the upload conflict dialog',
  },
  conflictIntro: {
    id: 'robbo.files.conflict.intro',
    defaultMessage: 'A replaced file changes everywhere the old one is used. A copy is saved under a new name, and the old file stays as it is.',
    description: 'Explains replace vs copy',
  },
  conflictUsedIn: { id: 'robbo.files.conflict.used-in', defaultMessage: 'Used now:', description: 'Where the existing file is used' },
  conflictNotUsed: { id: 'robbo.files.conflict.not-used', defaultMessage: 'Not used anywhere now', description: 'The existing file is not used' },
  conflictMore: { id: 'robbo.files.conflict.more', defaultMessage: 'and {count} more', description: 'More places of use not listed' },
  conflictFolder: { id: 'robbo.files.conflict.folder', defaultMessage: 'Folder: {folder}', description: 'Folder of the existing file' },
  conflictCopy: { id: 'robbo.files.conflict.copy', defaultMessage: 'Save as a copy: "{name}"', description: 'Option: upload under a new name' },
  conflictReplace: { id: 'robbo.files.conflict.replace', defaultMessage: 'Replace the file', description: 'Option: overwrite the existing file' },
  conflictChoiceLabel: { id: 'robbo.files.conflict.choice-label', defaultMessage: 'What to do with "{name}"', description: 'Accessible name of the choice for one file' },
  conflictAllCopy: { id: 'robbo.files.conflict.all-copy', defaultMessage: 'Save all as copies', description: 'Set copy for every file' },
  conflictAllReplace: { id: 'robbo.files.conflict.all-replace', defaultMessage: 'Replace all', description: 'Set replace for every file' },
  conflictUpload: { id: 'robbo.files.conflict.upload', defaultMessage: 'Upload', description: 'Button: upload with the chosen options' },

  // Upload results
  uploadRenamed: {
    id: 'robbo.files.upload.renamed',
    defaultMessage: '"{original}" is already in the course, the new file is saved as "{name}"',
    description: 'Toast: the upload got a new name',
  },
  uploadReused: {
    id: 'robbo.files.upload.reused',
    defaultMessage: 'The same file "{name}" is already in the course, it is used instead',
    description: 'Toast: the uploaded content already exists',
  },
  uploadReplaced: { id: 'robbo.files.upload.replaced', defaultMessage: 'File "{name}" replaced', description: 'Toast: a file was replaced' },
  uploadSummary: {
    id: 'robbo.files.upload.summary',
    defaultMessage: 'Uploaded: {total}. Saved under a new name: {renamed}. Already in the course: {reused}.',
    description: 'Toast after uploading several files with name conflicts',
  },

  // Delete guard
  deleteUsedConfirm: { id: 'robbo.files.delete.used-confirm', defaultMessage: 'Delete anyway', description: 'Delete button when files are used' },
  deleteExternalNote: {
    id: 'robbo.files.delete.external-note',
    defaultMessage: 'Links to these files from other courses and other sites are not visible here.',
    description: 'Note in the delete dialog',
  },
});

export default messages;
