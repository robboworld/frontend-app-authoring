/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course groups). See NOTICE at repository root.
 *
 * «Доступ ограничен: **5Б**» for content shown only to the groups and «Доступ ограничен: **всем, кроме 5Б**»
 * for content hidden from them (openedx-platform openedx/core/lib/robbo_group_access.py).
 * Pass the group names, or their number when there are too many to list.
 */
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import type { AccessMode } from '@src/data/types';
import messages from './messages';

interface GroupAccessLabelProps {
  groups?: string;
  groupsCount?: number;
  accessMode?: AccessMode;
}

const GroupAccessLabel = ({ groups = '', groupsCount, accessMode }: GroupAccessLabelProps) => {
  const intl = useIntl();
  const isHidden = accessMode === 'deny';
  let who: string;
  if (groupsCount !== undefined) {
    who = intl.formatMessage(
      isHidden ? messages.everyoneExceptGroupsCount : messages.groupsCount,
      { count: groupsCount },
    );
  } else {
    who = isHidden ? intl.formatMessage(messages.everyoneExcept, { groups }) : groups;
  }
  return <FormattedMessage {...messages.accessRestricted} values={{ groups: <strong>{who}</strong> }} />;
};

export default GroupAccessLabel;
