import { defineMessages, type IntlShape } from '@edx/frontend-platform/i18n';
import { COMPONENT_TYPES } from '@src/generic/block-type-utils/constants';

const messages = defineMessages({
  title: {
    id: 'course-authoring.course-unit.add.component.title',
    defaultMessage: 'Add a new component',
    description: 'Title text for add component section in course unit.',
  },
  buttonText: {
    id: 'course-authoring.course-unit.add.component.button.text',
    defaultMessage: 'Add Component:',
    description: 'Information text for screen-readers about each add component button',
  },
  typeHtml: {
    id: 'course-authoring.course-unit.add.component.type.html',
    defaultMessage: 'Text',
    description: 'Label for the Text/HTML component type button',
  },
  typeVideo: {
    id: 'course-authoring.course-unit.add.component.type.video',
    defaultMessage: 'Video',
    description: 'Label for the Video component type button',
  },
  typeProblem: {
    id: 'course-authoring.course-unit.add.component.type.problem',
    defaultMessage: 'Problem',
    description: 'Label for the Problem component type button',
  },
  typeOpenResponse: {
    id: 'course-authoring.course-unit.add.component.type.openassessment',
    defaultMessage: 'Open Response',
    description: 'Label for the Open Response Assessment component type button',
  },
  typeProblemBank: {
    id: 'course-authoring.course-unit.add.component.type.itembank',
    defaultMessage: 'Problem Bank',
    description: 'Label for the Problem Bank component type button',
  },
  typeDragAndDrop: {
    id: 'course-authoring.course-unit.add.component.type.drag-and-drop-v2',
    defaultMessage: 'Drag and Drop',
    description: 'Label for the Drag and Drop component type button',
  },
  typeLibraryContent: {
    id: 'course-authoring.course-unit.add.component.type.library_v2',
    defaultMessage: 'Library Content',
    description: 'Label for the Library Content (v2) component type button',
  },
  typeLegacyLibrary: {
    id: 'course-authoring.course-unit.add.component.type.library',
    defaultMessage: 'Legacy Library',
    description: 'Label for the Legacy Library component type button',
  },
  typeAdvanced: {
    id: 'course-authoring.course-unit.add.component.type.advanced',
    defaultMessage: 'Advanced',
    description: 'Label for the Advanced component type button',
  },
  typeDiscussion: {
    id: 'course-authoring.course-unit.add.component.type.discussion',
    defaultMessage: 'Discussion',
    description: 'Label for the Discussion component type button',
  },
  betaBadge: {
    id: 'course-authoring.course-unit.add.component.beta',
    defaultMessage: 'Beta',
    description: 'Badge for beta component types',
  },
  modalBtnText: {
    id: 'course-authoring.course-unit.modal.button.text',
    defaultMessage: 'Select',
    description: 'Information text for screen-readers about each add component button',
  },
  singleComponentPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.single-title.text',
    defaultMessage: 'Select component',
    description: 'Library content picker modal title.',
  },
  multipleComponentPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.multiple-title.text',
    defaultMessage: 'Select components',
    description: 'Problem bank component picker modal title.',
  },
  multipleComponentPickerModalBtn: {
    id: 'course-authoring.course-unit.modal.multiple-btn.text',
    defaultMessage: 'Add selected components',
    description: 'Problem bank component add button text.',
  },
  videoPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.video-title.text',
    defaultMessage: 'Select video',
    description: 'Video picker modal title.',
  },
  modalContainerTitle: {
    id: 'course-authoring.course-unit.modal.container.title',
    defaultMessage: 'Add {componentTitle} component',
    description: 'Modal title for adding components',
  },
  modalContainerCancelBtnText: {
    id: 'course-authoring.course-unit.modal.container.cancel.button.text',
    defaultMessage: 'Cancel',
    description: 'Modal cancel button text.',
  },
  modalComponentSupportLabelFullySupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.fully-supported',
    defaultMessage: 'Fully supported',
    description: 'Label for advance problem type\'s support status with full platform support',
  },
  modalComponentSupportLabelProvisionallySupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.provisionally-support',
    defaultMessage: 'Provisionally supported',
    description: 'Label for advance problem type\'s support status with provisional platform support',
  },
  modalComponentSupportLabelNotSupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.not-supported',
    defaultMessage: 'Not supported',
    description: 'Label for advance problem type\'s support status with no platform support',
  },
  modalComponentSupportTooltipFullySupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.fully-supported',
    defaultMessage: 'Fully supported tools and features are available for Open edX installations, '
      + 'are fully tested, have user interfaces where applicable, and are documented in the '
      + 'official Open edX guides that are available on docs.openedx.org.',
    description: 'Message for support status tooltip for modules with full platform support',
  },
  modalComponentSupportTooltipNotSupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.not-supported',
    defaultMessage: 'Tools with no support are not maintained by the Open edX community, '
      + 'and might be deprecated in the future. They are not recommended for use in '
      + 'courses due to non-compliance with one or more of the base requirements, such as '
      + 'testing, accessibility, internationalization, and documentation.',
    description: 'Message for support status tooltip for modules which is not supported',
  },
  modalComponentSupportTooltipProvisionallySupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.provisionally-support',
    defaultMessage: 'Provisionally supported tools might lack the robustness of functionality '
      + 'that your courses require. Open edX does not have control over the quality of the software, '
      + 'or of the content that can be provided using these tools. Test these tools thoroughly '
      + 'before using them in your course, especially in graded sections. Complete documentation '
      + 'might not be available for provisionally supported tools, or documentation might be '
      + 'available from sources other than the Open edX community.',
    description: 'Message for support status tooltip for modules with provisional platform support',
  },
});

const COMPONENT_TYPE_MESSAGE_KEYS: Record<string, keyof typeof messages> = {
  [COMPONENT_TYPES.html]: 'typeHtml',
  [COMPONENT_TYPES.video]: 'typeVideo',
  [COMPONENT_TYPES.problem]: 'typeProblem',
  [COMPONENT_TYPES.openassessment]: 'typeOpenResponse',
  [COMPONENT_TYPES.itembank]: 'typeProblemBank',
  [COMPONENT_TYPES.dragAndDrop]: 'typeDragAndDrop',
  [COMPONENT_TYPES.libraryV2]: 'typeLibraryContent',
  [COMPONENT_TYPES.library]: 'typeLegacyLibrary',
  [COMPONENT_TYPES.advanced]: 'typeAdvanced',
  [COMPONENT_TYPES.discussion]: 'typeDiscussion',
};

/** Locale-aware label for add-component buttons; falls back to CMS displayName. */
export function getComponentTypeLabel(
  intl: IntlShape,
  type: string,
  fallbackDisplayName: string,
): string {
  const messageKey = COMPONENT_TYPE_MESSAGE_KEYS[type];
  if (!messageKey) {
    return fallbackDisplayName;
  }
  return intl.formatMessage(messages[messageKey]);
}

export default messages;
