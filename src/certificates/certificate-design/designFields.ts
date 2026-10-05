/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Field schema of uploaded certificate designs. Mirrors
 * edx-platform lms/djangoapps/robbo_certificates/fields.py (the server validates again).
 */

export const FIELD_TYPES = [
  'recipient', 'course', 'date', 'hours', 'signatory_name', 'signatory_title', 'signature', 'text',
] as const;
export type FieldType = typeof FIELD_TYPES[number];

export const FONTS = ['proxima', 'sans', 'serif'] as const;
export type FieldFont = typeof FONTS[number];

export const ALIGNS = ['left', 'center', 'right'] as const;
export type FieldAlign = typeof ALIGNS[number];

export interface DesignField {
  type: FieldType;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  font: FieldFont;
  bold: boolean;
  color: string;
  align: FieldAlign;
  uppercase: boolean;
  lines: number;
  prefix: string;
  suffix: string;
  text: string;
}

export type NumericFieldKey = 'x' | 'y' | 'width' | 'fontSize' | 'lines';

/** min / max / step for the number inputs (same ranges as the server). */
export const NUMBER_LIMITS: Record<NumericFieldKey, { min: number; max: number; step: number }> = {
  x: { min: 0, max: 100, step: 0.5 },
  y: { min: 0, max: 100, step: 0.5 },
  width: { min: 1, max: 100, step: 0.5 },
  fontSize: { min: 4, max: 120, step: 1 },
  lines: { min: 1, max: 4, step: 1 },
};

export const MAX_FIELDS = 20;

export const FONT_STACKS: Record<FieldFont, string> = {
  proxima: "'ProximaNova', Helvetica, Arial, sans-serif",
  sans: 'Helvetica, Arial, sans-serif',
  serif: "Georgia, 'Times New Roman', serif",
};

/** A4 landscape at 96 dpi — the sheet is laid out at this size and scaled to fit. */
export const SHEET_WIDTH_PX = (297 / 25.4) * 96;
export const SHEET_HEIGHT_PX = (210 / 25.4) * 96;

export const BACKGROUND_MAX_BYTES = 10 * 1024 * 1024;
export const BACKGROUND_TYPES = ['image/png', 'image/jpeg'];

export const newField = (type: FieldType): DesignField => ({
  type,
  x: 50,
  y: 50,
  width: type === 'signature' ? 15 : 60,
  fontSize: 18,
  font: 'proxima',
  bold: type === 'recipient',
  color: '#383838',
  align: 'center',
  uppercase: false,
  lines: type === 'course' ? 2 : 1,
  prefix: '',
  suffix: '',
  text: '',
});

/** Server payload (snake_case) → editor field, filling gaps with defaults. */
export const fieldFromApi = (raw: Record<string, unknown>): DesignField => {
  const base = newField((raw.type as FieldType) ?? 'text');
  return {
    ...base,
    ...Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== undefined)),
    fontSize: (raw.fontSize ?? raw.font_size ?? base.fontSize) as number,
  } as DesignField;
};

export const fieldToApi = (field: DesignField) => ({
  type: field.type,
  x: field.x,
  y: field.y,
  width: field.width,
  font_size: field.fontSize,
  font: field.font,
  bold: field.bold,
  color: field.color,
  align: field.align,
  uppercase: field.uppercase,
  lines: field.lines,
  prefix: field.prefix,
  suffix: field.suffix,
  text: field.text,
});

export const MAX_COURSE_HOURS = 10000;

/** '72 часов', '21 часа' — genitive after «в объеме» (same as format_hours on the server). */
export const formatHours = (hours: number | null | undefined) => {
  if (!hours) { return ''; }
  const noun = hours % 10 === 1 && hours % 100 !== 11 ? 'часа' : 'часов';
  return `${hours} ${noun}`;
};
