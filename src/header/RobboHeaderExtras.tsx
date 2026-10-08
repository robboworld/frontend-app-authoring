/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useRobboHeaderSlot } from './robboHeaderSlot';
import RobboWhatsNew from './robboWhatsNew';

interface RobboHeaderExtrasProps {
  shellRef: RefObject<HTMLElement>;
}

// Before the user menu: «Что нового» and, for platform staff, the «LMS» pill — the way back from
// Studio, as the «Студия» pill in LMS headers. Styles: robbo-frontend-chrome/studio-header.css.
const RobboHeaderExtras = ({ shellRef }: RobboHeaderExtrasProps) => {
  const intl = useIntl();
  const slot = useRobboHeaderSlot(shellRef);
  if (!slot) {
    return null;
  }
  const lmsUrl: string = getConfig().LMS_BASE_URL || '';
  // Same audience as the LMS «Студия» pill: superuser / global staff (`administrator` in JWT).
  const showLmsLink = Boolean(lmsUrl && getAuthenticatedUser()?.administrator);
  return createPortal(
    <>
      <RobboWhatsNew />
      {showLmsLink && (
        <a
          className="robbo-header-lms-link__btn"
          href={lmsUrl}
          aria-label={intl.formatMessage(messages['header.robbo.lms.aria'])}
        >
          {intl.formatMessage(messages['header.robbo.lms'])}
        </a>
      )}
    </>,
    slot,
  );
};

export default RobboHeaderExtras;
