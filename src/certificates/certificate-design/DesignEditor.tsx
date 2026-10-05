/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Platform staff: upload a certificate background and place the fields with a form,
 * with a live preview of the sheet.
 */
import {
  ChangeEvent, useEffect, useMemo, useState,
} from 'react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Alert, Button, Form, FullscreenModal, StatefulButton,
} from '@openedx/paragon';

import { useCourseAuthoringContext } from '@src/CourseAuthoringContext';
import { useCertificates } from '../data/apiHooks';
import {
  UploadedDesign, getApiErrorMessage, useCertificateDesign, useSaveUploadedDesign,
} from './api';
import ArchiveDesignModal from './ArchiveDesignModal';
import {
  BACKGROUND_MAX_BYTES, BACKGROUND_TYPES, DesignField, FIELD_TYPES, FieldType, MAX_FIELDS, formatHours, newField,
} from './designFields';
import DesignPreview, { PreviewValues } from './DesignPreview';
import FieldEditor, { FIELD_TYPE_MESSAGES } from './FieldEditor';
import messages from './messages';

interface DesignEditorProps {
  /** Design to edit; null creates a new one. */
  design: UploadedDesign | null;
  defaultFields: DesignField[];
  onClose: () => void;
}

const today = () => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  .format(new Date())
  .replace(/\s*г\.$/, '');

