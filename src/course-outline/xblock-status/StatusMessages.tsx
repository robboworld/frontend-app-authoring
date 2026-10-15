/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: sections and subsections restricted to groups show it too, all as «Доступ ограничен: **…**»
 * (GroupAccessLabel: the groups, or «всем, кроме …» for content hidden from them).
 */
import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';
import {
  Lock as LockIcon,
  Groups as GroupsIcon,
} from '@openedx/paragon/icons';

import { UserPartitionInfoTypes, XBlockPrereqs } from '@src/data/types';
import GroupAccessLabel from '@src/generic/group-access-label';
import messages from './messages';

interface StatusMessagesProps {
  isVertical: boolean;
  staffOnlyMessage?: boolean;
  prereq?: string;
  prereqs?: XBlockPrereqs[];
  userPartitionInfo?: UserPartitionInfoTypes;
  hasPartitionGroupComponents?: boolean;
}

interface StatusMessagesText {
  key: string;
  icon: React.ComponentType;
  text: React.ReactNode;
}

const StatusMessages = ({
  isVertical,
  staffOnlyMessage,
  prereq,
  prereqs,
  userPartitionInfo,
  hasPartitionGroupComponents,
}: StatusMessagesProps) => {
  const intl = useIntl();
  const statusMessages: StatusMessagesText[] = [];

  if (prereq) {
    let prereqDisplayName = '';
    prereqs?.forEach((block) => {
      if (block.blockUsageKey === prereq) {
        prereqDisplayName = block.blockDisplayName;
      }
    });
    statusMessages.push({
      key: 'prereq',
      icon: LockIcon,
      text: intl.formatMessage(messages.prerequisiteLabel, { prereqDisplayName }),
    });
  }

  const groupAccess = (
    <GroupAccessLabel groups={userPartitionInfo?.selectedGroupsLabel} accessMode={userPartitionInfo?.accessMode} />
  );
  if (!staffOnlyMessage && isVertical) {
    const { selectedPartitionIndex } = userPartitionInfo || {};
    if (selectedPartitionIndex !== -1 && !Number.isNaN(selectedPartitionIndex)) {
      statusMessages.push({ key: 'group-access', icon: GroupsIcon, text: groupAccess });
    } else if (hasPartitionGroupComponents) {
      statusMessages.push({
        key: 'group-access-some',
        icon: GroupsIcon,
        text: intl.formatMessage(messages.restrictedUnitAccessToSomeContent),
      });
    }
  } else if (!staffOnlyMessage && userPartitionInfo && userPartitionInfo.selectedPartitionIndex >= 0) {
    statusMessages.push({ key: 'group-access', icon: GroupsIcon, text: groupAccess });
  }

  if (statusMessages.length > 0) {
    return (
      <div className="border-top border-light mt-2 text-dark" data-testid="status-messages-div">
        {statusMessages.map(({ key, icon, text }) => (
          <div key={key} className="d-flex align-items-center pt-1">
            <Icon className="mr-1" size="sm" src={icon} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default StatusMessages;
