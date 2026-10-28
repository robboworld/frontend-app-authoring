/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { useEffect, useRef } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';

import type { RobboWhatsNewState } from './robboUserMenuWhatsNew';

// «Что нового» button: one widget for every header, served by the LMS (robbo_changelog); it fetches
// the user's changes on the LMS session and hides itself for guests and API errors. Staff who chose the
// profile menu (account settings) get its state through onChange instead (robboUserMenuWhatsNew.ts).
const WIDGET_PATH = '/api/robbo/v1/whats-new/widget.js';

interface RobboWhatsNewInfo {
  inMenu: boolean;
  unread: number;
  label: string;
}

interface RobboWhatsNewWidget {
  unmount: () => void;
  open: () => void;
  subscribe: (fn: (info: RobboWhatsNewInfo) => void) => () => void;
}

interface RobboWhatsNewApi {
  mount: (container: HTMLElement, options: Record<string, unknown>) => RobboWhatsNewWidget | null;
}

declare global {
  interface Window {
    RobboWhatsNew?: RobboWhatsNewApi;
  }
}

let widgetPromise: Promise<RobboWhatsNewApi> | null = null;

const loadWidget = (lmsBaseUrl: string): Promise<RobboWhatsNewApi> => {
  if (window.RobboWhatsNew) {
    return Promise.resolve(window.RobboWhatsNew);
  }
  if (!widgetPromise) {
    widgetPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${lmsBaseUrl.replace(/\/$/, '')}${WIDGET_PATH}`;
      script.async = true;
      script.onload = () => (window.RobboWhatsNew ? resolve(window.RobboWhatsNew) : reject(new Error('no widget')));
      script.onerror = () => {
        widgetPromise = null;
        reject(new Error('whats-new widget failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return widgetPromise;
};

interface RobboWhatsNewProps {
  profileToggle?: () => HTMLElement | null;
  onChange?: (state: RobboWhatsNewState) => void;
}

const RobboWhatsNew = ({ profileToggle, onChange }: RobboWhatsNewProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const lmsBaseUrl: string = getConfig().LMS_BASE_URL;
    let widget: RobboWhatsNewWidget | null = null;
    let unsubscribe: (() => void) | null = null;
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
            profileToggle,
          });
          const mounted = widget;
          if (mounted?.subscribe) {
            unsubscribe = mounted.subscribe((info) => {
              onChangeRef.current?.({
                ...info,
                open: mounted.open,
                pageUrl: `${lmsBaseUrl.replace(/\/$/, '')}/whats-new`,
              });
            });
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      unsubscribe?.();
      widget?.unmount();
    };
  }, [profileToggle]);

  return <span ref={containerRef} />;
};

export default RobboWhatsNew;
