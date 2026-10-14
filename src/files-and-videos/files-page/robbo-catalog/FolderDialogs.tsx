/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Dialogs for author folders: name a new folder or rename one, confirm deleting one.
 */
import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, AlertModal, Button, Form, ModalDialog } from '@openedx/paragon';
import { normalizeFolderName } from './catalog';
import messages from './messages';

interface FolderNameDialogProps {
  isOpen: boolean;
  /** Current name when renaming; empty for a new folder. */
  initialName?: string;
  existingNames: string[];
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const FolderNameDialog = ({
  isOpen,
  initialName = '',
  existingNames,
  onClose,
  onSubmit,
}: FolderNameDialogProps) => {
  const intl = useIntl();
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setTouched(false);
    }
  }, [isOpen, initialName]);

  const normalized = normalizeFolderName(name);
  const isRename = !!initialName;
  let error = '';
  if (!normalized) {
    error = intl.formatMessage(messages.folderNameEmpty);
  } else if (normalized !== initialName && existingNames.includes(normalized)) {
    error = intl.formatMessage(messages.folderNameExists);
  }

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setTouched(true);
    if (error) {
      return;
    }
    if (normalized === initialName) {
      onClose();
      return;
    }
    onSubmit(normalized);
  };

  return (
    <ModalDialog
      title={intl.formatMessage(isRename ? messages.renameFolderTitle : messages.newFolderTitle)}
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(isRename ? messages.renameFolderTitle : messages.newFolderTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form onSubmit={submit}>
          <Form.Group isInvalid={touched && !!error} className="mb-0">
            <Form.Label>{intl.formatMessage(messages.folderNameLabel)}</Form.Label>
            <Form.Control
              autoFocus
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => setTouched(true)}
            />
            {touched && error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
          </Form.Group>
        </Form>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            {intl.formatMessage(messages.cancel)}
          </ModalDialog.CloseButton>
          <Button onClick={() => submit()}>
            {intl.formatMessage(isRename ? messages.folderSave : messages.folderCreate)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

interface DeleteFolderDialogProps {
  name: string | null;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const DeleteFolderDialog = ({ name, onClose, onConfirm }: DeleteFolderDialogProps) => {
  const intl = useIntl();
  return (
    <AlertModal
      title={intl.formatMessage(messages.deleteFolderTitle, { name })}
      isOpen={name !== null}
      onClose={onClose}
      footerNode={
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="danger" onClick={() => name !== null && onConfirm(name)}>
            {intl.formatMessage(messages.deleteFolderConfirm)}
          </Button>
        </ActionRow>
      }
    >
      {intl.formatMessage(messages.deleteFolderBody)}
    </AlertModal>
  );
};
