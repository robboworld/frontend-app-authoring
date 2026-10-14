/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Russian text and links for "where is this file used" entries. The backend
 * (cms/djangoapps/contentstore/robbo_asset_usage.py) adds a `robbo` object to every
 * usage location; entries without it (e.g. the videos page) keep the upstream text.
 */
import { getConfig } from '@edx/frontend-platform';
import type { IntlShape } from '@edx/frontend-platform/i18n';
import { createCorrectInternalRoute } from '@src/utils';
import messages from './messages';

export interface RobboUsagePathNode {
  id: string;
  name: string;
  type: string;
  position: number;
}

export interface RobboUsage {
  kind: string;
  label: string;
  detail?: string;
  field: string;
  blockId: string;
  path: RobboUsagePathNode[];
  otherCourse: string | null;
  publishedOnly: boolean;
}

export interface UsageLocation {
  displayLocation: string;
  url: string;
  robbo?: RobboUsage;
}

const PATH_SEPARATOR = ' › ';

/** Course pages of the authoring MFE that hold each kind of course-level usage. */
const KIND_PAGES: Record<string, string> = {
  course_image: 'settings/details',
  banner_image: 'settings/details',
  video_thumbnail: 'settings/details',
  about: 'settings/details',
  certificate: 'certificates',
  textbook: 'textbooks',
  page: 'custom-pages',
  updates: 'course_info',
  handouts: 'course_info',
  course_settings: 'settings/advanced',
};

const kindText = (intl: IntlShape, robbo: RobboUsage): string | null => {
  switch (robbo.kind) {
    case 'course_image':
      return intl.formatMessage(messages.usageCourseImage);
    case 'banner_image':
      return intl.formatMessage(messages.usageBannerImage);
    case 'video_thumbnail':
      return intl.formatMessage(messages.usageVideoThumbnail);
    case 'about':
      return intl.formatMessage(messages.usageAbout);
    case 'certificate':
      return robbo.detail
        ? intl.formatMessage(messages.usageCertificateSignatory, { name: robbo.label, signatory: robbo.detail })
        : intl.formatMessage(messages.usageCertificate, { name: robbo.label });
    case 'textbook':
      return intl.formatMessage(messages.usageTextbook, { name: robbo.label });
    case 'page':
      return intl.formatMessage(messages.usagePage, { name: robbo.label });
    case 'updates':
      return intl.formatMessage(messages.usageUpdates);
    case 'handouts':
      return intl.formatMessage(messages.usageHandouts);
    case 'course_settings':
      return intl.formatMessage(messages.usageCourseSettings, { field: robbo.label });
    case 'block':
      return robbo.path?.length ? robbo.path.map(node => node.name).join(PATH_SEPARATOR) : null;
    default:
      return null;
  }
};

/** Human-readable place of use, e.g. «Урок 1 › Тест › Вопрос 5 › Задача». */
export const formatUsageLocation = (intl: IntlShape, location: UsageLocation): string => {
  const { robbo } = location;
  if (!robbo) {
    return location.displayLocation;
  }
  let text = kindText(intl, robbo) || location.displayLocation;
  if (robbo.publishedOnly) {
    text = intl.formatMessage(messages.usagePublishedOnly, { location: text });
  }
  if (robbo.otherCourse) {
    text = intl.formatMessage(messages.usageOtherCourse, { location: text, course: robbo.otherCourse });
  }
  return text;
};

/** Link that opens the place of use: the unit for blocks, the course page for everything else. */
export const usageLink = (courseId: string, location: UsageLocation): string => {
  const page = location.robbo && KIND_PAGES[location.robbo.kind];
  if (page && courseId) {
    return createCorrectInternalRoute(`/course/${courseId}/${page}`);
  }
  return `${getConfig().STUDIO_BASE_URL}${location.url}`;
};

/** Stable React key: several places of use may share the same text. */
export const usageKey = (location: UsageLocation, index: number): string => {
  const { robbo } = location;
  if (!robbo) {
    return `usage-location-${location.displayLocation}-${index}`;
  }
  return `usage-location-${robbo.kind}-${robbo.blockId}-${robbo.label}-${robbo.detail || ''}-${index}`;
};
