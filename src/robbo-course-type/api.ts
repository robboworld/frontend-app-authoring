/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course type: paid access and paid certificate).
 * See NOTICE at repository root.
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { useMutationWithProcessingNotification } from '@src/generic/processing-notification/data/apiHooks';

export interface CourseTypeData {
  /** Platform staff and superusers change the course type; the course team only reads it. */
  canEdit: boolean;
  /** The waffle switch robbo_certificates.paid_certificates: off → certificates stay free. */
  paidCertificatesSwitch: boolean;
  /** The course passing grade, %; the certificate threshold can't be lower. */
  passingPercent: number | null;
  certificate: {
    paid: boolean;
    price: number | null;
    minPercent: number | null;
    freeForVerified: boolean;
    freeForCohorts: number[];
  };
  fullAccess: {
    paid: boolean;
    price: number | null;
    /** Learners who already paid for full access. */
    learners: number;
  };
  cohorts: { id: number; name: string; }[];
  /** What of the course needs full access (openedx-platform lms/djangoapps/robbo_paid_content). */
  paidContent: {
    enabled: boolean;
    /** Sections 1..N are free; null — no such rule. */
    freeSections: number | null;
    gradedPaid: boolean;
    display: 'locked' | 'hidden';
    grading: 'zero' | 'excluded';
    /** Sections in the course and sections/subsections marked «Только полный доступ» in the outline. */
    sections: number;
    locked: number;
  };
}

export interface CourseTypeUpdate {
  certificate?: {
    paid: boolean;
    price?: string;
    min_percent?: string | null;
    free_for_verified?: boolean;
    free_for_cohorts?: number[];
  };
  full_access?: { paid: boolean; price?: string; };
  paid_content?: {
    enabled: boolean;
    free_sections?: string | null;
    graded_paid?: boolean;
    display?: 'locked' | 'hidden';
    grading?: 'zero' | 'excluded';
  };
}

export const getCourseTypeApiUrl = (courseId: string) =>
  `${getConfig().STUDIO_BASE_URL}/api/contentstore/v1/robbo/course-type/${courseId}`;

export async function getCourseType(courseId: string): Promise<CourseTypeData> {
  const { data } = await getAuthenticatedHttpClient().get(getCourseTypeApiUrl(courseId));
  return camelCaseObject(data);
}

export async function updateCourseType(courseId: string, update: CourseTypeUpdate): Promise<CourseTypeData> {
  const { data } = await getAuthenticatedHttpClient().put(getCourseTypeApiUrl(courseId), update);
  return camelCaseObject(data);
}

/** Server message for a failed save (Russian text from the API), if any. */
export const getApiErrorMessage = (error: unknown): string | undefined => (
  (error as { response?: { data?: { error?: string; }; }; })?.response?.data?.error
);

const courseTypeQueryKey = (courseId: string) => ['robbo-course-type', courseId];

export const useCourseType = (courseId: string) =>
  useQuery({
    queryKey: courseTypeQueryKey(courseId),
    queryFn: () => getCourseType(courseId),
  });

export const useUpdateCourseType = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutationWithProcessingNotification({
    mutationFn: (update: CourseTypeUpdate) => updateCourseType(courseId, update),
    onSuccess: (data) => queryClient.setQueryData(courseTypeQueryKey(courseId), data),
  });
};
