/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course deletion in Studio). See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  menuItem: {
    id: 'course-authoring.studio-home.robbo-delete-course.menu-item',
    defaultMessage: 'Delete course',
  },
  title: {
    id: 'course-authoring.studio-home.robbo-delete-course.title',
    defaultMessage: 'Delete the course?',
  },
  description: {
    id: 'course-authoring.studio-home.robbo-delete-course.description',
    defaultMessage: 'The course “{name}” will disappear from Studio and from the site together with all its content, and the course team will lose access to it. This cannot be undone.',
  },
  exportHint: {
    id: 'course-authoring.studio-home.robbo-delete-course.export-hint',
    defaultMessage: 'If the course may be needed later, save a copy via {exportLink} first.',
  },
  exportLink: {
    id: 'course-authoring.studio-home.robbo-delete-course.export-link',
    defaultMessage: 'course export',
  },
  enrollments: {
    id: 'course-authoring.studio-home.robbo-delete-course.enrollments',
    defaultMessage: '{count, plural, one {# learner is} other {# learners are}} enrolled in the course. It will disappear from learners’ course lists and stop opening; grades and payment records stay in the system.',
  },
  noEnrollments: {
    id: 'course-authoring.studio-home.robbo-delete-course.no-enrollments',
    defaultMessage: 'Nobody is enrolled in the course.',
  },
  summaryError: {
    id: 'course-authoring.studio-home.robbo-delete-course.summary-error',
    defaultMessage: 'Could not check how many learners are enrolled in the course.',
  },
  confirmLabel: {
    id: 'course-authoring.studio-home.robbo-delete-course.confirm-label',
    defaultMessage: 'To confirm, enter the course ID: {courseKey}',
  },
  cancel: {
    id: 'course-authoring.studio-home.robbo-delete-course.cancel',
    defaultMessage: 'Cancel',
  },
  delete: {
    id: 'course-authoring.studio-home.robbo-delete-course.delete',
    defaultMessage: 'Delete course',
  },
  deleting: {
    id: 'course-authoring.studio-home.robbo-delete-course.deleting',
    defaultMessage: 'Deleting…',
  },
  deleteError: {
    id: 'course-authoring.studio-home.robbo-delete-course.delete-error',
    defaultMessage: 'Could not delete the course. Reload the page and try again.',
  },
  deleted: {
    id: 'course-authoring.studio-home.robbo-delete-course.deleted',
    defaultMessage: 'Course “{name}” deleted',
  },
});

export default messages;
