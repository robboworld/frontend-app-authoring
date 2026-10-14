/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course deletion in Studio). See NOTICE at repository root.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import { camelCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { getApiBaseUrl } from '../data/api';

export interface CourseDeletionSummary {
  courseId: string;
  displayName: string;
  /** Learners with an active enrollment. */
  enrollmentCount: number;
}

const getCourseDeleteApiUrl = (courseKey: string) =>
  `${getApiBaseUrl()}/api/contentstore/v1/robbo/courses/${courseKey}`;

export async function getCourseDeletionSummary(courseKey: string): Promise<CourseDeletionSummary> {
  const { data } = await getAuthenticatedHttpClient().get(getCourseDeleteApiUrl(courseKey));
  return camelCaseObject(data);
}

export async function deleteCourse(courseKey: string): Promise<void> {
  await getAuthenticatedHttpClient().delete(getCourseDeleteApiUrl(courseKey));
}

export const useCourseDeletionSummary = (courseKey: string | undefined) =>
  useQuery({
    queryKey: ['studioHome', 'robbo-course-delete', courseKey],
    queryFn: () => getCourseDeletionSummary(courseKey!),
    enabled: !!courseKey,
    // Enrollments change; always show the current count.
    gcTime: 0,
  });

export const useDeleteCourse = () => useMutation({ mutationFn: deleteCourse });