const DesignEditor = ({ design, defaultFields, onClose }: DesignEditorProps) => {
  const intl = useIntl();
  const { courseId } = useCourseAuthoringContext();
  const { data: certificatesData } = useCertificates(courseId);
  const { data: courseDesignData } = useCertificateDesign(courseId);
  const saveMutation = useSaveUploadedDesign(courseId);

  const [title, setTitle] = useState(design?.title ?? '');
  const [description, setDescription] = useState(design?.description ?? '');
  const [fields, setFields] = useState<DesignField[]>(design?.fields ?? defaultFields);
  const [background, setBackground] = useState<File | null>(null);
  const [backgroundError, setBackgroundError] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

  const localBackgroundUrl = useMemo(() => (background ? URL.createObjectURL(background) : null), [background]);
  useEffect(() => () => {
    if (localBackgroundUrl) { URL.revokeObjectURL(localBackgroundUrl); }
  }, [localBackgroundUrl]);

  const previewValues: PreviewValues = useMemo(() => {
    const signatory = certificatesData?.certificates?.[0]?.signatories?.[0];
    const signaturePath = signatory?.signatureImagePath;
    return {
      recipient: intl.formatMessage(messages.sampleRecipient),
      course: certificatesData?.courseTitle || intl.formatMessage(messages.sampleCourse),
      date: today(),
      hours: formatHours(courseDesignData?.courseHours ?? 72),
      signatoryName: signatory?.name || intl.formatMessage(messages.sampleSignatoryName),
      signatoryTitle: signatory?.title || intl.formatMessage(messages.sampleSignatoryTitle),
      signatureUrl: signaturePath ? `${getConfig().STUDIO_BASE_URL}${signaturePath}` : '',
    };
  }, [certificatesData, courseDesignData, intl]);

  const handleBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file && !BACKGROUND_TYPES.includes(file.type)) {
      setBackgroundError(intl.formatMessage(messages.editorBackgroundType));
      return;
    }
    if (file && file.size > BACKGROUND_MAX_BYTES) {
      setBackgroundError(intl.formatMessage(messages.editorBackgroundSize));
      return;
    }
    setBackgroundError('');
    setBackground(file);
  };

  const updateField = (index: number, field: DesignField) => {
    setFields((current) => current.map((item, i) => (i === index ? field : item)));
  };
  const removeField = (index: number) => {
    setFields((current) => current.filter((_, i) => i !== index));
    setActiveIndex(null);
  };
  const addField = () => {
    setFields((current) => [...current, newField(newFieldType)]);
    setActiveIndex(fields.length);
  };

  const canSave = title.trim() !== '' && (design?.backgroundUrl || background) && !backgroundError;
  const handleSave = () => {
    saveMutation.mutate(
      {
        id: design?.id, title: title.trim(), description, fields, background,
      },
      { onSuccess: onClose },
    );
  };

  const saveError = saveMutation.isError
    ? getApiErrorMessage(saveMutation.error) || intl.formatMessage(messages.editorSaveError)
    : '';

  return (
    <>
      <FullscreenModal
        className="certificate-design-editor"
        title={intl.formatMessage(design ? messages.editorEditTitle : messages.editorCreateTitle)}
        isOpen
        onClose={onClose}
        footerNode={(
          <ActionRow>
            {design && (
              <Button variant="outline-danger" onClick={() => setIsConfirmingArchive(true)}>
                {intl.formatMessage(messages.editorArchive)}
              </Button>
            )}
            <ActionRow.Spacer />
            <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.editorCancel)}</Button>
            <StatefulButton
              variant="primary"
              state={saveMutation.isPending ? 'pending' : 'default'}
              labels={{
                default: intl.formatMessage(messages.editorSave),
                pending: intl.formatMessage(messages.editorSaving),
              }}
              disabledStates={['pending']}
              disabled={!canSave}
              onClick={handleSave}
            />
          </ActionRow>
        )}
      >
        <div className="certificate-design-editor__layout">
          <div className="certificate-design-editor__form">
            {saveError && <Alert variant="danger">{saveError}</Alert>}

            <Form.Group controlId="certificate-design-title">
              <Form.Label>{intl.formatMessage(messages.editorTitleLabel)}</Form.Label>
              <Form.Control
                value={title}
                maxLength={255}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="certificate-design-description">
              <Form.Label>{intl.formatMessage(messages.editorDescriptionLabel)}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                maxLength={2000}
                value={description}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="certificate-design-background" isInvalid={!!backgroundError}>
              <Form.Label>{intl.formatMessage(messages.editorBackgroundLabel)}</Form.Label>
              <Form.Control type="file" accept={BACKGROUND_TYPES.join(',')} onChange={handleBackground} />
              <Form.Text>{intl.formatMessage(messages.editorBackgroundHint)}</Form.Text>
              {backgroundError && (
                <Form.Control.Feedback type="invalid">{backgroundError}</Form.Control.Feedback>
              )}
            </Form.Group>

            <h3 className="certificate-design-editor__subtitle">{intl.formatMessage(messages.editorFieldsTitle)}</h3>
            <p className="certificate-design-editor__hint">{intl.formatMessage(messages.editorFieldsHint)}</p>
            {fields.map((field, index) => (
              <FieldEditor
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                index={index}
                field={field}
                isActive={index === activeIndex}
                onChange={(value) => updateField(index, value)}
                onRemove={() => removeField(index)}
                onFocus={() => setActiveIndex(index)}
              />
            ))}
            {fields.length < MAX_FIELDS && (
              <div className="certificate-design-editor__add">
                <Form.Group controlId="certificate-design-new-field" className="mb-0">
                  <Form.Label className="sr-only">{intl.formatMessage(messages.fieldType)}</Form.Label>
                  <Form.Control
                    as="select"
                    value={newFieldType}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => setNewFieldType(event.target.value as FieldType)}
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>{intl.formatMessage(FIELD_TYPE_MESSAGES[type])}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="outline-primary" onClick={addField}>{intl.formatMessage(messages.editorAddField)}</Button>
              </div>
            )}
          </div>

          <div className="certificate-design-editor__preview">
            <DesignPreview
              backgroundUrl={localBackgroundUrl ?? design?.backgroundUrl ?? null}
              fields={fields}
              values={previewValues}
              activeIndex={activeIndex}
            />
            <p className="certificate-design-editor__hint">{intl.formatMessage(messages.editorPreviewHint)}</p>
          </div>
        </div>
      </FullscreenModal>

      <ArchiveDesignModal
        design={isConfirmingArchive ? design : null}
        onClose={() => setIsConfirmingArchive(false)}
        onArchived={onClose}
      />
    </>
  );
};

export default DesignEditor;
