/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { useEffect, useRef } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';

// Notifications button: one widget for every header, served by the LMS (robbo_notifications), like
// «Что нового»: bell with the unseen counter and a panel with the latest notifications, a tick per
// unread one and «Прочитать все»; hides itself while the notifications tray is off. The full list
// is the Account MFE page /account/notifications.
const WIDGET_PATH = '/api/robbo/v1/notifications/widget.js';

interface RobboNotificationsWidget {
  unmount: () => void;
}

interface RobboNotificationsApi {
  mount: (container: HTMLElement, options: Record<string, unknown>) => RobboNotificationsWidget | null;
}

declare global {
  interface Window {
    RobboNotifications?: RobboNotificationsApi;
  }
}

let widgetPromise: Promise<RobboNotificationsApi> | null = null;

const loadWidget = (lmsBaseUrl: string): Promise<RobboNotificationsApi> => {
  if (window.RobboNotifications) {
    return Promise.resolve(window.RobboNotifications);
  }
  if (!widgetPromise) {
    widgetPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${lmsBaseUrl.replace(/\/$/, '')}${WIDGET_PATH}`;
      script.async = true;
      script.onload = () => (
        window.RobboNotifications ? resolve(window.RobboNotifications) : reject(new Error('no widget'))
      );
      script.onerror = () => {
        widgetPromise = null;
        reject(new Error('notifications widget failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return widgetPromise;
};

const getFeedUrl = (lmsBaseUrl: string): string => {
  const base: string = getConfig().ACCOUNT_SETTINGS_URL || `${lmsBaseUrl.replace(/\/$/, '')}/account`;
  return `${base.replace(/\/$/, '')}/notifications`;
};

const RobboNotificationsBell = () => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lmsBaseUrl: string = getConfig().LMS_BASE_URL;
    let widget: RobboNotificationsWidget | null = null;
    let cancelled = false;
    if (!lmsBaseUrl) {
      return undefined;
    }
    loadWidget(lmsBaseUrl)
      .then((api) => {
        if (!cancelled && containerRef.current) {
          widget = api.mount(containerRef.current, {
            lmsUrl: lmsBaseUrl,
            lang: getLocale(),
            variant: 'on-dark',
            feedUrl: getFeedUrl(lmsBaseUrl),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      widget?.unmount();
    };
  }, []);

  return <span ref={containerRef} />;
};

export default RobboNotificationsBell;
