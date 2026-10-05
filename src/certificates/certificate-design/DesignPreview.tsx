/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Live preview of an uploaded certificate design. Same layout rules as the LMS template
 * robbo-theme/lms/templates/certificates/_robbo-design-uploaded.html.
 */
import {
  CSSProperties, useLayoutEffect, useRef, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import {
  DesignField, FONT_STACKS, SHEET_HEIGHT_PX, SHEET_WIDTH_PX,
} from './designFields';
import messages from './messages';

export interface PreviewValues {
  recipient: string;
  course: string;
  date: string;
  hours: string;
  signatoryName: string;
  signatoryTitle: string;
  signatureUrl: string;
}

interface DesignPreviewProps {
  backgroundUrl: string | null;
  fields: DesignField[];
  values: PreviewValues;
  activeIndex: number | null;
}

const TRANSLATE_X = { left: '0', center: '-50%', right: '-100%' };
const LINE_HEIGHT = 1.2;

const fieldText = (field: DesignField, values: PreviewValues) => {
  const value = {
    recipient: values.recipient,
    course: values.course,
    date: values.date,
    hours: values.hours,
    signatory_name: values.signatoryName,
    signatory_title: values.signatoryTitle,
    text: field.text,
    signature: '',
  }[field.type];
  return value ? `${field.prefix}${value}${field.suffix}` : '';
};

const fieldStyle = (field: DesignField): CSSProperties => {
  const style: CSSProperties = {
    left: `${field.x}%`,
    top: `${field.y}%`,
    width: `${field.width}%`,
    transform: `translateX(${TRANSLATE_X[field.align]})`,
    textAlign: field.align,
  };
  if (field.type === 'signature') {
    return style;
  }
  return {
    ...style,
    fontFamily: FONT_STACKS[field.font],
    fontSize: `${field.fontSize}pt`,
    fontWeight: field.bold ? 700 : 400,
    color: field.color,
    lineHeight: LINE_HEIGHT,
    maxHeight: `${field.lines * LINE_HEIGHT}em`,
    whiteSpace: field.lines === 1 ? 'nowrap' : 'normal',
    textTransform: field.uppercase ? 'uppercase' : 'none',
  };
};

const DesignPreview = ({
  backgroundUrl, fields, values, activeIndex,
}: DesignPreviewProps) => {
  const intl = useIntl();
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) { return undefined; }
    const update = () => setScale(frame.clientWidth / SHEET_WIDTH_PX);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Shrink text that does not fit its box (same as the LMS page).
  useLayoutEffect(() => {
    const fit = () => {
      sheetRef.current?.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
        el.style.fontSize = `${el.dataset.fit}pt`;
        let size = parseFloat(window.getComputedStyle(el).fontSize);
        while (size > 6 && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) {
          size -= 0.5;
          el.style.fontSize = `${size}px`;
        }
      });
    };
    fit();
    // oxlint-disable-next-line typescript/no-floating-promises
    document.fonts?.ready.then(fit);
  }, [fields, values]);

  return (
    <div
      ref={frameRef}
      className="certificate-design-preview"
      style={{ height: SHEET_HEIGHT_PX * scale }}
      aria-label={intl.formatMessage(messages.editorPreviewLabel)}
      role="img"
    >
      <div
        ref={sheetRef}
        className="certificate-design-preview__sheet"
        style={{
          width: SHEET_WIDTH_PX,
          height: SHEET_HEIGHT_PX,
          transform: `scale(${scale})`,
          backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : undefined,
        }}
      >
        {!backgroundUrl && (
          <span className="certificate-design-preview__empty">{intl.formatMessage(messages.editorNoBackground)}</span>
        )}
        {fields.map((field, index) => {
          const className = `certificate-design-preview__field${index === activeIndex ? ' is-active' : ''}`;
          const key = `${field.type}-${index}`; // eslint-disable-line react/no-array-index-key
          if (field.type === 'signature') {
            return values.signatureUrl ? (
              <img
                key={key}
                className={className}
                style={fieldStyle(field)}
                src={values.signatureUrl}
                alt=""
              />
            ) : (
              <span
                key={key}
                className={`${className} certificate-design-preview__signature-stub`}
                style={fieldStyle(field)}
              >
                {intl.formatMessage(messages.fieldTypeSignature)}
              </span>
            );
          }
          // data-fit keeps the configured size so the effect can restart shrinking from it.
          return (
            <p
              key={key}
              data-fit={field.fontSize}
              className={className}
              style={fieldStyle(field)}
            >
              {fieldText(field, values)}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default DesignPreview;
