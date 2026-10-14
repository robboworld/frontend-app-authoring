/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * LMS data for the card mock-ups that the Schedule & Details form does not have
 * (lms/djangoapps/learner_home/robbo_card_preview.py, CourseCardPreviewView).
 */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { skipToken, useQuery } from '@tanstack/react-query';

export type PreviewTarget = 'catalog' | 'dashboard';

export interface CardPreviewData {
  catalog: {
    advertisedStart: string | null;
  };
  dashboard: {
    courseRun: {
      minPassingGrade: string | number | null;
      progress: { totalCount: number } | null;
    };
    enrollment: {
      isAudit: boolean;
    };
  };
}

/** Real page with the card preview block (LMS checks access and redirects). */
export const getPreviewPageUrl = (courseId: string, target: PreviewTarget) => (
  `${getConfig().LMS_BASE_URL}/robbo/course-card-preview/${courseId}/${target}/`
);

export const getPlaceholderImageUrl = () => `${getConfig().LMS_BASE_URL}/theming/asset/images/no_course_image.png`;

const getPreviewApiUrl = (courseId: string) => (
  `${getConfig().LMS_BASE_URL}/api/robbo/v1/course-card-preview/${courseId}/`
);

export const useCardPreviewData = (courseId?: string) => (
  useQuery<CardPreviewData>({
    queryKey: ['robboCourseCardPreview', courseId],
    queryFn: courseId
      ? async () => camelCaseObject((await getAuthenticatedHttpClient().get(getPreviewApiUrl(courseId))).data)
      : skipToken,
    retry: false,
    staleTime: Infinity,
  })
);
