/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * «Файлы» with a catalog: automatic groups (course design, certificate, pages, course outline,
 * not in use) and author folders on the left, the upstream file table filtered by the open node
 * on the right. Uploads never overwrite a namesake silently (see UploadConflictModal).
 */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { useCourseUserPermissions } from '@src/authz/hooks';
import { getFilesPermissions } from '@src/authz/permissionHelpers';
import { useModels } from '@src/generic/model-store';
import { ToastContext } from '@src/generic/toast-context';
import type { DeprecatedReduxState } from '@src/store';
import { CourseFilesTable } from '../CourseFilesTable';
import { resetErrors } from '../data/thunks';
import {
  buildCatalog,
  type CatalogAsset,
  folderFromNodeId,
  folderNames,
  folderNodeId,
  loadPendingFolders,
  NODE_ALL,
  NODE_FOLDERS,
  NODE_NO_FOLDER,
  NODE_STRUCTURE,
  NODE_UNUSED,
  nodeMatches,
  pathToNode,
  savePendingFolders,
} from './catalog';
import { CatalogSelect, CatalogTree } from './CatalogTree';
import { DeleteFolderDialog, FolderNameDialog } from './FolderDialogs';
import MoveToFolderModal from './MoveToFolderModal';
import RobboFileActionsContext, { type RobboFileActions } from './RobboFileActionsContext';
import { robboMoveAssets, robboValidateAssetFiles, type UploadOutcome } from './thunks';
import UploadConflictModal from './UploadConflictModal';
import messages from './messages';
import './RobboCourseFiles.scss';

const CATALOG_PARAM = 'catalog';
// Nodes where a just-uploaded file shows up; anywhere else the list switches to «Все файлы».
const UPLOAD_VISIBLE_NODES = [NODE_ALL, NODE_UNUSED, NODE_NO_FOLDER];

type FolderDialog = { mode: 'new' } | { mode: 'rename'; name: string } | null;

