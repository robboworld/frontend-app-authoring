/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { useMutationWithProcessingNotification } from '@src/generic/processing-notification/data/apiHooks';
import { NOTIFICATION_MESSAGES } from '@src/constants';
import { DesignField, fieldFromApi, fieldToApi } from './designFields';

export interface CertificateDesign {
  id: string;
  kind: 'theme' | 'uploaded';
  /** custom: made by the dev team (theme or flagged in admin); builder: made by staff in the builder */
  origin: 'custom' | 'builder';
  /** The design prints the course volume («Объём, часов» field). */
  usesHours: boolean;
  title: string;
  description: string;
  previewImageUrl: string | null;
}

export interface CertificateDesignData {
  designs: CertificateDesign[];
  selected: string;
  default: string;
  previewQueryParam: string;
  canManageDesigns: boolean;
  courseHours: number | null;
}

export interface UploadedDesign {
  id: string;
  title: string;
  description: string;
  backgroundUrl: string | null;
  fields: DesignField[];
}

export interface UploadedDesignsData {
  designs: UploadedDesign[];
  defaultFields: DesignField[];
}

export interface DesignDraft {
  id?: string;
  title: string;
  description: string;
  fields: DesignField[];
  background: File | null;
}

export const getCertificateDesignApiUrl = (courseId: string) =>
  `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/certificates/${courseId}/robbo-design`;

export async function getCertificateDesign(courseId: string): Promise<CertificateDesignData> {
  const { data } = await getAuthenticatedHttpClient().get(getCertificateDesignApiUrl(courseId));
  return camelCaseObject(data);
}

export interface CourseCertificateSettings {
  design?: string;
  course_hours?: number | null;
}

export async function updateCourseCertificateSettings(
  courseId: string,
  settings: CourseCertificateSettings,
): Promise<CertificateDesignData> {
  const { data } = await getAuthenticatedHttpClient().put(getCertificateDesignApiUrl(courseId), settings);
  return camelCaseObject(data);
}

const getUploadedDesignsApiUrl = (designId?: string) =>
  `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/robbo/certificate-designs${designId ? `/${designId}` : ''}`;

interface UploadedDesignApi {
  id: string;
  title: string;
  description: string;
  background_url: string | null;
  fields?: Record<string, unknown>[];
}

const uploadedFromApi = (raw: UploadedDesignApi): UploadedDesign => ({
  id: raw.id,
  title: raw.title,
  description: raw.description,
  backgroundUrl: raw.background_url,
  fields: (raw.fields ?? []).map(fieldFromApi),
});

export async function getUploadedDesigns(): Promise<UploadedDesignsData> {
  // Not camelCased: field keys are converted by fieldFromApi.
  const { data } = await getAuthenticatedHttpClient().get(getUploadedDesignsApiUrl());
  return {
    designs: (data.designs as UploadedDesignApi[]).map(uploadedFromApi),
    defaultFields: (data.default_fields as Record<string, unknown>[]).map(fieldFromApi),
  };
}

export async function saveUploadedDesign(draft: DesignDraft): Promise<UploadedDesign> {
  const form = new FormData();
  form.append('title', draft.title);
  form.append('description', draft.description);
  form.append('fields', JSON.stringify(draft.fields.map(fieldToApi)));
  if (draft.background) {
    form.append('background', draft.background);
  }
  const client = getAuthenticatedHttpClient();
  const { data } = draft.id
    ? await client.put(getUploadedDesignsApiUrl(draft.id), form)
    : await client.post(getUploadedDesignsApiUrl(), form);
  return uploadedFromApi(data);
}

export async function archiveUploadedDesign(designId: string): Promise<void> {
  await getAuthenticatedHttpClient().delete(getUploadedDesignsApiUrl(designId));
}

/** Server message for a failed save (Russian text from the API), if any. */
export const getApiErrorMessage = (error: unknown): string | undefined => (
  (error as { response?: { data?: { error?: string } } })?.response?.data?.error
);

const certificateDesignQueryKey = (courseId: string) => ['certificates', courseId, 'robbo-design'];
const uploadedDesignsQueryKey = ['certificates', 'robbo-uploaded-designs'];

export const useCertificateDesign = (courseId: string) => useQuery({
  queryKey: certificateDesignQueryKey(courseId),
  queryFn: () => getCertificateDesign(courseId),
});

export const useSetCertificateDesign = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutationWithProcessingNotification({
    mutationFn: (design: string) => updateCourseCertificateSettings(courseId, { design }),
    onSuccess: (data) => queryClient.setQueryData(certificateDesignQueryKey(courseId), data),
  });
};

export const useSetCourseHours = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutationWithProcessingNotification({
    mutationFn: (hours: number | null) => updateCourseCertificateSettings(courseId, { course_hours: hours }),
    onSuccess: (data) => queryClient.setQueryData(certificateDesignQueryKey(courseId), data),
  });
};

export const useUploadedDesigns = (enabled: boolean) => useQuery({
  queryKey: uploadedDesignsQueryKey,
  queryFn: getUploadedDesigns,
  enabled,
});

const useInvalidateDesigns = (courseId: string) => {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: uploadedDesignsQueryKey }),
    queryClient.invalidateQueries({ queryKey: certificateDesignQueryKey(courseId) }),
  ]);
};

export const useSaveUploadedDesign = (courseId: string) => {
  const invalidate = useInvalidateDesigns(courseId);
  return useMutationWithProcessingNotification({
    mutationFn: saveUploadedDesign,
    onSuccess: invalidate,
  });
};

export const useArchiveUploadedDesign = (courseId: string) => {
  const invalidate = useInvalidateDesigns(courseId);
  return useMutationWithProcessingNotification({
    mutationFn: archiveUploadedDesign,
    onSuccess: invalidate,
  }, {
    notificationMessage: NOTIFICATION_MESSAGES.deleting,
  });
};
