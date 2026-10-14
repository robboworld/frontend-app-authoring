/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Backend: cms/djangoapps/contentstore/robbo_asset_uploads.py, robbo_asset_folders.py and
 * rest_api/v1/views/robbo_asset_catalog.py.
 */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getAssetsUrl } from '../data/api';
import type { UsageLocation } from './usageText';

export type UploadStatus = 'created' | 'reused' | 'replaced' | 'renamed';

export interface UploadCheck {
  name: string;
  assetName: string;
  exists: boolean;
  suggestedName: string | null;
  existing: null | {
    id: string;
    displayName: string;
    fileSize: number | null;
    sameSize: boolean;
    robboFolder: string;
    usageLocations: UsageLocation[];
  };
}

export interface UploadResult {
  asset: Record<string, any>;
  robboUpload?: {
    status: UploadStatus;
    name: string;
    originalName: string;
  };
}

const getCatalogApiUrl = (courseId: string) => (
  `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/robbo/assets/${courseId}`
);

/** Which of the files about to be uploaded already have a namesake in the course. */
export async function checkUploads(courseId: string, files: File[]): Promise<UploadCheck[]> {
  const { data } = await getAuthenticatedHttpClient().post(`${getCatalogApiUrl(courseId)}/upload-check`, {
    files: files.map(file => ({ name: file.name, size: file.size })),
  });
  return camelCaseObject(data).files;
}

/**
 * Upload a file; the server never overwrites a namesake unless `onConflict` is `replace`
 * (same content is reused, different content is saved as `<name>-2.<ext>`).
 */
export async function uploadAsset(
  courseId: string,
  file: File,
  { folder, onConflict }: { folder?: string | null; onConflict?: 'replace' } = {},
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('robbo_folder', folder);
  }
  if (onConflict) {
    formData.append('robbo_on_conflict', onConflict);
  }
  const { data } = await getAuthenticatedHttpClient().post(getAssetsUrl(courseId), formData);
  return camelCaseObject(data);
}

/** Put files into an author folder (`''` — out of any folder). */
export async function moveAssetsToFolder(
  courseId: string,
  assetIds: string[],
  folder: string,
): Promise<{ moved: string[]; folder: string }> {
  const { data } = await getAuthenticatedHttpClient().post(`${getCatalogApiUrl(courseId)}/folders/move`, {
    asset_ids: assetIds,
    folder,
  });
  return data;
}
