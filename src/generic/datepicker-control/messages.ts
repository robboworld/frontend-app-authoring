import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  calendarAltText: {
    id: 'course-authoring.schedule.schedule-section.alt-text',
    defaultMessage: 'Calendar for datepicker input',
  },
  timeAltText: {
    id: 'course-authoring.schedule.schedule-section.alt-time-text',
    defaultMessage: 'Time input',
  },
  datepickerUTC: {
    id: 'course-authoring.schedule.schedule-section.datepicker.utc',
    defaultMessage: 'UTC',
  },
  timepickerAriaLabel: {
    id: 'course-authoring.schedule.schedule-section.timepicker.aria-label',
    defaultMessage: 'Time input field. Enter a time or use the arrow keys to adjust.',
  },
  timepickerScreenreaderHint: {
    id: 'course-authoring.schedule.schedule-section.timepicker.screenreader-hint',
    defaultMessage: 'Enter time in {timeFormat} or twelve-hour format, for example 6:00 PM.',
  },
  timePlaceholder: {
    id: 'course-authoring.schedule.schedule-section.timepicker.placeholder',
    defaultMessage: 'HH:MM',
    description: 'Placeholder text for time inputs in schedule datepicker',
  },
  datePlaceholder: {
    id: 'course-authoring.schedule.schedule-section.datepicker.placeholder',
    defaultMessage: 'MM/DD/YYYY',
    description: 'Placeholder text for date inputs in schedule datepicker',
  },
});

export default messages;
