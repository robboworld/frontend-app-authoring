/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Uploads for «Файлы» that never overwrite a namesake silently, and moves between folders.
 * Same redux state as the upstream thunks (state.assets + models.assets).
 */
import { RequestStatus } from '@src/data/constants';
import { addModel, updateModels } from '@src/generic/model-store';
import { addAssetSuccess, updateDuplicateFiles, updateEditStatus, updateErrors } from '../data/slice';
import { updateFileValues } from '../data/utils';
import {
  checkUploads,
  moveAssetsToFolder,
  uploadAsset,
  type UploadCheck,
  type UploadStatus,
} from './api';

export interface UploadOutcome {
  status: UploadStatus | 'failed';
  name: string;
  originalName: string;
}

/** Files waiting for the conflict dialog, keyed by file name (state.assets.duplicateFiles). */
export type UploadConflicts = Record<string, { file: File; check: UploadCheck }>;

export function robboAddAssetFile(
  courseId: string,
  file: File,
  options: { folder?: string | null; onConflict?: 'replace' } = {},
) {
  return async (dispatch, getState): Promise<UploadOutcome> => {
    dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.IN_PROGRESS }));
    try {
      const { asset, robboUpload } = await uploadAsset(courseId, file, options);
      const [parsedAsset] = updateFileValues([asset]);
      const status = robboUpload?.status ?? 'created';
      const isListed = (getState().assets.assetIds as string[]).includes(asset.id);
      dispatch(addModel({ modelType: 'assets', model: { ...parsedAsset } }));
      if (!isListed) {
        dispatch(addAssetSuccess({ assetId: asset.id }));
      }
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.SUCCESSFUL }));
      return { status, name: asset.displayName, originalName: robboUpload?.originalName ?? file.name };
    } catch (error: any) {
      const message = error?.response?.status === 413 ? error.response.data.error : `Failed to add ${file.name}.`;
      dispatch(updateErrors({ error: 'add', message }));
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.FAILED }));
      return { status: 'failed', name: file.name, originalName: file.name };
    }
  };
}

/**
 * Upload files right away when the course has no namesake; put the rest into
 * `duplicateFiles` for the conflict dialog.
 */
export function robboValidateAssetFiles(courseId: string, files: File[], options: { folder?: string | null } = {}) {
  return async (dispatch): Promise<UploadOutcome[]> => {
    dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.IN_PROGRESS }));
    dispatch(updateDuplicateFiles({ files: {} }));
    let checks: UploadCheck[];
    try {
      checks = await checkUploads(courseId, files);
    } catch {
      files.forEach(file => dispatch(updateErrors({ error: 'add', message: `Failed to validate ${file.name}.` })));
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.FAILED }));
      return [];
    }
    const conflicts: UploadConflicts = {};
    const fresh: File[] = [];
    files.forEach(file => {
      const check = checks.find(item => item.name === file.name.normalize('NFC'));
      if (check?.exists) {
        conflicts[file.name] = { file, check };
      } else {
        fresh.push(file);
      }
    });
    if (Object.keys(conflicts).length) {
      dispatch(updateDuplicateFiles({ files: conflicts }));
    }
    const outcomes = await Promise.all(fresh.map(file => dispatch(robboAddAssetFile(courseId, file, options))));
    if (!fresh.length) {
      // Nothing uploaded yet: the dialog decides; do not leave the page spinner on.
      dispatch(updateEditStatus({ editType: 'add', status: RequestStatus.SUCCESSFUL }));
    }
    return outcomes;
  };
}

/** Move files into `folder` (`''` — out of any folder); resolves to the moved ids. */
export function robboMoveAssets(courseId: string, assetIds: string[], folder: string, errorMessage: string) {
  return async (dispatch): Promise<string[] | null> => {
    dispatch(updateEditStatus({ editType: 'lock', status: RequestStatus.IN_PROGRESS }));
    try {
      const { moved, folder: savedFolder } = await moveAssetsToFolder(courseId, assetIds, folder);
      dispatch(updateModels({
        modelType: 'assets',
        models: moved.map(id => ({ id, robboFolder: savedFolder })),
      }));
      dispatch(updateEditStatus({ editType: 'lock', status: RequestStatus.SUCCESSFUL }));
      return moved;
    } catch {
      dispatch(updateErrors({ error: 'lock', message: errorMessage }));
      dispatch(updateEditStatus({ editType: 'lock', status: RequestStatus.FAILED }));
      return null;
    }
  };
}
