/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Form for one field of an uploaded certificate design.
 */
import { ChangeEvent } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, Icon, IconButton } from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';

import {
  ALIGNS, DesignField, FIELD_TYPES, FONTS, FieldAlign, FieldFont, FieldType, NUMBER_LIMITS, NumericFieldKey,
} from './designFields';
import messages from './messages';

export const FIELD_TYPE_MESSAGES: Record<FieldType, MessageDescriptor> = {
  recipient: messages.fieldTypeRecipient,
  course: messages.fieldTypeCourse,
  date: messages.fieldTypeDate,
  hours: messages.fieldTypeHours,
  signatory_name: messages.fieldTypeSignatoryName,
  signatory_title: messages.fieldTypeSignatoryTitle,
  signature: messages.fieldTypeSignature,
  text: messages.fieldTypeText,
};

const FONT_MESSAGES: Record<FieldFont, MessageDescriptor> = {
  proxima: messages.fontProxima,
  sans: messages.fontSans,
  serif: messages.fontSerif,
};

const ALIGN_MESSAGES: Record<FieldAlign, MessageDescriptor> = {
  left: messages.alignLeft,
  center: messages.alignCenter,
  right: messages.alignRight,
};

const NUMBER_MESSAGES: Record<NumericFieldKey, MessageDescriptor> = {
  x: messages.fieldX,
  y: messages.fieldY,
  width: messages.fieldWidth,
  fontSize: messages.fieldFontSize,
  lines: messages.fieldLines,
};

interface FieldEditorProps {
  index: number;
  field: DesignField;
  isActive: boolean;
  onChange: (field: DesignField) => void;
  onRemove: () => void;
  onFocus: () => void;
}

const FieldEditor = ({
  index, field, isActive, onChange, onRemove, onFocus,
}: FieldEditorProps) => {
  const intl = useIntl();
  const id = (name: string) => `certificate-design-field-${index}-${name}`;
  const isSignature = field.type === 'signature';
  const set = <K extends keyof DesignField>(key: K, value: DesignField[K]) => onChange({ ...field, [key]: value });

  const numberInput = (key: NumericFieldKey) => {
    const { min, max, step } = NUMBER_LIMITS[key];
    return (
      <Form.Group controlId={id(key)} className="certificate-design-field__control">
        <Form.Label>{intl.formatMessage(NUMBER_MESSAGES[key])}</Form.Label>
        <Form.Control
          type="number"
          min={min}
          max={max}
          step={step}
          value={field[key]}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = Number(event.target.value);
            if (!Number.isNaN(value)) {
              set(key, Math.min(max, Math.max(min, value)));
            }
          }}
        />
      </Form.Group>
    );
  };

  const textInput = (key: 'prefix' | 'suffix', label: MessageDescriptor) => (
    <Form.Group controlId={id(key)} className="certificate-design-field__control">
      <Form.Label>{intl.formatMessage(label)}</Form.Label>
      <Form.Control
        value={field[key]}
        maxLength={100}
        onChange={(event: ChangeEvent<HTMLInputElement>) => set(key, event.target.value)}
      />
    </Form.Group>
  );

  return (
    <fieldset
      className={`certificate-design-field${isActive ? ' is-active' : ''}`}
      onFocus={onFocus}
    >
      <legend className="certificate-design-field__legend">
        <span>{`${index + 1}. ${intl.formatMessage(FIELD_TYPE_MESSAGES[field.type])}`}</span>
        <IconButton
          src={Close}
          iconAs={Icon}
          size="sm"
          alt={intl.formatMessage(messages.fieldRemove, { number: index + 1 })}
          onClick={onRemove}
        />
      </legend>

      <div className="certificate-design-field__grid">
        <Form.Group controlId={id('type')} className="certificate-design-field__control is-wide">
          <Form.Label>{intl.formatMessage(messages.fieldType)}</Form.Label>
          <Form.Control
            as="select"
            value={field.type}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => set('type', event.target.value as FieldType)}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>{intl.formatMessage(FIELD_TYPE_MESSAGES[type])}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {field.type === 'text' && (
          <Form.Group controlId={id('text')} className="certificate-design-field__control is-wide">
            <Form.Label>{intl.formatMessage(messages.fieldText)}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={500}
              value={field.text}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => set('text', event.target.value)}
            />
          </Form.Group>
        )}
        {!isSignature && field.type !== 'text' && textInput('prefix', messages.fieldPrefix)}
        {!isSignature && field.type !== 'text' && textInput('suffix', messages.fieldSuffix)}

        {numberInput('x')}
        {numberInput('y')}
        {numberInput('width')}
        <Form.Group controlId={id('align')} className="certificate-design-field__control">
          <Form.Label>{intl.formatMessage(messages.fieldAlign)}</Form.Label>
          <Form.Control
            as="select"
            value={field.align}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => set('align', event.target.value as FieldAlign)}
          >
            {ALIGNS.map((align) => (
              <option key={align} value={align}>{intl.formatMessage(ALIGN_MESSAGES[align])}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {!isSignature && (
          <>
            {numberInput('fontSize')}
            {numberInput('lines')}
            <Form.Group controlId={id('font')} className="certificate-design-field__control">
              <Form.Label>{intl.formatMessage(messages.fieldFont)}</Form.Label>
              <Form.Control
                as="select"
                value={field.font}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => set('font', event.target.value as FieldFont)}
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>{intl.formatMessage(FONT_MESSAGES[font])}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId={id('color')} className="certificate-design-field__control">
              <Form.Label>{intl.formatMessage(messages.fieldColor)}</Form.Label>
              <Form.Control
                type="color"
                className="certificate-design-field__color"
                value={field.color}
                onChange={(event: ChangeEvent<HTMLInputElement>) => set('color', event.target.value)}
              />
            </Form.Group>
            <div className="certificate-design-field__checks is-wide">
              <Form.Checkbox
                checked={field.bold}
                onChange={(event: ChangeEvent<HTMLInputElement>) => set('bold', event.target.checked)}
              >
                {intl.formatMessage(messages.fieldBold)}
              </Form.Checkbox>
              <Form.Checkbox
                checked={field.uppercase}
                onChange={(event: ChangeEvent<HTMLInputElement>) => set('uppercase', event.target.checked)}
              >
                {intl.formatMessage(messages.fieldUppercase)}
              </Form.Checkbox>
            </div>
          </>
        )}
      </div>
      {isSignature && (
        <p className="certificate-design-field__hint">{intl.formatMessage(messages.fieldSignatureHint)}</p>
      )}
    </fieldset>
  );
};

export default FieldEditor;
