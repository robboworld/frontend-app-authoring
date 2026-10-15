/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // Robbo: «Сбросить ограничения доступа» of a section
  resetGroupAccessTitle: {
    id: 'course-authoring.course-outline.section.reset-group-access.title',
    defaultMessage: 'Reset access restrictions?',
  },
  resetGroupAccessMessage: {
    id: 'course-authoring.course-outline.section.reset-group-access.message',
    defaultMessage: 'Group restrictions will be removed from the section “{sectionName}” and everything inside it: subsections, units and components. «Hide from learners» stays as it is.',
  },
  resetGroupAccessConfirm: {
    id: 'course-authoring.course-outline.section.reset-group-access.confirm',
    defaultMessage: 'Reset',
  },
  resetGroupAccessCancel: {
    id: 'course-authoring.course-outline.section.reset-group-access.cancel',
    defaultMessage: 'Cancel',
  },
  resetGroupAccessDone: {
    id: 'course-authoring.course-outline.section.reset-group-access.done',
    defaultMessage: '{count, plural, one {# restriction removed} other {# restrictions removed}}',
  },
  resetGroupAccessNothing: {
    id: 'course-authoring.course-outline.section.reset-group-access.nothing',
    defaultMessage: 'There were no access restrictions in the section',
  },
  resetGroupAccessError: {
    id: 'course-authoring.course-outline.section.reset-group-access.error',
    defaultMessage: 'Could not reset access restrictions',
  },
  sectionHighlightsBadge: {
    id: 'course-authoring.course-outline.section.badge.section-highlights',
    defaultMessage: 'Section highlights',
  },
  pasteButton: {
    id: 'course-authoring.course-outline.subsection.button.paste-unit',
    defaultMessage: 'Paste unit',
    description: 'Message of the button to paste a new unit in a subsection.',
  },
});

export default messages;
