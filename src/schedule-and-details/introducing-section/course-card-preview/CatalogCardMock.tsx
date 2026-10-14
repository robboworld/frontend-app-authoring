/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Catalog card as a learner who is not enrolled sees it on /courses (desktop):
 * robbo-theme templates/courseware/_robbo_course_card.html + sass/courseware/_robbo-courses-catalog.scss.
 */
import { CSSProperties, useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getPlaceholderImageUrl } from './data';
import SafeZoneOverlay, { SafeZone } from './SafeZoneOverlay';
import {
  formatCatalogDate,
  getCatalogDescription,
  getCatalogDescriptionSizeRem,
  parseDate,
} from './utils';
import messages from './messages';

interface CatalogCardMockProps {
  imageUrl: string;
  title: string;
  startDate?: string | null;
  advertisedStart?: string | null;
  shortDescription?: string;
  overview?: string;
  safeZone?: SafeZone | null;
}

const CatalogCardMock = ({
  imageUrl, title, startDate, advertisedStart, shortDescription, overview, safeZone,
}: CatalogCardMockProps) => {
  const intl = useIntl();
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  useEffect(() => setIsPlaceholder(false), [imageUrl]);

  const start = parseDate(startDate);
  const startLabel = advertisedStart || (start && formatCatalogDate(start));
  const description = getCatalogDescription(shortDescription, overview);
  const descriptionStyle = {
    '--robbo-card-mock-desc-size': `${getCatalogDescriptionSizeRem(description)}rem`,
  } as CSSProperties;

  return (
    <div className="robbo-card-mock robbo-card-mock--catalog">
      <div className="robbo-card-mock__catalog-body">
        <div className="robbo-card-mock__catalog-copy">
          <div className="robbo-card-mock__catalog-main">
            <p className="robbo-card-mock__catalog-title">{title}</p>
            <p className="robbo-card-mock__catalog-meta">
              {startLabel && (
                <span className="robbo-card-mock__catalog-meta-item">
                  {intl.formatMessage(messages.catalogStart, { date: startLabel })}
                </span>
              )}
              <span className="robbo-card-mock__catalog-about">{intl.formatMessage(messages.catalogAbout)}</span>
            </p>
            {description && (
              <p className="robbo-card-mock__catalog-desc" style={descriptionStyle}>{description}</p>
            )}
          </div>
          <div className={`robbo-card-mock__catalog-media${isPlaceholder ? ' is-placeholder' : ''}`}>
            <img
              className="robbo-card-mock__catalog-img"
              src={isPlaceholder ? getPlaceholderImageUrl() : imageUrl}
              alt=""
              onError={() => setIsPlaceholder(true)}
            />
            {safeZone && !isPlaceholder && <SafeZoneOverlay {...safeZone} fit="cover-top" />}
          </div>
        </div>
        <span className="robbo-card-mock__catalog-cta">{intl.formatMessage(messages.catalogCta)}</span>
      </div>
    </div>
  );
};

export default CatalogCardMock;
