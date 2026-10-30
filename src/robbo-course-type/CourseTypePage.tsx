/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course type: paid access and paid certificate).
 * See NOTICE at repository root.
 */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert,
  Card,
  Container,
  Form,
  StatefulButton,
} from '@openedx/paragon';
import { CheckCircle, Info, Warning } from '@openedx/paragon/icons';

import { useCourseAuthoringContext } from '@src/CourseAuthoringContext';
import { STATEFUL_BUTTON_STATES } from '@src/constants';
import ConnectionErrorAlert from '@src/generic/ConnectionErrorAlert';
import SubHeader from '@src/generic/sub-header/SubHeader';
import getPageHeadTitle from '@src/generic/utils';

import {
  CourseTypeData,
  CourseTypeUpdate,
  getApiErrorMessage,
  useCourseType,
  useUpdateCourseType,
} from './api';
import messages from './messages';

interface Draft {
  fullAccessPaid: boolean;
  fullAccessPrice: string;
  certificatePaid: boolean;
  certificatePrice: string;
  minPercent: string;
  freeForVerified: boolean;
  freeForCohorts: number[];
  paidContentEnabled: boolean;
  freeSections: string;
  gradedPaid: boolean;
  display: 'locked' | 'hidden';
  grading: 'zero' | 'excluded';
}

const draftFromData = (data: CourseTypeData): Draft => ({
  fullAccessPaid: data.fullAccess.paid,
  fullAccessPrice: data.fullAccess.price == null ? '' : String(data.fullAccess.price),
  certificatePaid: data.certificate.paid,
  certificatePrice: data.certificate.price == null ? '' : String(data.certificate.price),
  minPercent: data.certificate.minPercent == null ? '' : String(data.certificate.minPercent),
  freeForVerified: data.certificate.freeForVerified,
  freeForCohorts: data.certificate.freeForCohorts,
  paidContentEnabled: data.paidContent.enabled,
  freeSections: data.paidContent.freeSections == null ? '' : String(data.paidContent.freeSections),
  gradedPaid: data.paidContent.gradedPaid,
  display: data.paidContent.display,
  grading: data.paidContent.grading,
});

const updateFromDraft = (draft: Draft): CourseTypeUpdate => ({
  full_access: draft.fullAccessPaid
    ? { paid: true, price: draft.fullAccessPrice.trim() }
    : { paid: false },
  certificate: draft.certificatePaid
    ? {
      paid: true,
      price: draft.certificatePrice.trim(),
      min_percent: draft.minPercent.trim() || null,
      free_for_verified: draft.freeForVerified,
      free_for_cohorts: draft.freeForCohorts,
    }
    : { paid: false },
  paid_content: draft.paidContentEnabled
    ? {
      enabled: true,
      free_sections: draft.freeSections.trim() || null,
      graded_paid: draft.gradedPaid,
      display: draft.display,
      grading: draft.grading,
    }
    : { enabled: false },
});

const typeMessage = (fullAccessPaid: boolean, certificatePaid: boolean) => {
  if (fullAccessPaid && certificatePaid) { return messages.typeBoth; }
  if (fullAccessPaid) { return messages.typeFullAccess; }
  if (certificatePaid) { return messages.typeCertificate; }
  return messages.typeFree;
};

