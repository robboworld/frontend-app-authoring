/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  sectionTitle: {
    id: 'course-authoring.robbo-problem-settings.section.title',
    defaultMessage: 'Problem settings',
    description: 'Title of the sidebar section that applies settings to all problems of a unit, subsection, section or course',
  },
  sectionText: {
    id: 'course-authoring.robbo-problem-settings.section.text',
    defaultMessage: 'Change the settings of all problems of this {category, select, course {course} chapter {section} sequential {subsection} other {unit}} at once.',
    description: 'Text of the problem settings sidebar section',
  },
  openButton: {
    id: 'course-authoring.robbo-problem-settings.section.button',
    defaultMessage: 'Set up problems',
    description: 'Button that opens the problem settings modal',
  },
  modalTitle: {
    id: 'course-authoring.robbo-problem-settings.modal.title',
    defaultMessage: 'Problem settings: {name}',
    description: 'Title of the modal that applies settings to all problems inside a block',
  },
  modalIntro: {
    id: 'course-authoring.robbo-problem-settings.modal.intro',
    defaultMessage: 'The chosen settings are written into every problem of the {category, select, course {course} chapter {section} sequential {subsection} other {unit}}: {problems, plural, =0 {there are no problems yet} one {# problem} other {# problems}}. Settings left on "Keep as is" do not change.',
    description: 'Intro of the problem settings modal',
  },
  modalPublishNote: {
    id: 'course-authoring.robbo-problem-settings.modal.publish-note',
    defaultMessage: 'Published problems change for learners right away. In a problem with unpublished edits the change joins the draft. Problems added later are set up as usual.',
    description: 'How the changes reach learners',
  },
  keep: {
    id: 'course-authoring.robbo-problem-settings.keep',
    defaultMessage: 'Keep as is',
    description: 'Option that leaves a setting of the problems unchanged',
  },
  shuffleHint: {
    id: 'course-authoring.robbo-problem-settings.shuffle.hint',
    defaultMessage: 'Single and multiple choice problems only: {count, plural, =0 {there are none here} one {# problem} other {# problems}}.',
    description: 'Which problems the shuffle setting applies to',
  },
  shuffleSkipped: {
    id: 'course-authoring.robbo-problem-settings.shuffle.skipped',
    defaultMessage: '{count, plural, one {# problem} other {# problems}} with a Python script or an answer pool will not change.',
    description: 'Choice problems the shuffle setting leaves out',
  },
  attemptsUnlimited: {
    id: 'course-authoring.robbo-problem-settings.attempts.unlimited',
    defaultMessage: 'Unlimited',
    description: 'Option: unlimited attempts',
  },
  attemptsNumber: {
    id: 'course-authoring.robbo-problem-settings.attempts.number',
    defaultMessage: 'Number of attempts',
    description: 'Option: a given number of attempts',
  },
  numberLabel: {
    id: 'course-authoring.robbo-problem-settings.number.label',
    defaultMessage: 'Number',
    description: 'Label of a number field in the problem settings modal',
  },
  resetShow: {
    id: 'course-authoring.robbo-problem-settings.reset.show',
    defaultMessage: 'Show',
    description: 'Option: show the Reset button',
  },
  resetHide: {
    id: 'course-authoring.robbo-problem-settings.reset.hide',
    defaultMessage: 'Do not show',
    description: 'Option: do not show the Reset button',
  },
  timerSet: {
    id: 'course-authoring.robbo-problem-settings.timer.set',
    defaultMessage: 'Set, in seconds',
    description: 'Option: set the time between attempts',
  },
  cancel: {
    id: 'course-authoring.robbo-problem-settings.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button of the problem settings modal',
  },
  apply: {
    id: 'course-authoring.robbo-problem-settings.apply',
    defaultMessage: 'Apply',
    description: 'Apply button of the problem settings modal',
  },
  loadError: {
    id: 'course-authoring.robbo-problem-settings.load-error',
    defaultMessage: 'Could not count the problems. Close the window and try again.',
    description: 'Error when the problem count could not be loaded',
  },
  applied: {
    id: 'course-authoring.robbo-problem-settings.applied',
    defaultMessage: '{changed, plural, =0 {All problems already had these settings} one {Settings changed in # problem} other {Settings changed in # problems}}',
    description: 'Toast after the settings are applied',
  },
  applyError: {
    id: 'course-authoring.robbo-problem-settings.apply-error',
    defaultMessage: 'Could not change the problem settings. Try again.',
    description: 'Toast when the settings could not be applied',
  },
});

export default messages;
