/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Certificates page: pick one of the certificate designs installed on the server
 * (robbo-theme/lms/templates/certificates/designs/<id>.html) for this course.
 */
import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert, Badge, Button, Hyperlink, Icon,
} from '@openedx/paragon';
import { Add, CheckCircle, WorkspacePremium } from '@openedx/paragon/icons';

import { useCourseAuthoringContext } from '@src/CourseAuthoringContext';
import { useCertificates } from '../data/apiHooks';
import {
  CertificateDesign, UploadedDesign, useCertificateDesign, useSetCertificateDesign, useUploadedDesigns,
} from './api';
import ArchiveDesignModal from './ArchiveDesignModal';
import CourseHoursField from './CourseHoursField';
import DesignEditor from './DesignEditor';
import messages from './messages';

const buildPreviewUrl = (webViewUrl: string, param: string, designId: string) => {
  const url = new URL(webViewUrl, window.location.origin);
  url.searchParams.set(param, designId);
  return url.toString();
};

const CertificateDesignPicker = () => {
  const intl = useIntl();
  const { courseId } = useCourseAuthoringContext();
  const { data, isError } = useCertificateDesign(courseId);
  const { data: certificatesData } = useCertificates(courseId);
  const saveMutation = useSetCertificateDesign(courseId);
  const canManage = !!data?.canManageDesigns;
  const { data: uploadedData } = useUploadedDesigns(canManage);
  // undefined: editor closed; null: new design; object: design being edited
  const [editing, setEditing] = useState<UploadedDesign | null | undefined>(undefined);
  const [archiving, setArchiving] = useState<CertificateDesign | null>(null);

  if (isError) {
    return <Alert variant="danger">{intl.formatMessage(messages.loadError)}</Alert>;
  }
  if (!data || data.designs.length === 0) {
    return null;
  }

  const selected = saveMutation.isPending ? saveMutation.variables : data.selected;
  const webViewUrl = certificatesData?.certificates?.length ? certificatesData.certificateWebViewUrl : '';

  // Inputs stay enabled while saving (a disabled focused radio loses focus and the page could jump);
  // the scroll position is restored once the course is saved.
  const selectDesign = (designId: string) => {
    if (saveMutation.isPending) { return; }
    const scrollY = window.scrollY;
    saveMutation.mutate(designId, {
      onSettled: () => window.requestAnimationFrame(() => window.scrollTo({ top: scrollY })),
    });
  };

  const uploadedEntry = (designId: string) => uploadedData?.designs.find((item) => item.id === designId) ?? null;

  const renderOption = (design: CertificateDesign) => {
    const isSelected = design.id === selected;
    const inputId = `certificate-design-${design.id}`;
    return (
      <div key={design.id} className={`certificate-design__option${isSelected ? ' is-selected' : ''}`}>
        <input
          id={inputId}
          className="certificate-design__input"
          type="radio"
          name="certificate-design"
          value={design.id}
          checked={isSelected}
          onChange={() => selectDesign(design.id)}
        />
        <label htmlFor={inputId} className="certificate-design__choice">
          <span className="certificate-design__thumb">
            {design.previewImageUrl ? (
              <img src={design.previewImageUrl} alt="" loading="lazy" />
            ) : (
              <span className="certificate-design__thumb-empty">
                <Icon src={WorkspacePremium} />
                {intl.formatMessage(messages.noThumbnail)}
              </span>
            )}
          </span>
          <span className="certificate-design__text">
            <span className="certificate-design__name">
              {design.title}
              {design.id === data.default && (
                <Badge variant="light">{intl.formatMessage(messages.defaultBadge)}</Badge>
              )}
              {design.origin === 'builder' ? (
                <Badge variant="info" title={intl.formatMessage(messages.uploadedBadgeHint)}>
                  {intl.formatMessage(messages.uploadedBadge)}
                </Badge>
              ) : (
                <Badge variant="dark" title={intl.formatMessage(messages.customBadgeHint)}>
                  {intl.formatMessage(messages.customBadge)}
                </Badge>
              )}
              {isSelected && (
                <span className="certificate-design__selected">
                  <Icon src={CheckCircle} size="sm" />
                  {intl.formatMessage(messages.selected)}
                </span>
              )}
            </span>
            {design.description && (
              <span className="certificate-design__description">{design.description}</span>
            )}
          </span>
        </label>
        <div className="certificate-design__actions">
          {webViewUrl && (
            <Hyperlink
              className="certificate-design__preview"
              destination={buildPreviewUrl(webViewUrl, data.previewQueryParam, design.id)}
              target="_blank"
              showLaunchIcon
            >
              {intl.formatMessage(messages.preview)}
            </Hyperlink>
          )}
          {canManage && design.origin === 'builder' && uploadedEntry(design.id) && (
            <Button variant="link" size="sm" onClick={() => setEditing(uploadedEntry(design.id))}>
              {intl.formatMessage(messages.edit)}
            </Button>
          )}
          {canManage && design.origin === 'builder' && (
            <Button variant="link" size="sm" className="text-danger" onClick={() => setArchiving(design)}>
              {intl.formatMessage(messages.editorArchive)}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="certificate-design">
      <fieldset className="certificate-design__fieldset">
        <legend className="certificate-design__title">
          <span>{intl.formatMessage(messages.title)}</span>
          {canManage && (
            <Button
              variant="outline-primary"
              size="sm"
              iconBefore={Add}
              disabled={!uploadedData}
              onClick={() => setEditing(null)}
            >
              {intl.formatMessage(messages.upload)}
            </Button>
          )}
        </legend>
        <p className="certificate-design__hint">{intl.formatMessage(messages.hint)}</p>
        {saveMutation.isError && (
          <Alert variant="danger">{intl.formatMessage(messages.saveError)}</Alert>
        )}
        <div className="certificate-design__grid">
          {data.designs.map(renderOption)}
        </div>
      </fieldset>
      {/* Course volume matters only for a design that prints it */}
      {data.designs.find((design) => design.id === selected)?.usesHours && (
        <CourseHoursField key={data.courseHours ?? 'none'} courseId={courseId} hours={data.courseHours} />
      )}
      {!webViewUrl && (
        <p className="certificate-design__hint small mb-0">{intl.formatMessage(messages.previewUnavailable)}</p>
      )}
      <ArchiveDesignModal design={archiving} onClose={() => setArchiving(null)} />
      {editing !== undefined && uploadedData && (
        <DesignEditor
          design={editing}
          defaultFields={uploadedData.defaultFields}
          onClose={() => setEditing(undefined)}
        />
      )}
    </section>
  );
};

export default CertificateDesignPicker;
