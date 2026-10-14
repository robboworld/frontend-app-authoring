/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Resolve a message descriptor outside React (thunks, constants getters).
 * Falls back to defaultMessage when i18n is not configured (unit tests).
 */
import { createIntl, getLocale, getMessages } from '@edx/frontend-platform/i18n';
import type { MessageDescriptor } from 'react-intl';

export function formatAppMessage(
  message: MessageDescriptor,
  values?: Record<string, string | number>,
): string {
  try {
    const intl = createIntl({
      locale: getLocale(),
      messages: getMessages(),
    });
    return intl.formatMessage(message, values);
  } catch {
    return typeof message.defaultMessage === 'string' ? message.defaultMessage : '';
  }
}
