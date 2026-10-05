/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Course volume in hours, shown by the «Объём, часов» field of certificate designs.
 */
import { ChangeEvent, FormEvent, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, StatefulButton } from '@openedx/paragon';

import { getApiErrorMessage, useSetCourseHours } from './api';
import { MAX_COURSE_HOURS } from './designFields';
import messages from './messages';

interface CourseHoursFieldProps {
  courseId: string;
  hours: number | null;
}

const CourseHoursField = ({ courseId, hours }: CourseHoursFieldProps) => {
  const intl = useIntl();
  const mutation = useSetCourseHours(courseId);
  const [value, setValue] = useState(hours ? String(hours) : '');

  const parsed = value.trim() === '' ? null : Number(value);
  const isValid = parsed === null || (Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_COURSE_HOURS);
  const isChanged = parsed !== (hours ?? null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isValid && isChanged) {
      mutation.mutate(parsed);
    }
  };

  const error = !isValid
    ? intl.formatMessage(messages.hoursInvalid, { max: MAX_COURSE_HOURS })
    : (mutation.isError && (getApiErrorMessage(mutation.error) || intl.formatMessage(messages.hoursSaveError))) || '';

  return (
    <form className="certificate-design__hours" onSubmit={handleSubmit}>
      <Form.Group controlId="certificate-course-hours" isInvalid={!!error} className="mb-0">
        <Form.Label>{intl.formatMessage(messages.hoursLabel)}</Form.Label>
        <div className="certificate-design__hours-row">
          <Form.Control
            type="number"
            min={1}
            max={MAX_COURSE_HOURS}
            step={1}
            inputMode="numeric"
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          />
          <StatefulButton
            type="submit"
            variant="outline-primary"
            state={mutation.isPending ? 'pending' : 'default'}
            labels={{
              default: intl.formatMessage(messages.editorSave),
              pending: intl.formatMessage(messages.editorSaving),
            }}
            disabledStates={['pending']}
            disabled={!isValid || !isChanged}
          />
        </div>
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        {!error && !hours && (
          <Form.Text className="certificate-design__hours-missing">{intl.formatMessage(messages.hoursMissing)}</Form.Text>
        )}
        {!error && !!hours && <Form.Text>{intl.formatMessage(messages.hoursHint)}</Form.Text>}
      </Form.Group>
    </form>
  );
};

export default CourseHoursField;
