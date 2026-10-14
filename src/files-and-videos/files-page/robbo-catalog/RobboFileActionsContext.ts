/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Extra file actions the generic file table shows only on the «Файлы» page
 * (the videos page has no provider, so the menus stay upstream there).
 */
import React from 'react';

export interface RobboFileActions {
  /** Open the "move to folder" dialog for these file ids. */
  onMoveToFolder: (assetIds: string[]) => void;
}

const RobboFileActionsContext = React.createContext<RobboFileActions | null>(null);

export const useRobboFileActions = () => React.useContext(RobboFileActionsContext);

export default RobboFileActionsContext;
