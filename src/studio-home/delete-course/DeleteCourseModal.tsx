/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course deletion in Studio). See NOTICE at repository root.
 *
 * Confirmation for deleting a course from the Studio home page (platform staff only).
 * The admin types the course ID to enable the button.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Alert,
  AlertModal,
  Button,
  Form,
  StatefulButton,
} from '@openedx/paragon';

import { useCourseDeletionSummary, useDeleteCourse } from './api';
import messages from './messages';
import './DeleteCourseModal.scss';

export interface CourseToDelete {
  courseKey: string;
  displayName: string;
}

interface DeleteCourseModalProps {
  course: CourseToDelete | null;
  onClose: () => void;
  onDeleted: (course: CourseToDelete) => void;
}

const DeleteCourseModal = ({ course, onClose, onDeleted }: DeleteCourseModalProps) => {
  const intl = useIntl();
  const [confirmation, setConfirmation] = useState('');
  const summary = useCourseDeletionSummary(course?.courseKey);
  const deleteMutation = useDeleteCourse();

  useEffect(() => {
    setConfirmation('');
    deleteMutation.reset();
  }, [course?.courseKey]);

  if (!course) {
    return null;
  }

  const name = summary.data?.displayName || course.displayName || course.courseKey;
  const canDelete = confirmation.trim() === course.courseKey && !summary.isPending;

  const handleDelete = () => {
    if (canDelete && !deleteMutation.isPending) {
      deleteMutation.mutate(course.courseKey, { onSuccess: () => onDeleted(course) });
    }
  };

  let buttonState = canDelete ? 'default' : 'disabled';
  if (deleteMutation.isPending) {
    buttonState = 'pending';
  }

  return (
    <AlertModal
      title={intl.formatMessage(messages.title)}
      isOpen
      onClose={onClose}
      footerNode={
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancel)}</Button>
          <StatefulButton
            variant="danger"
            state={buttonState}
            labels={{
              default: intl.formatMessage(messages.delete),
              pending: intl.formatMessage(messages.deleting),
            }}
            disabledStates={['disabled', 'pending']}
            onClick={handleDelete}
          />
        </ActionRow>
      }
    >
      <div className="robbo-delete-course">
        <p>{intl.formatMessage(messages.description, { name })}</p>
        <p>
          {intl.formatMessage(messages.exportHint, {
            exportLink: (
              <Link key="export" to={`/course/${course.courseKey}/export`}>
                {intl.formatMessage(messages.exportLink)}
              </Link>
            ),
          })}
        </p>
        {summary.isSuccess && (summary.data.enrollmentCount > 0 ?
          (
            <Alert variant="warning">
              {intl.formatMessage(messages.enrollments, { count: summary.data.enrollmentCount })}
            </Alert>
          ) :
          <p>{intl.formatMessage(messages.noEnrollments)}</p>)}
        {summary.isError && <Alert variant="warning">{intl.formatMessage(messages.summaryError)}</Alert>}
        <Form.Group controlId="robbo-delete-course-confirmation" className="mb-0">
          <Form.Label>
            {intl.formatMessage(messages.confirmLabel, {
              courseKey: <code key="key" className="robbo-delete-course__key">{course.courseKey}</code>,
            })}
          </Form.Label>
          <Form.Control
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
            autoComplete="off"
            spellCheck={false}
          />
        </Form.Group>
        {deleteMutation.isError && (
          <Alert variant="danger" className="mt-3 mb-0">{intl.formatMessage(messages.deleteError)}</Alert>
        )}
      </div>
    </AlertModal>
  );
};

export default DeleteCourseModal;
