/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

export const notificationMessages = defineMessages({
  adding: {
    id: 'course-authoring.notification.adding',
    defaultMessage: 'Adding',
    description: 'Processing toast while a block is being added',
  },
  saving: {
    id: 'course-authoring.notification.saving',
    defaultMessage: 'Saving',
    description: 'Processing toast while changes are being saved',
  },
  duplicating: {
    id: 'course-authoring.notification.duplicating',
    defaultMessage: 'Duplicating',
    description: 'Processing toast while a block is being duplicated',
  },
  deleting: {
    id: 'course-authoring.notification.deleting',
    defaultMessage: 'Deleting',
    description: 'Processing toast while a block is being deleted',
  },
  copying: {
    id: 'course-authoring.notification.copying',
    defaultMessage: 'Copying',
    description: 'Processing toast while a block is being copied',
  },
  pasting: {
    id: 'course-authoring.notification.pasting',
    defaultMessage: 'Pasting',
    description: 'Processing toast while a block is being pasted',
  },
  discardChanges: {
    id: 'course-authoring.notification.discard-changes',
    defaultMessage: 'Discarding changes',
    description: 'Processing toast while discarding unpublished changes',
  },
  moving: {
    id: 'course-authoring.notification.moving',
    defaultMessage: 'Moving',
    description: 'Processing toast while a block is being moved',
  },
  undoMoving: {
    id: 'course-authoring.notification.undo-moving',
    defaultMessage: 'Undo moving',
    description: 'Processing toast while undoing a block move',
  },
  publishing: {
    id: 'course-authoring.notification.publishing',
    defaultMessage: 'Publishing',
    description: 'Processing toast while publishing',
  },
  hidingFromStudents: {
    id: 'course-authoring.notification.hiding-from-students',
    defaultMessage: 'Hiding from students',
    description: 'Processing toast while hiding content from students',
  },
  makingVisibleToStudents: {
    id: 'course-authoring.notification.making-visible-to-students',
    defaultMessage: 'Making visible to students',
    description: 'Processing toast while making content visible to students',
  },
});

export const courseBlockNameMessages = defineMessages({
  chapter: {
    id: 'course-authoring.course-block-name.chapter',
    defaultMessage: 'Section',
    description: 'Default display name for a new section (chapter)',
  },
  sequential: {
    id: 'course-authoring.course-block-name.sequential',
    defaultMessage: 'Subsection',
    description: 'Default display name for a new subsection',
  },
  vertical: {
    id: 'course-authoring.course-block-name.vertical',
    defaultMessage: 'Unit',
    description: 'Default display name for a new unit',
  },
  libraryContent: {
    id: 'course-authoring.course-block-name.library-content',
    defaultMessage: 'Library content',
    description: 'Display name for library content blocks',
  },
  splitTest: {
    id: 'course-authoring.course-block-name.split-test',
    defaultMessage: 'Split Test',
    description: 'Display name for split test blocks',
  },
  component: {
    id: 'course-authoring.course-block-name.component',
    defaultMessage: 'Component',
    description: 'Display name for component blocks',
  },
  itembank: {
    id: 'course-authoring.course-block-name.itembank',
    defaultMessage: 'Problem Bank',
    description: 'Display name for problem bank blocks',
  },
  legacyLibraryContent: {
    id: 'course-authoring.course-block-name.legacy-library-content',
    defaultMessage: 'Randomized Content Block',
    description: 'Display name for legacy randomized content blocks',
  },
});