const RobboCourseFiles = () => {
  const intl = useIntl();
  const dispatch = useDispatch<any>();
  const { courseId } = useParams() as { courseId: string };
  const { showToast } = useContext(ToastContext);
  const { canEditFiles } = useCourseUserPermissions(courseId, getFilesPermissions(courseId));
  const { assetIds } = useSelector((state: DeprecatedReduxState) => state.assets);
  const assets = useModels('assets', assetIds) as CatalogAsset[];

  const [pendingFolders, setPendingFoldersState] = useState<string[]>(() => loadPendingFolders(courseId));
  const setPendingFolders = useCallback((folders: string[]) => {
    setPendingFoldersState(folders);
    savePendingFolders(courseId, folders);
  }, [courseId]);

  const tree = useMemo(() => buildCatalog(assets, pendingFolders), [assets, pendingFolders]);
  const existingFolders = useMemo(() => folderNames(tree), [tree]);

  // A pending folder becomes a real one as soon as a file carries its label.
  useEffect(() => {
    const used = new Set(assets.map(asset => asset.robboFolder).filter(Boolean));
    const left = pendingFolders.filter(folder => !used.has(folder));
    if (left.length !== pendingFolders.length) {
      setPendingFolders(left);
    }
  }, [assets]);

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get(CATALOG_PARAM) || NODE_ALL;
  const selectedId = pathToNode(tree, requestedId).length ? requestedId : NODE_ALL;
  const selectedFolder = folderFromNodeId(selectedId);
  const selectedNode = useMemo(
    () => tree.flatMap(node => [node, ...node.children]).find(node => node.id === selectedId),
    [tree, selectedId],
  );

  const select = useCallback((nodeId: string) => {
    setSearchParams(current => {
      const next = new URLSearchParams(current);
      if (nodeId === NODE_ALL) {
        next.delete(CATALOG_PARAM);
      } else {
        next.set(CATALOG_PARAM, nodeId);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([NODE_STRUCTURE, NODE_FOLDERS]));
  const toggle = (nodeId: string) => {
    const next = new Set(expanded);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    setExpanded(next);
  };
  useEffect(() => {
    const ancestors = pathToNode(tree, selectedId).slice(0, -1);
    if (ancestors.some(nodeId => !expanded.has(nodeId))) {
      setExpanded(new Set([...expanded, ...ancestors]));
    }
  }, [selectedId, tree]);

  const reportUploads = useCallback((outcomes: UploadOutcome[]) => {
    const done = outcomes.filter(outcome => outcome.status !== 'failed');
    const renamed = done.filter(outcome => outcome.status === 'renamed');
    const reused = done.filter(outcome => outcome.status === 'reused');
    if (done.length === 1) {
      const [outcome] = done;
      if (outcome.status === 'renamed') {
        showToast(intl.formatMessage(messages.uploadRenamed, { original: outcome.originalName, name: outcome.name }));
      } else if (outcome.status === 'reused') {
        showToast(intl.formatMessage(messages.uploadReused, { name: outcome.name }));
      } else if (outcome.status === 'replaced') {
        showToast(intl.formatMessage(messages.uploadReplaced, { name: outcome.name }));
      }
    } else if (renamed.length || reused.length) {
      showToast(intl.formatMessage(messages.uploadSummary, {
        total: done.length,
        renamed: renamed.length,
        reused: reused.length,
      }));
    }
  }, [intl, showToast]);

  const handleAddFile = useCallback(async (files: File[]) => {
    dispatch(resetErrors({ errorType: 'add' }));
    if (!selectedFolder && !UPLOAD_VISIBLE_NODES.includes(selectedId)) {
      select(NODE_ALL);
    }
    const outcomes: UploadOutcome[] = await dispatch(
      robboValidateAssetFiles(courseId, files, { folder: selectedFolder }),
    );
    reportUploads(outcomes);
  }, [courseId, selectedId, selectedFolder, reportUploads]);

  const filterAssets = useCallback(
    (list: CatalogAsset[]) => list.filter(asset => nodeMatches(asset, selectedId)),
    [selectedId],
  );

  const moveError = intl.formatMessage(messages.moveError);
  const moveFiles = async (ids: string[], folder: string) => {
    const moved = await dispatch(robboMoveAssets(courseId, ids, folder, moveError));
    if (!moved) {
      return false;
    }
    showToast(folder
      ? intl.formatMessage(messages.movedToFolder, { count: moved.length, folder })
      : intl.formatMessage(messages.movedOutOfFolders, { count: moved.length }));
    return true;
  };

  const [moveIds, setMoveIds] = useState<string[] | null>(null);
  const actions: RobboFileActions = useMemo(() => ({ onMoveToFolder: (ids) => setMoveIds(ids) }), []);
  const moveCurrentFolder = useMemo(() => {
    if (!moveIds) {
      return null;
    }
    const current = new Set(assets.filter(asset => moveIds.includes(asset.id)).map(asset => asset.robboFolder || ''));
    return current.size === 1 ? [...current][0] : null;
  }, [moveIds, assets]);
  const submitMove = async (folder: string) => {
    const ids = moveIds || [];
    setMoveIds(null);
    await moveFiles(ids, folder);
  };

  const [folderDialog, setFolderDialog] = useState<FolderDialog>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const folderFiles = (name: string) => assets.filter(asset => asset.robboFolder === name).map(asset => asset.id);

  const submitFolderName = async (name: string) => {
    const dialog = folderDialog;
    setFolderDialog(null);
    if (dialog?.mode === 'rename') {
      const ids = folderFiles(dialog.name);
      if (ids.length && !(await moveFiles(ids, name))) {
        return;
      }
      setPendingFolders(pendingFolders.map(folder => (folder === dialog.name ? name : folder)));
      if (selectedId === folderNodeId(dialog.name)) {
        select(folderNodeId(name));
      }
      return;
    }
    if (!existingFolders.includes(name)) {
      setPendingFolders([...pendingFolders, name]);
    }
    select(folderNodeId(name));
  };

  const deleteFolder = async (name: string) => {
    setFolderToDelete(null);
    const ids = folderFiles(name);
    if (ids.length && !(await moveFiles(ids, ''))) {
      return;
    }
    setPendingFolders(pendingFolders.filter(folder => folder !== name));
    if (selectedId === folderNodeId(name)) {
      select(NODE_ALL);
    }
  };

  const folderColumn = useMemo(() => ({
    id: 'robboFolder',
    Header: intl.formatMessage(messages.folderColumn),
    accessor: 'robboFolder',
    disableFilters: true,
    Cell: ({ row }) => row.original.robboFolder || '',
  }), [intl]);

  const navProps = {
    tree,
    selectedId,
    onSelect: select,
    canEdit: !!canEditFiles,
    onNewFolder: () => setFolderDialog({ mode: 'new' }),
    onRenameFolder: (name: string) => setFolderDialog({ mode: 'rename', name }),
    onDeleteFolder: (name: string) => setFolderToDelete(name),
  };

  return (
    <RobboFileActionsContext.Provider value={canEditFiles ? actions : null}>
      <div className="robbo-files-catalog">
        <aside className="robbo-files-catalog__aside">
          <CatalogTree {...navProps} expanded={expanded} onToggle={toggle} />
        </aside>
        <div className="robbo-files-catalog__main">
          <CatalogSelect {...navProps} />
          {selectedId === NODE_UNUSED && (
            <Alert variant="warning" className="robbo-files-catalog__note">
              {intl.formatMessage(messages.unusedHint)}
            </Alert>
          )}
          {selectedNode?.pending && (
            <Alert variant="info" className="robbo-files-catalog__note">
              {intl.formatMessage(messages.pendingFolderHint)}
            </Alert>
          )}
          <CourseFilesTable
            // A new node gets a fresh table: row selection is by index and must not jump to other files.
            key={selectedId}
            robbo={{
              handleAddFile,
              filterAssets,
              extraColumns: [folderColumn],
              conflictModal: (
                <UploadConflictModal courseId={courseId} folder={selectedFolder} onUploaded={reportUploads} />
              ),
            }}
          />
        </div>
      </div>
      <MoveToFolderModal
        isOpen={moveIds !== null}
        count={moveIds?.length || 0}
        folders={existingFolders}
        currentFolder={moveCurrentFolder}
        onClose={() => setMoveIds(null)}
        onSubmit={submitMove}
      />
      <FolderNameDialog
        isOpen={folderDialog !== null}
        initialName={folderDialog?.mode === 'rename' ? folderDialog.name : ''}
        existingNames={existingFolders}
        onClose={() => setFolderDialog(null)}
        onSubmit={submitFolderName}
      />
      <DeleteFolderDialog
        name={folderToDelete}
        onClose={() => setFolderToDelete(null)}
        onConfirm={deleteFolder}
      />
    </RobboFileActionsContext.Provider>
  );
};

export default RobboCourseFiles;
