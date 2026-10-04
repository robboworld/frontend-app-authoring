import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  createNewCourse: {
    id: 'course-authoring.studio-home.new-course.title',
    defaultMessage: 'Create a new course',
  },
  archiveLabel: {
    id: 'course-authoring.studio-home.new-course.archive.label',
    defaultMessage: 'Create from an exported course',
  },
  archiveChoose: {
    id: 'course-authoring.studio-home.new-course.archive.choose',
    defaultMessage: 'Choose .tar.gz file',
  },
  archiveReading: {
    id: 'course-authoring.studio-home.new-course.archive.reading',
    defaultMessage: 'Reading the file…',
  },
  archiveChosen: {
    id: 'course-authoring.studio-home.new-course.archive.chosen',
    defaultMessage: 'File: {fileName}',
  },
  archiveRemove: {
    id: 'course-authoring.studio-home.new-course.archive.remove',
    defaultMessage: 'Remove',
  },
  archiveHelpText: {
    id: 'course-authoring.studio-home.new-course.archive.help-text',
    defaultMessage: 'Optional. Choose a file from course export: the fields below are filled from it, and its content is imported into the new course right after creation.',
  },
  archiveChosenHelpText: {
    id: 'course-authoring.studio-home.new-course.archive.chosen.help-text',
    defaultMessage: 'Fields are filled from the file. If a course with this code already exists, change the course run. After creation, the import page opens and the content upload starts automatically.',
  },
  archiveReadError: {
    id: 'course-authoring.studio-home.new-course.archive.read-error',
    defaultMessage: 'Could not read the file. Choose a .tar.gz file downloaded via course export.',
  },
});

export default messages;
