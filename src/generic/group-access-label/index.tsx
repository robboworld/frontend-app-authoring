/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course groups). See NOTICE at repository root.
 *
 * «Видно только группам: **5Б**» for content shown only to the groups and «Скрыто от групп: **5Б**»
 * for content hidden from them (openedx-platform openedx/core/lib/robbo_group_access.py).
 * Pass the group names, or their number when there are too many to list.
 */
import type { ReactNode } from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import type { AccessMode } from '@src/data/types';
import messages from './messages';

interface GroupAccessLabelProps {
  groups?: string;
  groupsCount?: number;
  accessMode?: AccessMode;
}

const bold = (chunks: ReactNode[]) => <strong>{chunks}</strong>;

const GroupAccessLabel = ({ groups = '', groupsCount, accessMode }: GroupAccessLabelProps) => {
  const isHidden = accessMode === 'deny';
  if (groupsCount !== undefined) {
    return (
      <FormattedMessage
        {...(isHidden ? messages.hiddenFromCount : messages.shownToCount)}
        values={{ count: groupsCount, b: bold }}
      />
    );
  }
  return (
    <FormattedMessage
      {...(isHidden ? messages.hiddenFrom : messages.shownTo)}
      values={{ groups, b: bold }}
    />
  );
};

export default GroupAccessLabel;
