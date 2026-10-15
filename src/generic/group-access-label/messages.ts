/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course groups). See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  accessRestricted: {
    id: 'course-authoring.group-access-label.access-restricted',
    defaultMessage: 'Access restricted: {groups}',
    description: 'Group restriction of a section, subsection or unit; {groups} is shown in bold',
  },
  everyoneExcept: {
    id: 'course-authoring.group-access-label.everyone-except',
    defaultMessage: 'everyone except {groups}',
    description: 'Who has access when the content is hidden from the listed groups',
  },
  groupsCount: {
    id: 'course-authoring.group-access-label.groups-count',
    defaultMessage: '{count, plural, one {# group} other {# groups}}',
    description: 'Who has access: a number of groups',
  },
  everyoneExceptGroupsCount: {
    id: 'course-authoring.group-access-label.everyone-except-groups-count',
    defaultMessage: 'everyone except {count, plural, one {# group} other {# groups}}',
    description: 'Who has access when the content is hidden from a number of groups',
  },
  lockedTitle: {
    id: 'course-authoring.group-access-label.locked.title',
    defaultMessage: 'Editing is locked',
    description: 'Group access of a block that is part of a restricted section, subsection or unit',
  },
  lockedDescription: {
    id: 'course-authoring.group-access-label.locked.description',
    // One literal: message extraction does not take concatenated strings.
    defaultMessage: '{itemType, select, sequential {This subsection} vertical {This unit} other {This component}} is part of the {ancestorType, select, chapter {section} sequential {subsection} other {unit}} “{ancestorName}”, which restricts visibility by groups. Change the restriction in the settings of that {ancestorType, select, chapter {section} sequential {subsection} other {unit}}.',
    description: 'Why the group access of a block cannot be edited and where to change it',
  },
  ownRestriction: {
    id: 'course-authoring.group-access-label.locked.own',
    defaultMessage: '{itemType, select, sequential {This subsection} vertical {This unit} other {This component}} also has its own restriction, it applies together with the one above:',
    description: 'A locked block still has the group access rule it set itself',
  },
  clearOwnRestriction: {
    id: 'course-authoring.group-access-label.locked.clear-own',
    defaultMessage: 'Remove own restriction',
  },
  ownRestrictionWillBeCleared: {
    id: 'course-authoring.group-access-label.locked.own-will-be-cleared',
    defaultMessage: 'The own restriction will be removed when you save.',
  },
  undoClearOwnRestriction: {
    id: 'course-authoring.group-access-label.locked.undo-clear-own',
    defaultMessage: 'Keep it',
  },
});

export default messages;
