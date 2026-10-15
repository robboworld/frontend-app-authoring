/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course groups). See NOTICE at repository root.
 *
 * Shown instead of the group access controls of a subsection, unit or component that is part of a section,
 * subsection or unit restricted by groups (openedx-platform cms/djangoapps/contentstore/utils.py
 * get_group_access_source_info): the restriction comes from there and applies here already.
 * A rule the block set itself before (get_own_group_access_info) is shown too, with a button to remove it:
 * right away in the sidebars, on «Save» in the configure modal (`ownCleared` / `onUndoClearOwn`).
 */
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert, Button } from '@openedx/paragon';
import { Lock } from '@openedx/paragon/icons';

import type { GroupAccessSource, OwnGroupAccess } from '@src/data/types';
import GroupAccessLabel from '.';
import messages from './messages';

interface GroupAccessLockedProps {
  source: GroupAccessSource;
  // category of the locked block; anything but a subsection or unit reads as a component
  itemCategory?: string;
  own?: OwnGroupAccess | null;
  onClearOwn?: () => void;
  ownCleared?: boolean;
  onUndoClearOwn?: () => void;
}

const GroupAccessLocked = ({
  source,
  itemCategory = '',
  own,
  onClearOwn,
  ownCleared = false,
  onUndoClearOwn,
}: GroupAccessLockedProps) => {
  const itemType = ['sequential', 'vertical'].includes(itemCategory) ? itemCategory : 'component';
  return (
    <Alert variant="info" icon={Lock} className="mb-0" data-testid="group-access-locked">
      <Alert.Heading>
        <FormattedMessage {...messages.lockedTitle} />
      </Alert.Heading>
      <p className="mb-2">
        <FormattedMessage
          {...messages.lockedDescription}
          values={{ itemType, ancestorType: source.category, ancestorName: source.displayName }}
        />
      </p>
      <p className="mb-0">
        <GroupAccessLabel groups={source.selectedGroupsLabel} accessMode={source.accessMode} />
      </p>
      {own && !ownCleared && (
        <div className="mt-3 pt-3 border-top" data-testid="group-access-locked-own">
          <p className="mb-1">
            <FormattedMessage {...messages.ownRestriction} values={{ itemType }} />
          </p>
          <p className="mb-2">
            <GroupAccessLabel groups={own.selectedGroupsLabel} accessMode={own.accessMode} />
          </p>
          {onClearOwn && (
            <Button variant="outline-primary" size="sm" onClick={onClearOwn}>
              <FormattedMessage {...messages.clearOwnRestriction} />
            </Button>
          )}
        </div>
      )}
      {own && ownCleared && (
        <div className="mt-3 pt-3 border-top">
          <p className="mb-1">
            <FormattedMessage {...messages.ownRestrictionWillBeCleared} />
          </p>
          {onUndoClearOwn && (
            <Button variant="link" size="sm" className="p-0" onClick={onUndoClearOwn}>
              <FormattedMessage {...messages.undoClearOwnRestriction} />
            </Button>
          )}
        </div>
      )}
    </Alert>
  );
};

export default GroupAccessLocked;
