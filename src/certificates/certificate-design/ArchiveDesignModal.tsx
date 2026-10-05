/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (certificate designs). See NOTICE at repository root.
 *
 * Confirmation for deleting a design uploaded in Studio (platform staff).
 */
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Alert, AlertModal, Button, StatefulButton,
} from '@openedx/paragon';

import { useCourseAuthoringContext } from '@src/CourseAuthoringContext';
import { getApiErrorMessage, useArchiveUploadedDesign } from './api';
import messages from './messages';

interface ArchiveDesignModalProps {
  design: { id: string; title: string } | null;
  onClose: () => void;
  onArchived?: () => void;
}

const ArchiveDesignModal = ({ design, onClose, onArchived }: ArchiveDesignModalProps) => {
  const intl = useIntl();
  const { courseId } = useCourseAuthoringContext();
  const archiveMutation = useArchiveUploadedDesign(courseId);

  const handleArchive = () => {
    if (!design) { return; }
    archiveMutation.mutate(design.id, {
      onSuccess: () => {
        onClose();
        onArchived?.();
      },
    });
  };

  return (
    <AlertModal
      title={intl.formatMessage(messages.editorArchiveTitle, { title: design?.title ?? '' })}
      isOpen={!!design}
      onClose={onClose}
      footerNode={(
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.editorCancel)}</Button>
          <StatefulButton
            variant="danger"
            state={archiveMutation.isPending ? 'pending' : 'default'}
            labels={{
              default: intl.formatMessage(messages.editorArchive),
              pending: intl.formatMessage(messages.editorArchiving),
            }}
            disabledStates={['pending']}
            onClick={handleArchive}
          />
        </ActionRow>
      )}
    >
      {archiveMutation.isError && (
        <Alert variant="danger">
          {getApiErrorMessage(archiveMutation.error) || intl.formatMessage(messages.archiveError)}
        </Alert>
      )}
      <p>{intl.formatMessage(messages.editorArchiveBody)}</p>
    </AlertModal>
  );
};

export default ArchiveDesignModal;
