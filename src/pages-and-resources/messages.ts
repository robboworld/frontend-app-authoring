import { defineMessages, type IntlShape } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  heading: {
    id: 'course-authoring.pages-resources.heading',
    defaultMessage: 'Pages & Resources',
  },
  settings: {
    id: 'course-authoring.pages-resources.resources.settings.button',
    defaultMessage: 'settings',
  },
  viewLiveButton: {
    id: 'course-authoring.pages-resources.viewLive.button',
    defaultMessage: 'View live',
  },
  errorShowingConfiguration: {
    id: 'course-authoring.pages-resources.courseAppPlugin.errorMessage',
    defaultMessage: 'An error occurred when loading the configuration UI for that app.',
  },
  enabled: {
    id: 'course-authoring.badge.enabled',
    defaultMessage: 'Enabled',
  },
  contentPermissions: {
    id: 'course-authoring.pages-resources.content-permissions.heading',
    defaultMessage: 'Content permissions',
  },

  // Course app card labels (API often returns English; map by app id for locale switching)
  progressName: {
    id: 'course-authoring.pages-resources.app.progress.name',
    defaultMessage: 'Progress',
  },
  progressDescription: {
    id: 'course-authoring.pages-resources.app.progress.description',
    defaultMessage: 'Keep learners engaged and on track throughout the course.',
  },
  discussionName: {
    id: 'course-authoring.pages-resources.app.discussion.name',
    defaultMessage: 'Discussion',
  },
  discussionDescription: {
    id: 'course-authoring.pages-resources.app.discussion.description',
    defaultMessage: 'Encourage participation and engagement in your course with discussions.',
  },
  teamsName: {
    id: 'course-authoring.pages-resources.app.teams.name',
    defaultMessage: 'Teams',
  },
  teamsDescription: {
    id: 'course-authoring.pages-resources.app.teams.description',
    defaultMessage: 'Leverage teams to allow learners to connect by topic of interest.',
  },
  notesName: {
    id: 'course-authoring.pages-resources.app.edxnotes.name',
    defaultMessage: 'Notes',
  },
  notesDescription: {
    id: 'course-authoring.pages-resources.app.edxnotes.description',
    defaultMessage: 'Allow learners to highlight passages and make notes right in the course.',
  },
  wikiName: {
    id: 'course-authoring.pages-resources.app.wiki.name',
    defaultMessage: 'Wiki',
  },
  wikiDescription: {
    id: 'course-authoring.pages-resources.app.wiki.description',
    defaultMessage: 'Enable learners to access, and collaborate on course-related information.',
  },
  calculatorName: {
    id: 'course-authoring.pages-resources.app.calculator.name',
    defaultMessage: 'Calculator',
  },
  calculatorDescription: {
    id: 'course-authoring.pages-resources.app.calculator.description',
    defaultMessage: 'Provide an in-course calculator for simple and complex calculations.',
  },
  proctoringName: {
    id: 'course-authoring.pages-resources.app.proctoring.name',
    defaultMessage: 'Proctoring',
  },
  proctoringDescription: {
    id: 'course-authoring.pages-resources.app.proctoring.description',
    defaultMessage: 'Maintain exam integrity by enabling a proctoring solution for your course',
  },
  liveName: {
    id: 'course-authoring.pages-resources.app.live.name',
    defaultMessage: 'Live',
  },
  liveDescription: {
    id: 'course-authoring.pages-resources.app.live.description',
    defaultMessage: 'Enable in-platform video conferencing by configuring live',
  },
  textbooksName: {
    id: 'course-authoring.pages-resources.app.textbooks.name',
    defaultMessage: 'Textbooks',
  },
  textbooksDescription: {
    id: 'course-authoring.pages-resources.app.textbooks.description',
    defaultMessage: 'Create and manage a library of course readings, textbooks, and chapters.',
  },
  customPagesName: {
    id: 'course-authoring.pages-resources.app.custom_pages.name',
    defaultMessage: 'Custom pages',
  },
  customPagesDescription: {
    id: 'course-authoring.pages-resources.app.custom_pages.description',
    defaultMessage: 'Provide additional course content and resources with custom pages',
  },
  oraSettingsName: {
    id: 'course-authoring.pages-resources.app.ora_settings.name',
    defaultMessage: 'Flexible Peer Grading for ORAs',
  },
  oraSettingsDescription: {
    id: 'course-authoring.pages-resources.app.ora_settings.description',
    defaultMessage: 'Course level settings for Flexible Peer Grading Open Response Assessments.',
  },
});

const COURSE_APP_MESSAGE_KEYS: Record<string, { name: keyof typeof messages; description: keyof typeof messages; }> = {
  progress: { name: 'progressName', description: 'progressDescription' },
  discussion: { name: 'discussionName', description: 'discussionDescription' },
  teams: { name: 'teamsName', description: 'teamsDescription' },
  edxnotes: { name: 'notesName', description: 'notesDescription' },
  wiki: { name: 'wikiName', description: 'wikiDescription' },
  calculator: { name: 'calculatorName', description: 'calculatorDescription' },
  proctoring: { name: 'proctoringName', description: 'proctoringDescription' },
  live: { name: 'liveName', description: 'liveDescription' },
  textbooks: { name: 'textbooksName', description: 'textbooksDescription' },
  custom_pages: { name: 'customPagesName', description: 'customPagesDescription' },
  ora_settings: { name: 'oraSettingsName', description: 'oraSettingsDescription' },
};

/** Locale-aware course app card labels; falls back to API values for unknown apps. */
export function getCourseAppCardLabels(
  intl: IntlShape,
  appId: string,
  fallbackName: string,
  fallbackDescription: string,
): { name: string; description: string; } {
  const keys = COURSE_APP_MESSAGE_KEYS[appId];
  if (!keys) {
    return { name: fallbackName, description: fallbackDescription };
  }
  return {
    name: intl.formatMessage(messages[keys.name]),
    description: intl.formatMessage(messages[keys.description]),
  };
}

export default messages;
