/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Course card image field, once an image is set: the catalog card and the «Мои курсы» card
 * built from the form values (unsaved too), plus links to the real pages in preview mode
 * (LMS `robbo_course_card_preview` checks access). The image stays replaceable below.
 * The safe zone switch marks the part of the image both cards show; the size line compares the
 * image with the recommended 4:3, 1200×900; «Crop to 4:3» opens CardImageCropper (also right
 * after a dropzone upload that is not 4:3).
 */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Form, Hyperlink, Icon,
} from '@openedx/paragon';
import { Crop, Warning } from '@openedx/paragon/icons';

import CardImageCropper from './CardImageCropper';
import CatalogCardMock from './CatalogCardMock';
import DashboardCardMock from './DashboardCardMock';
import { getPreviewPageUrl, PreviewTarget, useCardPreviewData } from './data';
import { SafeZone } from './SafeZoneOverlay';
import {
  getSafeZone,
  ImageSize,
  isBelowRecommended,
  isCatalogRatio,
  RECOMMENDED_IMAGE,
} from './utils';
import messages from './messages';

/** Natural size of the image (null while loading or when it does not load). */
const useImageSize = (url: string): ImageSize | null => {
  const [size, setSize] = useState<ImageSize | null>(null);
  useEffect(() => {
    setSize(null);
    const image = new Image();
    image.onload = () => setSize({ width: image.naturalWidth, height: image.naturalHeight });
    image.src = url;
    return () => {
      image.onload = null;
    };
  }, [url]);
  return size;
};

interface CourseCardImagePreviewProps {
  imageUrl: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  shortDescription?: string;
  overview?: string;
  hasUnsavedChanges?: boolean;
  // From CourseUploadImage: upload a cropped file into the field (undefined when read-only),
  // and how many dropzone uploads there have been.
  uploadImage?: (file: File) => Promise<void>;
  uploadCount?: number;
}

const CourseCardImagePreview = ({
  imageUrl,
  title,
  startDate,
  endDate,
  shortDescription,
  overview,
  hasUnsavedChanges = false,
  uploadImage,
  uploadCount = 0,
}: CourseCardImagePreviewProps) => {
  const intl = useIntl();
  const { courseId } = useParams();
  const { data: lmsData } = useCardPreviewData(courseId);
  const imageSize = useImageSize(imageUrl);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const safeZone: SafeZone | null = showSafeZone && imageSize
    ? { imageSize, zone: getSafeZone(imageSize) }
    : null;
  const [isCropOpen, setIsCropOpen] = useState(false);

  // Offer the crop right after a dropzone upload whose image is not 4:3 (not on page load or undo).
  const lastUploadCount = useRef(uploadCount);
  const cropAfterUpload = useRef(false);
  useEffect(() => {
    if (uploadCount !== lastUploadCount.current) {
      lastUploadCount.current = uploadCount;
      cropAfterUpload.current = true;
    }
  }, [uploadCount]);
  useEffect(() => {
    if (cropAfterUpload.current && imageSize) {
      cropAfterUpload.current = false;
      if (uploadImage && !isCatalogRatio(imageSize)) {
        setIsCropOpen(true);
      }
    }
  }, [imageSize]);

  const imageWarnings = imageSize ? [
    isBelowRecommended(imageSize) && intl.formatMessage(messages.imageTooSmall, RECOMMENDED_IMAGE),
    !isCatalogRatio(imageSize) && intl.formatMessage(messages.imageNotFourThree),
  ].filter(Boolean) : [];

  const renderHead = (target: PreviewTarget, place: string) => (
    <div className="robbo-card-preview-field__head">
      <h3 className="robbo-card-preview-field__title">{place}</h3>
      {courseId && (
        <Hyperlink
          destination={getPreviewPageUrl(courseId, target)}
          target="_blank"
          className="robbo-card-preview-field__link"
          aria-label={intl.formatMessage(messages.openOnSiteLabel, { place })}
        >
          {intl.formatMessage(messages.openOnSite)}
        </Hyperlink>
      )}
    </div>
  );

  return (
    <div className="robbo-card-preview-field">
      <p className="robbo-card-preview-field__intro">
        {intl.formatMessage(messages.intro)}
        {hasUnsavedChanges && (
          <>
            {' '}
            <strong>{intl.formatMessage(messages.unsavedHint)}</strong>
          </>
        )}
      </p>
      {imageSize && (
        <div className="robbo-card-preview-field__image-info">
          <p className="robbo-card-preview-field__note">
            {intl.formatMessage(messages.imageSize, imageSize)}
          </p>
          {imageWarnings.map((warning) => (
            <p key={warning as string} className="robbo-card-preview-field__note robbo-card-preview-field__note--warning">
              <Icon src={Warning} size="xs" className="robbo-card-preview-field__warning-icon" />
              {warning}
            </p>
          ))}
          {uploadImage && (
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                iconBefore={Crop}
                className="robbo-card-preview-field__crop"
                onClick={() => setIsCropOpen(true)}
              >
                {intl.formatMessage(messages.cropButton)}
              </Button>
            </div>
          )}
        </div>
      )}
      {uploadImage && (
        <CardImageCropper
          isOpen={isCropOpen}
          imageUrl={imageUrl}
          onClose={() => setIsCropOpen(false)}
          onApply={uploadImage}
        />
      )}
      <div className="robbo-card-preview-field__safe-zone">
        <Form.Switch
          checked={showSafeZone}
          disabled={!imageSize}
          onChange={(event) => setShowSafeZone(event.target.checked)}
        >
          {intl.formatMessage(messages.safeZoneToggle)}
        </Form.Switch>
        {safeZone && (
          <p className="robbo-card-preview-field__note" role="status">
            {intl.formatMessage(safeZone.zone ? messages.safeZoneHint : messages.safeZoneNone)}
          </p>
        )}
      </div>
      <section className="robbo-card-preview-field__item robbo-card-preview-field__item--catalog">
        {renderHead('catalog', intl.formatMessage(messages.catalogTitle))}
        <CatalogCardMock
          imageUrl={imageUrl}
          title={title}
          startDate={startDate}
          advertisedStart={lmsData?.catalog.advertisedStart}
          shortDescription={shortDescription}
          overview={overview}
          safeZone={safeZone}
        />
      </section>
      <section className="robbo-card-preview-field__item">
        {renderHead('dashboard', intl.formatMessage(messages.dashboardTitle))}
        <DashboardCardMock
          imageUrl={imageUrl}
          title={title}
          startDate={startDate}
          endDate={endDate}
          lmsData={lmsData?.dashboard}
          safeZone={safeZone}
        />
      </section>
    </div>
  );
};

export default CourseCardImagePreview;
