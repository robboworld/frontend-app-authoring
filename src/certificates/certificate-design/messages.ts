/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'course-authoring.certificates.robbo-design.title',
    defaultMessage: 'Certificate design',
  },
  hint: {
    id: 'course-authoring.certificates.robbo-design.hint',
    defaultMessage: 'Learners of this course get the certificate in the selected design. The change applies to certificates that were already issued.',
  },
  selected: {
    id: 'course-authoring.certificates.robbo-design.selected',
    defaultMessage: 'Selected',
  },
  defaultBadge: {
    id: 'course-authoring.certificates.robbo-design.default',
    defaultMessage: 'Default',
  },
  preview: {
    id: 'course-authoring.certificates.robbo-design.preview',
    defaultMessage: 'Preview',
  },
  previewUnavailable: {
    id: 'course-authoring.certificates.robbo-design.preview-unavailable',
    defaultMessage: 'Add a certificate below to preview designs with this course data.',
  },
  noThumbnail: {
    id: 'course-authoring.certificates.robbo-design.no-thumbnail',
    defaultMessage: 'No thumbnail',
  },
  loadError: {
    id: 'course-authoring.certificates.robbo-design.load-error',
    defaultMessage: 'Could not load certificate designs. Reload the page and try again.',
  },
  saveError: {
    id: 'course-authoring.certificates.robbo-design.save-error',
    defaultMessage: 'Could not save the design. Try again.',
  },
  edit: {
    id: 'course-authoring.certificates.robbo-design.edit',
    defaultMessage: "Edit",
  },
  upload: {
    id: 'course-authoring.certificates.robbo-design.upload',
    defaultMessage: "Certificate builder",
  },
  editorCreateTitle: {
    id: 'course-authoring.certificates.robbo-design.editor.create-title',
    defaultMessage: "New certificate design",
  },
  editorEditTitle: {
    id: 'course-authoring.certificates.robbo-design.editor.edit-title',
    defaultMessage: "Edit certificate design",
  },
  editorTitleLabel: {
    id: 'course-authoring.certificates.robbo-design.editor.title-label',
    defaultMessage: "Name",
  },
  editorDescriptionLabel: {
    id: 'course-authoring.certificates.robbo-design.editor.description-label',
    defaultMessage: "Description",
  },
  editorBackgroundLabel: {
    id: 'course-authoring.certificates.robbo-design.editor.background-label',
    defaultMessage: "Background",
  },
  editorBackgroundHint: {
    id: 'course-authoring.certificates.robbo-design.editor.background-hint',
    defaultMessage: "PNG or JPEG, landscape, up to 10 MB. Best: A4 at 300 dpi, 3508 × 2480 px, without the text that changes (name, course, date).",
  },
  editorBackgroundType: {
    id: 'course-authoring.certificates.robbo-design.editor.background-type',
    defaultMessage: "Choose a PNG or JPEG image.",
  },
  editorBackgroundSize: {
    id: 'course-authoring.certificates.robbo-design.editor.background-size',
    defaultMessage: "The image must be up to 10 MB.",
  },
  editorNoBackground: {
    id: 'course-authoring.certificates.robbo-design.editor.no-background',
    defaultMessage: "Upload a background to see the sheet",
  },
  editorFieldsTitle: {
    id: 'course-authoring.certificates.robbo-design.editor.fields-title',
    defaultMessage: "Fields",
  },
  editorFieldsHint: {
    id: 'course-authoring.certificates.robbo-design.editor.fields-hint',
    defaultMessage: "Positions are in percent of the sheet: X from the left edge, Y from the top. Text that does not fit the width and number of lines gets smaller.",
  },
  editorAddField: {
    id: 'course-authoring.certificates.robbo-design.editor.add-field',
    defaultMessage: "Add field",
  },
  editorPreviewLabel: {
    id: 'course-authoring.certificates.robbo-design.editor.preview-label',
    defaultMessage: "Certificate preview",
  },
  editorPreviewHint: {
    id: 'course-authoring.certificates.robbo-design.editor.preview-hint',
    defaultMessage: "Sample data. Signature and signatory come from the first certificate of this course.",
  },
  editorSave: {
    id: 'course-authoring.certificates.robbo-design.editor.save',
    defaultMessage: "Save",
  },
  editorSaving: {
    id: 'course-authoring.certificates.robbo-design.editor.saving',
    defaultMessage: "Saving",
  },
  editorCancel: {
    id: 'course-authoring.certificates.robbo-design.editor.cancel',
    defaultMessage: "Cancel",
  },
  editorSaveError: {
    id: 'course-authoring.certificates.robbo-design.editor.save-error',
    defaultMessage: "Could not save the design. Try again.",
  },
  editorArchive: {
    id: 'course-authoring.certificates.robbo-design.editor.archive',
    defaultMessage: "Delete",
  },
  editorArchiving: {
    id: 'course-authoring.certificates.robbo-design.editor.archiving',
    defaultMessage: "Deleting",
  },
  editorArchiveTitle: {
    id: 'course-authoring.certificates.robbo-design.editor.archive-title',
    defaultMessage: "Delete design “{title}”?",
  },
  editorArchiveBody: {
    id: 'course-authoring.certificates.robbo-design.editor.archive-body',
    defaultMessage: "Courses that use it will switch to the default design, including certificates that were already issued.",
  },
  fieldType: {
    id: 'course-authoring.certificates.robbo-design.field.type',
    defaultMessage: "Field",
  },
  fieldRemove: {
    id: 'course-authoring.certificates.robbo-design.field.remove',
    defaultMessage: "Remove field {number}",
  },
  fieldText: {
    id: 'course-authoring.certificates.robbo-design.field.text',
    defaultMessage: "Text",
  },
  fieldPrefix: {
    id: 'course-authoring.certificates.robbo-design.field.prefix',
    defaultMessage: "Text before",
  },
  fieldSuffix: {
    id: 'course-authoring.certificates.robbo-design.field.suffix',
    defaultMessage: "Text after",
  },
  fieldX: {
    id: 'course-authoring.certificates.robbo-design.field.x',
    defaultMessage: "X, %",
  },
  fieldY: {
    id: 'course-authoring.certificates.robbo-design.field.y',
    defaultMessage: "Y, %",
  },
  fieldWidth: {
    id: 'course-authoring.certificates.robbo-design.field.width',
    defaultMessage: "Width, %",
  },
  fieldFontSize: {
    id: 'course-authoring.certificates.robbo-design.field.font-size',
    defaultMessage: "Size, pt",
  },
  fieldLines: {
    id: 'course-authoring.certificates.robbo-design.field.lines',
    defaultMessage: "Max lines",
  },
  fieldFont: {
    id: 'course-authoring.certificates.robbo-design.field.font',
    defaultMessage: "Font",
  },
  fieldAlign: {
    id: 'course-authoring.certificates.robbo-design.field.align',
    defaultMessage: "Alignment",
  },
  fieldColor: {
    id: 'course-authoring.certificates.robbo-design.field.color',
    defaultMessage: "Color",
  },
  fieldBold: {
    id: 'course-authoring.certificates.robbo-design.field.bold',
    defaultMessage: "Bold",
  },
  fieldUppercase: {
    id: 'course-authoring.certificates.robbo-design.field.uppercase',
    defaultMessage: "Capitals",
  },
  fieldSignatureHint: {
    id: 'course-authoring.certificates.robbo-design.field.signature-hint',
    defaultMessage: "The signature image is taken from the signatory of the course certificate.",
  },
  fieldTypeRecipient: {
    id: 'course-authoring.certificates.robbo-design.field-type.recipient',
    defaultMessage: "Learner name",
  },
  fieldTypeCourse: {
    id: 'course-authoring.certificates.robbo-design.field-type.course',
    defaultMessage: "Course name",
  },
  fieldTypeDate: {
    id: 'course-authoring.certificates.robbo-design.field-type.date',
    defaultMessage: "Issue date",
  },
  fieldTypeSignatoryName: {
    id: 'course-authoring.certificates.robbo-design.field-type.signatory-name',
    defaultMessage: "Signatory name",
  },
  fieldTypeSignatoryTitle: {
    id: 'course-authoring.certificates.robbo-design.field-type.signatory-title',
    defaultMessage: "Signatory title",
  },
  fieldTypeSignature: {
    id: 'course-authoring.certificates.robbo-design.field-type.signature',
    defaultMessage: "Signature",
  },
  fieldTypeText: {
    id: 'course-authoring.certificates.robbo-design.field-type.text',
    defaultMessage: "Text",
  },
  fontProxima: {
    id: 'course-authoring.certificates.robbo-design.font.proxima',
    defaultMessage: "Proxima Nova (brand)",
  },
  fontSans: {
    id: 'course-authoring.certificates.robbo-design.font.sans',
    defaultMessage: "Helvetica",
  },
  fontSerif: {
    id: 'course-authoring.certificates.robbo-design.font.serif',
    defaultMessage: "Serif",
  },
  alignLeft: {
    id: 'course-authoring.certificates.robbo-design.align.left',
    defaultMessage: "Left",
  },
  alignCenter: {
    id: 'course-authoring.certificates.robbo-design.align.center',
    defaultMessage: "Center",
  },
  alignRight: {
    id: 'course-authoring.certificates.robbo-design.align.right',
    defaultMessage: "Right",
  },
  sampleRecipient: {
    id: 'course-authoring.certificates.robbo-design.sample.recipient',
    defaultMessage: "Ivan Ivanov",
  },
  sampleCourse: {
    id: 'course-authoring.certificates.robbo-design.sample.course',
    defaultMessage: "Basics of robotics",
  },
  sampleSignatoryName: {
    id: 'course-authoring.certificates.robbo-design.sample.signatory-name',
    defaultMessage: "Pavel Frolov",
  },
  sampleSignatoryTitle: {
    id: 'course-authoring.certificates.robbo-design.sample.signatory-title',
    defaultMessage: "CEO",
  },
  uploadedBadge: {
    id: 'course-authoring.certificates.robbo-design.uploaded-badge',
    defaultMessage: "From builder",
  },
  uploadedBadgeHint: {
    id: 'course-authoring.certificates.robbo-design.uploaded-badge-hint',
    defaultMessage: "Made by platform staff in the certificate builder",
  },
  archiveError: {
    id: 'course-authoring.certificates.robbo-design.archive-error',
    defaultMessage: "Could not delete the design. Try again.",
  },
  fieldTypeHours: {
    id: 'course-authoring.certificates.robbo-design.field-type.hours',
    defaultMessage: "Course volume, hours",
  },
  hoursLabel: {
    id: 'course-authoring.certificates.robbo-design.hours.label',
    defaultMessage: "Course volume, hours",
  },
  hoursHint: {
    id: 'course-authoring.certificates.robbo-design.hours.hint',
    defaultMessage: "The selected design prints it, e.g. “72 hours”.",
  },
  hoursInvalid: {
    id: 'course-authoring.certificates.robbo-design.hours.invalid',
    defaultMessage: "Enter a whole number of hours from 1 to {max}.",
  },
  hoursSaveError: {
    id: 'course-authoring.certificates.robbo-design.hours.save-error',
    defaultMessage: "Could not save the course volume. Try again.",
  },
  customBadge: {
    id: 'course-authoring.certificates.robbo-design.custom-badge',
    defaultMessage: "Custom",
  },
  customBadgeHint: {
    id: 'course-authoring.certificates.robbo-design.custom-badge-hint',
    defaultMessage: "Made by the Robbo development team",
  },
  hoursMissing: {
    id: 'course-authoring.certificates.robbo-design.hours.missing',
    defaultMessage: "Set the course volume, otherwise the line with hours is not printed on the certificate.",
  },
});

export default messages;
