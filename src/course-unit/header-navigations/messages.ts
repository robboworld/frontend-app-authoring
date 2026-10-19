import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  viewLiveButton: {
    id: 'course-authoring.course-unit.button.view-live',
    defaultMessage: 'View live version',
    description: 'The unit view live button text',
  },
  previewButton: {
    id: 'course-authoring.course-unit.button.preview',
    defaultMessage: 'Preview',
    description: 'The unit preview button text',
  },
  // Robbo: tooltips of the preview and view live buttons.
  previewTooltip: {
    id: 'course-authoring.course-unit.button.preview.robbo-tooltip',
    defaultMessage: 'The draft of the unit with all saved changes, unpublished ones too. Only the course team can see it.',
    description: 'Tooltip of the unit preview button',
  },
  viewLiveTooltip: {
    id: 'course-authoring.course-unit.button.view-live.robbo-tooltip',
    defaultMessage: 'The published version of the unit: what learners see. Unpublished changes are not in it.',
    description: 'Tooltip of the unit view live button',
  },
  viewLiveUnpublishedTooltip: {
    id: 'course-authoring.course-unit.button.view-live.robbo-tooltip-unpublished',
    defaultMessage: 'The unit is not published yet, so learners do not see it. Open the draft with Preview.',
    description: 'Tooltip of the unit view live button while the unit is not published',
  },
  editButton: {
    id: 'course-authoring.course-unit.button.edit',
    defaultMessage: 'Edit',
    description: 'The unit edit button text',
  },
  addButton: {
    id: 'course-authoring.course-unit.button.add',
    defaultMessage: 'Add',
    description: 'The unit add button text',
  },
  moreActionsButtonAriaLabel: {
    id: 'course-authoring.course-unit.button.more-actions',
    defaultMessage: 'More actions',
    description: 'The unit more actions button aria-label',
  },
  analyticsMenu: {
    id: 'course-authoring.course-unit.button.analytics',
    defaultMessage: 'Analytics',
    description: 'The unit analytics menu text',
  },
  alignMenu: {
    id: 'course-authoring.course-unit.button.align',
    defaultMessage: 'Align',
    description: 'The unit align menu text',
  },
  infoButton: {
    id: 'course-authoring.course-unit.button.unit-info',
    defaultMessage: 'Unit Info',
    description: 'The unit info button text',
  },
});

export default messages;
