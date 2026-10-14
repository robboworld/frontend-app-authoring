/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * «Мои курсы» card right after enrolling (desktop row; stacked when the field is narrow):
 * frontend-app-learner-dashboard containers/CourseCard (CourseCard.scss, CourseCardStatus,
 * CourseCardDetails, CourseCardProgress, CourseBanner, CertificateBanner, BeginCourseButton).
 */
import { ReactNode, useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Alert } from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';

import { CardPreviewData, getPlaceholderImageUrl } from './data';
import SafeZoneOverlay, { SafeZone } from './SafeZoneOverlay';
import { parseDate } from './utils';
import messages from './messages';

interface DashboardCardMockProps {
  imageUrl: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  lmsData?: CardPreviewData['dashboard'];
  safeZone?: SafeZone | null;
}

const DATE_FORMAT = { year: 'numeric', month: 'long', day: 'numeric' } as const;

const DashboardCardMock = ({
  imageUrl, title, startDate, endDate, lmsData, safeZone,
}: DashboardCardMockProps) => {
  const intl = useIntl();
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  useEffect(() => setIsPlaceholder(false), [imageUrl]);

  const now = new Date();
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const isStarted = !start || start <= now;
  const isArchived = Boolean(end && end < now);
  const formatDate = (date: Date) => intl.formatDate(date, DATE_FORMAT);

  // CourseCardDetails.useAccessMessage for a fresh enrollment (no audit deadline yet).
  let accessMessage: string | null = null;
  if (!isStarted && start) {
    accessMessage = intl.formatMessage(messages.dashboardCourseStarts, { startDate: formatDate(start) });
  } else if (isStarted && end) {
    accessMessage = intl.formatMessage(
      isArchived ? messages.dashboardCourseEnded : messages.dashboardCourseEnds,
      { endDate: formatDate(end) },
    );
  }

  const progressTotal = lmsData?.courseRun.progress?.totalCount || 0;
  const rawGrade = lmsData?.courseRun.minPassingGrade;
  const minPassingGrade = rawGrade == null ? null : Math.floor(Number(rawGrade) * 100);
  const isAudit = lmsData?.enrollment.isAudit ?? true;

  // CourseBanner (course not open yet) and CertificateBanner (nothing earned, not passing).
  const banners: Array<{ key: string, variant: string, content: ReactNode }> = [];
  if (!isStarted && start) {
    banners.push({
      key: 'not-started',
      variant: 'info',
      content: intl.formatMessage(messages.dashboardNotStartedBanner, { startDate: formatDate(start) }),
    });
  }
  if (minPassingGrade !== null) {
    if (isAudit) {
      banners.push({
        key: 'grade',
        variant: 'info',
        content: intl.formatMessage(messages.dashboardPassingGrade, { minPassingGrade }),
      });
    } else if (isArchived) {
      banners.push({
        key: 'grade',
        variant: 'warning',
        content: `${intl.formatMessage(messages.dashboardNotEligible)}  ${intl.formatMessage(messages.dashboardViewGrades)}`,
      });
    } else {
      banners.push({
        key: 'grade',
        variant: 'warning',
        content: intl.formatMessage(messages.dashboardCertMinGrade, { minPassingGrade }),
      });
    }
  }

  return (
    <div className="robbo-card-mock robbo-card-mock--dashboard">
      <div className="robbo-card-mock__dash-media">
        <img
          className={`robbo-card-mock__dash-img${isPlaceholder ? ' is-placeholder' : ''}`}
          src={isPlaceholder ? getPlaceholderImageUrl() : imageUrl}
          alt=""
          onError={() => setIsPlaceholder(true)}
        />
        {safeZone && !isPlaceholder && (
          <>
            <SafeZoneOverlay {...safeZone} fit="cover-center" />
            <SafeZoneOverlay {...safeZone} fit="contain" />
          </>
        )}
      </div>
      <div className="robbo-card-mock__dash-body">
        <div className="robbo-card-mock__dash-header">
          <span className="robbo-card-mock__dash-status">{intl.formatMessage(messages.dashboardNotStarted)}</span>
          <p className="robbo-card-mock__dash-title">{title}</p>
        </div>
        <div className="robbo-card-mock__dash-section">
          {accessMessage && <span className="robbo-card-mock__dash-details">{accessMessage}</span>}
          {progressTotal > 0 && (
            <div className="robbo-card-mock__dash-progress">
              <div className="robbo-card-mock__dash-progress-row">
                <div className="robbo-card-mock__dash-progress-track" />
                <span className="robbo-card-mock__dash-progress-percent">0%</span>
              </div>
              <p className="robbo-card-mock__dash-progress-units">
                {intl.formatMessage(messages.dashboardUnits, { completed: 0, total: progressTotal })}
              </p>
            </div>
          )}
        </div>
        <div className="robbo-card-mock__dash-footer">
          {banners.length > 0 && (
            <div className="robbo-card-mock__dash-banners">
              {banners.map(({ key, variant, content }) => (
                <Alert key={key} variant={variant} icon={Info} className="mb-0">{content}</Alert>
              ))}
            </div>
          )}
          <span className={`btn btn-primary robbo-card-mock__dash-button${isStarted ? '' : ' disabled'}`}>
            {intl.formatMessage(messages.dashboardBeginCourse)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardMock;
