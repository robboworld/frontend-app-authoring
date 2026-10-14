/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution (course files catalog). See NOTICE at repository root.
 *
 * Replaces the upstream "overwrite?" dialog: for every file whose name is taken it shows where
 * the existing file is used and lets the author save a copy (default) or replace it.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import type { DeprecatedReduxState } from '@src/store';
import { updateDuplicateFiles } from '../data/slice';
import { robboAddAssetFile, type UploadConflicts, type UploadOutcome } from './thunks';
import { formatUsageLocation } from './usageText';
import messages from './messages';

const USAGE_PREVIEW = 3;
type Choice = 'copy' | 'replace';

interface UploadConflictModalProps {
  courseId: string;
  /** Folder new copies go to (the author folder open in the catalog). */
  folder: string | null;
  onUploaded: (outcomes: UploadOutcome[]) => void;
}

const UploadConflictModal = ({ courseId, folder, onUploaded }: UploadConflictModalProps) => {
  const intl = useIntl();
  const dispatch = useDispatch<any>();
  const conflicts = useSelector((state: DeprecatedReduxState) => state.assets.duplicateFiles) as UploadConflicts;
  const names = useMemo(() => Object.keys(conflicts || {}), [conflicts]);
  const [choices, setChoices] = useState<Record<string, Choice>>({});

  useEffect(() => {
    setChoices(Object.fromEntries(names.map(name => [name, 'copy' as Choice])));
  }, [names]);

  const isOpen = names.length > 0;
  const close = () => dispatch(updateDuplicateFiles({ files: {} }));

  const upload = async () => {
    const pending = names.map(name => ({ ...conflicts[name], choice: choices[name] || 'copy' }));
    close();
    const outcomes = await Promise.all(pending.map(({ file, choice }) => dispatch(robboAddAssetFile(
      courseId,
      file,
      choice === 'replace' ? { onConflict: 'replace' } : { folder },
    ))));
    onUploaded(outcomes);
  };

  const setAll = (choice: Choice) => setChoices(Object.fromEntries(names.map(name => [name, choice])));
  const title = intl.formatMessage(messages.conflictTitle, { count: names.length });

  return (
    <ModalDialog title={title} isOpen={isOpen} onClose={close} hasCloseButton isOverflowVisible={false} size="md">
      <ModalDialog.Header>
        <ModalDialog.Title>{title}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p>{intl.formatMessage(messages.conflictIntro)}</p>
        {names.length > 1 && (
          <ActionRow className="robbo-files-conflict__all mb-3">
            <Button variant="link" size="sm" className="px-0" onClick={() => setAll('copy')}>
              {intl.formatMessage(messages.conflictAllCopy)}
            </Button>
            <Button variant="link" size="sm" onClick={() => setAll('replace')}>
              {intl.formatMessage(messages.conflictAllReplace)}
            </Button>
          </ActionRow>
        )}
        <ul className="robbo-files-conflict list-unstyled mb-0">
          {names.map(name => {
            const { check } = conflicts[name];
            const usage = check.existing?.usageLocations || [];
            return (
              <li key={name} className="robbo-files-conflict__item">
                <p className="robbo-files-conflict__name font-weight-bold mb-1">{name}</p>
                {check.existing?.robboFolder && (
                  <p className="small mb-1">
                    {intl.formatMessage(messages.conflictFolder, { folder: check.existing.robboFolder })}
                  </p>
                )}
                {usage.length ? (
                  <div className="small mb-2">
                    {intl.formatMessage(messages.conflictUsedIn)}
                    <ul className="mb-0 pl-3">
                      {usage.slice(0, USAGE_PREVIEW).map((location, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index}>{formatUsageLocation(intl, location)}</li>
                      ))}
                      {usage.length > USAGE_PREVIEW && (
                        <li>{intl.formatMessage(messages.conflictMore, { count: usage.length - USAGE_PREVIEW })}</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="small mb-2">{intl.formatMessage(messages.conflictNotUsed)}</p>
                )}
                <Form.RadioSet
                  name={`robbo-conflict-${name}`}
                  aria-label={intl.formatMessage(messages.conflictChoiceLabel, { name })}
                  value={choices[name] || 'copy'}
                  onChange={(event) => setChoices({ ...choices, [name]: event.target.value as Choice })}
                >
                  <Form.Radio value="copy">
                    {intl.formatMessage(messages.conflictCopy, { name: check.suggestedName || name })}
                  </Form.Radio>
                  <Form.Radio value="replace">{intl.formatMessage(messages.conflictReplace)}</Form.Radio>
                </Form.RadioSet>
              </li>
            );
          })}
        </ul>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            {intl.formatMessage(messages.cancel)}
          </ModalDialog.CloseButton>
          <Button onClick={upload}>{intl.formatMessage(messages.conflictUpload)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default UploadConflictModal;
