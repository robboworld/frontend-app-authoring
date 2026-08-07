import { formatAppMessage } from './constants/formatMessage';
import { courseBlockNameMessages, notificationMessages } from './constants/messages';

export const DATE_FORMAT = 'MM/dd/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss\\Z';
export const COMMA_SEPARATED_DATE_FORMAT = 'MMMM D, YYYY';
export const DEFAULT_EMPTY_WYSIWYG_VALUE = '<p>&nbsp;</p>';
export const STATEFUL_BUTTON_STATES = {
  default: 'default',
  pending: 'pending',
  error: 'error',
  disable: 'disable',
};

export const USER_ROLES = {
  admin: 'instructor',
  staff: 'staff',
};

export const BADGE_STATES = {
  danger: 'danger',
  secondary: 'secondary',
};

/**
 * Processing toast labels. Resolved via i18n so locale can switch (ru/en).
 * Access properties at call time (getters), not at module load.
 */
export const NOTIFICATION_MESSAGES = {
  get adding() { return formatAppMessage(notificationMessages.adding); },
  get saving() { return formatAppMessage(notificationMessages.saving); },
  get duplicating() { return formatAppMessage(notificationMessages.duplicating); },
  get deleting() { return formatAppMessage(notificationMessages.deleting); },
  get copying() { return formatAppMessage(notificationMessages.copying); },
  get pasting() { return formatAppMessage(notificationMessages.pasting); },
  get discardChanges() { return formatAppMessage(notificationMessages.discardChanges); },
  get moving() { return formatAppMessage(notificationMessages.moving); },
  get undoMoving() { return formatAppMessage(notificationMessages.undoMoving); },
  get publishing() { return formatAppMessage(notificationMessages.publishing); },
  get hidingFromStudents() { return formatAppMessage(notificationMessages.hidingFromStudents); },
  get makingVisibleToStudents() { return formatAppMessage(notificationMessages.makingVisibleToStudents); },
  empty: '',
};

export const DEFAULT_TIME_STAMP = '00:00';

export const COURSE_CREATOR_STATES = {
  unrequested: 'unrequested',
  pending: 'pending',
  granted: 'granted',
  denied: 'denied',
  disallowedForThisSite: 'disallowed_for_this_site',
} as const;

export const DECODED_ROUTES = {
  COURSE_UNIT: [
    '/container/:blockId/:sequenceId',
    '/container/:blockId',
  ],
};

export const UPLOAD_FILE_MAX_SIZE = 20 * 1024 * 1024; // 100mb

/**
 * Course block type metadata. `name` is locale-aware (i18n); `id` is stable.
 */
export const COURSE_BLOCK_NAMES = {
  chapter: {
    id: 'chapter',
    get name() { return formatAppMessage(courseBlockNameMessages.chapter); },
  },
  sequential: {
    id: 'sequential',
    get name() { return formatAppMessage(courseBlockNameMessages.sequential); },
  },
  vertical: {
    id: 'vertical',
    get name() { return formatAppMessage(courseBlockNameMessages.vertical); },
  },
  libraryContent: {
    id: 'library_content',
    get name() { return formatAppMessage(courseBlockNameMessages.libraryContent); },
  },
  splitTest: {
    id: 'split_test',
    get name() { return formatAppMessage(courseBlockNameMessages.splitTest); },
  },
  component: {
    id: 'component',
    get name() { return formatAppMessage(courseBlockNameMessages.component); },
  },
  itembank: {
    id: 'itembank',
    get name() { return formatAppMessage(courseBlockNameMessages.itembank); },
  },
  legacyLibraryContent: {
    id: 'library_content',
    get name() { return formatAppMessage(courseBlockNameMessages.legacyLibraryContent); },
  },
};

export const STUDIO_CLIPBOARD_CHANNEL = 'studio_clipboard_channel';

export const CLIPBOARD_STATUS = {
  loading: 'loading',
  ready: 'ready',
  expired: 'expired',
  error: 'error',
};

export const STRUCTURAL_XBLOCK_TYPES = ['vertical', 'sequential', 'chapter', 'course'];

export const REGEX_RULES = {
  specialCharsRule: /^[a-zA-Z0-9_\-.'*~\s]+$/,
  noSpaceRule: /^\S*$/,
};

/**
 * Feature policy for iframe, allowing access to certain courseware-related media.
 *
 * We must use the wildcard (*) origin for each feature, as courseware content
 * may be embedded in external iframes. Notably, xblock-lti-consumer is a popular
 * block that iframes external course content.

 * This policy was selected in conference with the edX Security Working Group.
 * Changes to it should be vetted by them (security@edx.org).
 */
export const IFRAME_FEATURE_POLICY =
  'microphone *; camera *; midi *; geolocation *; encrypted-media *; clipboard-write *';

export const iframeStateKeys = {
  iframeHeight: 'iframeHeight',
  hasLoaded: 'hasLoaded',
  showError: 'showError',
  windowTopOffset: 'windowTopOffset',
};

export const iframeMessageTypes = {
  modal: 'plugin.modal',
  resize: 'plugin.resize',
  videoFullScreen: 'plugin.videoFullScreen',
  xblockEvent: 'xblock-event',
  xblockScroll: 'xblock-scroll',
};

export const BROKEN = 'broken';

export const LOCKED = 'locked';

export const MANUAL = 'manual';

export enum AgreementGated {
  UPLOAD = 'upload',
  UPLOAD_VIDEOS = 'upload.videos',
  UPLOAD_FILES = 'upload.files',
}
