/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { registerLocale } from 'react-datepicker';
import { ru as ruLocale } from 'date-fns/locale/ru';
import { getLocale } from '@edx/frontend-platform/i18n';

const capitalize = (value) => (
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value
);

/** Russian date-fns locale with capitalized month names (Август, not август). */
export const ruDatePickerLocale = {
  ...ruLocale,
  localize: {
    ...ruLocale.localize,
    month: (...args) => capitalize(ruLocale.localize.month(...args)),
  },
};

registerLocale('ru', ruDatePickerLocale);

export const getDatePickerLocale = () => (
  getLocale().startsWith('ru') ? 'ru' : undefined
);
