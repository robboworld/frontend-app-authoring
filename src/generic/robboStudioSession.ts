/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Make sure the browser has a Studio session before the app renders.
 *
 * Studio `/api/...` calls pass with the LMS JWT cookie, but the legacy Studio views the MFE still calls
 * (`/certificates/`, `/xblock/`, `/textbooks/`, ...) are `login_required` and need the Studio session.
 * A user who logged into the LMS and opened the MFE directly has no such session: those calls get a 302
 * to the Studio SSO login, the browser blocks the cross-origin redirect and the save fails with
 * "Axios Error (Request)".
 *
 * So when the session is missing, go through the Studio login once. social-auth only redirects back to the
 * Studio host (`/home/`, which sends the user to the MFE home), so the page to come back to is kept in
 * sessionStorage and restored on the next load. A second miss within ATTEMPT_TTL_MS renders the page as
 * before instead of looping.
 */
import { getConfig } from '@edx/frontend-platform';
import { logInfo } from '@edx/frontend-platform/logging';

const STORAGE_KEY = 'robbo.studioSessionLogin';
const ATTEMPT_TTL_MS = 2 * 60_000;
// A cheap `login_required` GET view: 200 with a Studio session, 302 to /login/ without one.
const PROBE_PATH = '/video_images_upload_enabled';

type Attempt = { returnTo: string; at: number; };
type SessionState = 'present' | 'missing' | 'unknown';

const readAttempt = (): Attempt | null => {
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const attempt = JSON.parse(raw) as Attempt;
    return Date.now() - attempt.at < ATTEMPT_TTL_MS ? attempt : null;
  } catch {
    return null;
  }
};

const probeStudioSession = async (studioBaseUrl: string): Promise<SessionState> => {
  try {
    const response = await fetch(`${studioBaseUrl}${PROBE_PATH}`, { credentials: 'include', redirect: 'manual' });
    if (response.type === 'opaqueredirect') {
      return 'missing';
    }
    return response.ok ? 'present' : 'unknown';
  } catch {
    return 'unknown';
  }
};

// Keeps the app from rendering while the browser navigates away.
const navigatingAway = () => new Promise<void>(() => {});

/** `ready` handler for `initialize()`: resolves when the app may render. */
export async function ensureStudioSession(): Promise<void> {
  const studioBaseUrl: string | null = getConfig().STUDIO_BASE_URL;
  // Embedded pages (component picker, preview) live inside Studio, which already has the session.
  if (!studioBaseUrl || window.self !== window.top) {
    return undefined;
  }
  let attempt: Attempt | null;
  try {
    attempt = readAttempt();
  } catch {
    // No sessionStorage means no loop guard: leave the page as it is.
    return undefined;
  }

  const state = await probeStudioSession(studioBaseUrl);
  try {
    if (state === 'missing' && !attempt) {
      const next: Attempt = { returnTo: window.location.href, at: Date.now() };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.location.assign(`${studioBaseUrl}/login/?next=${encodeURIComponent('/home/')}`);
      return navigatingAway();
    }
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (state === 'missing') {
      logInfo('Robbo: no Studio session after the Studio login, legacy Studio calls will fail');
    } else if (
      state === 'present' && attempt && attempt.returnTo !== window.location.href
      && new URL(attempt.returnTo).origin === window.location.origin
    ) {
      window.location.replace(attempt.returnTo);
      return navigatingAway();
    }
  } catch {
    // Storage or URL errors: render the page as it is.
  }
  return undefined;
}