const CourseTypePage = () => {
  const intl = useIntl();
  const { courseId, courseDetails } = useCourseAuthoringContext();
  const { data, isLoading, isError } = useCourseType(courseId);
  const update = useUpdateCourseType(courseId);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setDraft(draftFromData(data));
    }
  }, [data]);

  if (isError) {
    return (
      <Container size="xl" className="px-4 mt-4">
        <ConnectionErrorAlert />
      </Container>
    );
  }
  if (isLoading || !data || !draft) {
    return null;
  }

  const { canEdit } = data;
  const change = (patch: Partial<Draft>) => {
    setSaved(false);
    update.reset();
    setDraft({ ...draft, ...patch });
  };
  const toggleCohort = (cohortId: number, checked: boolean) =>
    change({
      freeForCohorts: checked
        ? [...draft.freeForCohorts, cohortId]
        : draft.freeForCohorts.filter((id) => id !== cohortId),
    });
  const handleSave = () => {
    setSaved(false);
    update.mutate(updateFromDraft(draft), { onSuccess: () => setSaved(true) });
  };
  const saveError = update.isError
    ? getApiErrorMessage(update.error) || intl.formatMessage(messages.saveError)
    : null;
  const minPercentHint = data.passingPercent == null
    ? intl.formatMessage(messages.minPercentHintUnknown)
    : intl.formatMessage(messages.minPercentHint, { percent: data.passingPercent });

  return (
    <>
      <Helmet>
        <title>{getPageHeadTitle(courseDetails?.name ?? '', intl.formatMessage(messages.headingTitle))}</title>
      </Helmet>
      <Container size="xl" className="robbo-course-type px-4">
        <div className="mt-5">
          <SubHeader
            title={intl.formatMessage(messages.headingTitle)}
            subtitle={intl.formatMessage(messages.headingSubtitle)}
            description={intl.formatMessage(messages.description)}
          />
        </div>
        <div className="col-lg-9 px-0 mb-5">
          <p className="h4 mb-4" data-testid="robbo-course-type-current">
            {intl.formatMessage(messages.currentType, {
              type: intl.formatMessage(typeMessage(draft.fullAccessPaid, draft.certificatePaid)),
            })}
          </p>

          {!canEdit && <Alert variant="info" icon={Info}>{intl.formatMessage(messages.readOnly)}</Alert>}
          {canEdit && draft.certificatePaid && !data.paidCertificatesSwitch && (
            <Alert variant="warning" icon={Warning}>{intl.formatMessage(messages.switchOff)}</Alert>
          )}

          <Card className="mb-4">
            <Card.Section>
              <h3 className="h4">{intl.formatMessage(messages.fullAccessTitle)}</h3>
              <p className="small text-gray-700">{intl.formatMessage(messages.fullAccessHint)}</p>
              <Form.Switch
                checked={draft.fullAccessPaid}
                disabled={!canEdit}
                onChange={(event) => change({ fullAccessPaid: event.target.checked })}
              >
                {intl.formatMessage(messages.fullAccessPaid)}
              </Form.Switch>
              {draft.fullAccessPaid && (
                <Form.Group className="mt-3 mb-0" controlId="robbo-full-access-price">
                  <Form.Label>{intl.formatMessage(messages.price)}</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    step={1}
                    value={draft.fullAccessPrice}
                    disabled={!canEdit}
                    onChange={(event) => change({ fullAccessPrice: event.target.value })}
                  />
                </Form.Group>
              )}
              {data.fullAccess.learners > 0 && (
                <p className="small text-gray-700 mt-3 mb-0">
                  {intl.formatMessage(messages.fullAccessLearners, { count: data.fullAccess.learners })}
                  {!draft.fullAccessPaid && ` ${intl.formatMessage(messages.fullAccessOffWithLearners)}`}
                </p>
              )}
            </Card.Section>
          </Card>

          <Card className="mb-4">
            <Card.Section>
              <h3 className="h4">{intl.formatMessage(messages.certificateTitle)}</h3>
              <p className="small text-gray-700">{intl.formatMessage(messages.certificateHint)}</p>
              <Form.Switch
                checked={draft.certificatePaid}
                disabled={!canEdit}
                onChange={(event) => change({ certificatePaid: event.target.checked })}
              >
                {intl.formatMessage(messages.certificatePaid)}
              </Form.Switch>
              {draft.certificatePaid && (
                <>
                  <Form.Group className="mt-3" controlId="robbo-certificate-price">
                    <Form.Label>{intl.formatMessage(messages.price)}</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      step={1}
                      value={draft.certificatePrice}
                      disabled={!canEdit}
                      onChange={(event) => change({ certificatePrice: event.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="robbo-certificate-min-percent">
                    <Form.Label>{intl.formatMessage(messages.minPercent)}</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={draft.minPercent}
                      placeholder={data.passingPercent == null ? '' : String(data.passingPercent)}
                      disabled={!canEdit}
                      onChange={(event) => change({ minPercent: event.target.value })}
                    />
                    <Form.Control.Feedback>{minPercentHint}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Checkbox
                    checked={draft.freeForVerified}
                    disabled={!canEdit}
                    onChange={(event) => change({ freeForVerified: event.target.checked })}
                  >
                    {intl.formatMessage(messages.freeForVerified)}
                  </Form.Checkbox>
                  <Form.Group className="mt-3 mb-0">
                    <Form.Label>{intl.formatMessage(messages.freeForCohorts)}</Form.Label>
                    {data.cohorts.length === 0 && (
                      <p className="small text-gray-700 mb-0">{intl.formatMessage(messages.noCohorts)}</p>
                    )}
                    {data.cohorts.map((cohort) => (
                      <Form.Checkbox
                        key={cohort.id}
                        checked={draft.freeForCohorts.includes(cohort.id)}
                        disabled={!canEdit}
                        onChange={(event) => toggleCohort(cohort.id, event.target.checked)}
                      >
                        {cohort.name}
                      </Form.Checkbox>
                    ))}
                  </Form.Group>
                </>
              )}
            </Card.Section>
          </Card>

          <Card className="mb-4" data-testid="robbo-paid-content">
            <Card.Section>
              <h3 className="h4">{intl.formatMessage(messages.paidContentTitle)}</h3>
              <p className="small text-gray-700">{intl.formatMessage(messages.paidContentHint)}</p>
              <Form.Switch
                checked={draft.paidContentEnabled}
                disabled={!canEdit}
                onChange={(event) => change({ paidContentEnabled: event.target.checked })}
              >
                {intl.formatMessage(messages.paidContentEnabled)}
              </Form.Switch>
              {draft.paidContentEnabled && (
                <>
                  {!draft.fullAccessPaid && (
                    <Alert variant="warning" icon={Warning} className="mt-3">
                      {intl.formatMessage(messages.notSold)}
                    </Alert>
                  )}
                  <p className="mt-3 mb-1">
                    {intl.formatMessage(messages.lockedInOutline, { count: data.paidContent.locked })}
                  </p>
                  <p className="small text-gray-700">{intl.formatMessage(messages.lockedHint)}</p>
                  <Form.Group controlId="robbo-paid-content-free-sections">
                    <Form.Label>{intl.formatMessage(messages.freeSections)}</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      step={1}
                      value={draft.freeSections}
                      disabled={!canEdit}
                      onChange={(event) => change({ freeSections: event.target.value })}
                    />
                    <Form.Control.Feedback>
                      {intl.formatMessage(messages.freeSectionsHint, { count: data.paidContent.sections })}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Checkbox
                    checked={draft.gradedPaid}
                    disabled={!canEdit}
                    onChange={(event) => change({ gradedPaid: event.target.checked })}
                  >
                    {intl.formatMessage(messages.gradedPaid)}
                  </Form.Checkbox>
                  <Form.Group className="mt-3">
                    <Form.Label>{intl.formatMessage(messages.display)}</Form.Label>
                    <Form.RadioSet
                      name="robbo-paid-content-display"
                      value={draft.display}
                      onChange={(event) => change({ display: event.target.value as Draft['display'] })}
                    >
                      <Form.Radio value="locked" disabled={!canEdit}>
                        {intl.formatMessage(messages.displayLocked)}
                      </Form.Radio>
                      <Form.Radio value="hidden" disabled={!canEdit}>
                        {intl.formatMessage(messages.displayHidden)}
                      </Form.Radio>
                    </Form.RadioSet>
                  </Form.Group>
                  <Form.Group className="mb-0">
                    <Form.Label>{intl.formatMessage(messages.grading)}</Form.Label>
                    <Form.RadioSet
                      name="robbo-paid-content-grading"
                      value={draft.grading}
                      onChange={(event) => change({ grading: event.target.value as Draft['grading'] })}
                    >
                      <Form.Radio value="zero" disabled={!canEdit}>
                        {intl.formatMessage(messages.gradingZero)}
                      </Form.Radio>
                      <Form.Radio value="excluded" disabled={!canEdit}>
                        {intl.formatMessage(messages.gradingExcluded)}
                      </Form.Radio>
                    </Form.RadioSet>
                  </Form.Group>
                </>
              )}
            </Card.Section>
          </Card>

          {saveError && <Alert variant="danger" icon={Warning}>{saveError}</Alert>}
          {saved && <Alert variant="success" icon={CheckCircle}>{intl.formatMessage(messages.saved)}</Alert>}
          {canEdit && (
            <StatefulButton
              variant="primary"
              state={update.isPending ? STATEFUL_BUTTON_STATES.pending : STATEFUL_BUTTON_STATES.default}
              labels={{
                default: intl.formatMessage(messages.save),
                pending: intl.formatMessage(messages.saving),
              }}
              disabledStates={[STATEFUL_BUTTON_STATES.pending]}
              onClick={handleSave}
            >
              {intl.formatMessage(messages.save)}
            </StatefulButton>
          )}
        </div>
      </Container>
    </>
  );
};

export default CourseTypePage;
