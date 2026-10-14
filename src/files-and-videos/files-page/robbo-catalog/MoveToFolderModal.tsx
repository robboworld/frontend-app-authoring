/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * "Move to folder" for one or several files: an existing folder, no folder, or a new one.
 */
import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { normalizeFolderName } from './catalog';
import messages from './messages';

const NEW_FOLDER = '__robbo_new_folder__';

interface MoveToFolderModalProps {
  isOpen: boolean;
  count: number;
  folders: string[];
  /** Folder all the files are in now (preselected), `''` for none, `null` if they differ. */
  currentFolder: string | null;
  onClose: () => void;
  onSubmit: (folder: string) => void;
}

const MoveToFolderModal = ({
  isOpen,
  count,
  folders,
  currentFolder,
  onClose,
  onSubmit,
}: MoveToFolderModalProps) => {
  const intl = useIntl();
  const [choice, setChoice] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChoice(currentFolder ?? (folders[0] || NEW_FOLDER));
      setNewName('');
      setTouched(false);
    }
  }, [isOpen]);

  const normalizedNew = normalizeFolderName(newName);
  const newNameError = choice === NEW_FOLDER && !normalizedNew ? intl.formatMessage(messages.folderNameEmpty) : '';

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setTouched(true);
    if (newNameError) {
      return;
    }
    onSubmit(choice === NEW_FOLDER ? normalizedNew : choice);
  };

  const title = intl.formatMessage(messages.moveTitle, { count });
  return (
    <ModalDialog title={title} isOpen={isOpen} onClose={onClose} hasCloseButton isOverflowVisible={false}>
      <ModalDialog.Header>
        <ModalDialog.Title>{title}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form onSubmit={submit}>
          <Form.RadioSet name="robbo-move-folder" value={choice} onChange={(event) => setChoice(event.target.value)}>
            {folders.map(folder => (
              <Form.Radio key={folder} value={folder}>{folder}</Form.Radio>
            ))}
            <Form.Radio value="">{intl.formatMessage(messages.nodeNoFolder)}</Form.Radio>
            <Form.Radio value={NEW_FOLDER}>{intl.formatMessage(messages.moveNewFolder)}</Form.Radio>
          </Form.RadioSet>
          {choice === NEW_FOLDER && (
            <Form.Group isInvalid={touched && !!newNameError} className="mt-2 mb-0">
              <Form.Control
                autoFocus
                value={newName}
                maxLength={80}
                aria-label={intl.formatMessage(messages.folderNameLabel)}
                floatingLabel={intl.formatMessage(messages.folderNameLabel)}
                onChange={(event) => setNewName(event.target.value)}
              />
              {touched && newNameError && <Form.Control.Feedback type="invalid">{newNameError}</Form.Control.Feedback>}
            </Form.Group>
          )}
        </Form>
        <p className="small text-gray-700 mt-3 mb-0">{intl.formatMessage(messages.moveHint)}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            {intl.formatMessage(messages.cancel)}
          </ModalDialog.CloseButton>
          <Button onClick={() => submit()}>{intl.formatMessage(messages.moveConfirm)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default MoveToFolderModal;
