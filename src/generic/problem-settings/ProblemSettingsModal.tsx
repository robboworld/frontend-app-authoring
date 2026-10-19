/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * «Настройки задач»: the settings of the problem editor (shuffle of choices, attempts, show answer, reset
 * button, time between attempts) applied to every problem of a unit, subsection, section or course.
 * Each setting starts on «Не менять», so only what the author picks is written.
 */
import { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Alert,
  Form,
  ModalDialog,
  Stack,
} from '@openedx/paragon';
import { useMutation, useQuery } from '@tanstack/react-query';

import editorMessages from '@src/editors/containers/ProblemEditor/components/EditProblemView/SettingsWidget/messages';
import { ShowAnswerTypes, ShowAnswerTypesKeys } from '@src/editors/data/constants/problem';
import LoadingButton from '@src/generic/loading-button';
import Loading from '@src/generic/Loading';
import { useToastContext } from '@src/generic/toast-context';
import {
  applyProblemSettings,
  getProblemSettingsSummary,
  ProblemSettingsValues,
} from './api';
import messages from './messages';

export type ProblemSettingsCategory = 'course' | 'chapter' | 'sequential' | 'vertical';

interface Props {
  blockId: string;
  name: string;
  category: ProblemSettingsCategory;
  isOpen: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

const KEEP = '';

const shuffleOptions = [
  ['off', editorMessages.shuffleSettingsOff],
  ['per_student', editorMessages.shuffleSettingsPerStudent],
  ['every_attempt', editorMessages.shuffleSettingsEveryAttempt],
] as const;

/** A whole number not below `minimum`, or undefined. */
const toNumber = (value: string, minimum: number) => {
  const number = Number(value);
  return value.trim() !== '' && Number.isInteger(number) && number >= minimum ? number : undefined;
};

export const ProblemSettingsModal = ({
  blockId,
  name,
  category,
  isOpen,
  onClose,
  onApplied,
}: Props) => {
  const intl = useIntl();
  const { showToast } = useToastContext();
  const title = name ? intl.formatMessage(messages.modalTitle, { name }) : intl.formatMessage(messages.sectionTitle);
  const [shuffle, setShuffle] = useState(KEEP);
  const [attemptsMode, setAttemptsMode] = useState(KEEP);
  const [attempts, setAttempts] = useState('');
  const [showAnswer, setShowAnswer] = useState(KEEP);
  const [showAnswerAttempts, setShowAnswerAttempts] = useState('');
  const [reset, setReset] = useState(KEEP);
  const [timerMode, setTimerMode] = useState(KEEP);
  const [timer, setTimer] = useState('');

  const summary = useQuery({
    queryKey: ['robboProblemSettingsSummary', blockId],
    queryFn: () => getProblemSettingsSummary(blockId),
    enabled: isOpen,
    staleTime: 0,
  });
  const apply = useMutation({ mutationFn: (values: ProblemSettingsValues) => applyProblemSettings(blockId, values) });

  // The settings to send, or null while a chosen number is missing or wrong.
  const buildValues = (): ProblemSettingsValues | null => {
    const values: ProblemSettingsValues = {};
    if (shuffle !== KEEP) {
      values.shuffle = shuffle as ProblemSettingsValues['shuffle'];
    }
    if (attemptsMode === 'unlimited') {
      values.max_attempts = 'unlimited';
    } else if (attemptsMode === 'number') {
      const number = toNumber(attempts, 1);
      if (number === undefined) { return null; }
      values.max_attempts = number;
    }
    if (showAnswer !== KEEP) {
      values.showanswer = showAnswer;
      if (showAnswer === ShowAnswerTypesKeys.AFTER_SOME_NUMBER_OF_ATTEMPTS) {
        const number = toNumber(showAnswerAttempts, 1);
        if (number === undefined) { return null; }
        values.attempts_before_showanswer_button = number;
      }
    }
    if (reset !== KEEP) {
      values.show_reset_button = reset === 'show';
    }
    if (timerMode === 'set') {
      const number = toNumber(timer, 0);
      if (number === undefined) { return null; }
      values.submission_wait_seconds = number;
    }
    return values;
  };
  const values = buildValues();
  const canApply = !!values && Object.keys(values).length > 0 && !!summary.data?.problems;

  const onApply = async () => {
    if (!values) { return; }
    try {
      const { changed } = await apply.mutateAsync(values);
      showToast(intl.formatMessage(messages.applied, { changed }));
      onApplied?.();
      onClose();
    } catch {
      showToast(intl.formatMessage(messages.applyError));
    }
  };

  const keepOption = <option value={KEEP}>{intl.formatMessage(messages.keep)}</option>;
  const numberField = (value: string, onChange: (value: string) => void, minimum: number, label: string) => (
    <Form.Control
      className="mt-2"
      type="number"
      min={minimum}
      step={1}
      value={value}
      floatingLabel={label}
      onChange={(event) => onChange(event.target.value)}
      isInvalid={value !== '' && toNumber(value, minimum) === undefined}
    />
  );

  return (
    <ModalDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>{title}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {summary.isPending && <Loading />}
        {summary.isError && <Alert variant="danger">{intl.formatMessage(messages.loadError)}</Alert>}
        {summary.data && (
          <Stack gap={3}>
            <p className="small mb-0">
              {intl.formatMessage(messages.modalIntro, { category, problems: summary.data.problems })}
            </p>
            <Form.Group className="mb-0">
              <Form.Label>{intl.formatMessage(editorMessages.shuffleSettingsTitle)}</Form.Label>
              <Form.Control as="select" value={shuffle} onChange={(event) => setShuffle(event.target.value)}>
                {keepOption}
                {shuffleOptions.map(([value, message]) => (
                  <option key={value} value={value}>{intl.formatMessage(message)}</option>
                ))}
              </Form.Control>
              <Form.Text>
                {intl.formatMessage(messages.shuffleHint, { count: summary.data.choiceProblems })}
                {summary.data.skippedChoiceProblems > 0 && (
                  <> {intl.formatMessage(messages.shuffleSkipped, { count: summary.data.skippedChoiceProblems })}</>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>{intl.formatMessage(editorMessages.scoringAttemptsInputLabel)}</Form.Label>
              <Form.Control as="select" value={attemptsMode} onChange={(event) => setAttemptsMode(event.target.value)}>
                {keepOption}
                <option value="unlimited">{intl.formatMessage(messages.attemptsUnlimited)}</option>
                <option value="number">{intl.formatMessage(messages.attemptsNumber)}</option>
              </Form.Control>
              {attemptsMode === 'number'
                && numberField(attempts, setAttempts, 1, intl.formatMessage(messages.numberLabel))}
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>{intl.formatMessage(editorMessages.showAnswerSettingsTitle)}</Form.Label>
              <Form.Control as="select" value={showAnswer} onChange={(event) => setShowAnswer(event.target.value)}>
                {keepOption}
                {Object.values(ShowAnswerTypesKeys).map((value) => (
                  <option key={value} value={value}>{intl.formatMessage(ShowAnswerTypes[value])}</option>
                ))}
              </Form.Control>
              {showAnswer === ShowAnswerTypesKeys.AFTER_SOME_NUMBER_OF_ATTEMPTS && numberField(
                showAnswerAttempts,
                setShowAnswerAttempts,
                1,
                intl.formatMessage(editorMessages.showAnswerAttemptsInputLabel),
              )}
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>{intl.formatMessage(editorMessages.resetSettingsTitle)}</Form.Label>
              <Form.Control as="select" value={reset} onChange={(event) => setReset(event.target.value)}>
                {keepOption}
                <option value="show">{intl.formatMessage(messages.resetShow)}</option>
                <option value="hide">{intl.formatMessage(messages.resetHide)}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>{intl.formatMessage(editorMessages.timerSettingsTitle)}</Form.Label>
              <Form.Control as="select" value={timerMode} onChange={(event) => setTimerMode(event.target.value)}>
                {keepOption}
                <option value="set">{intl.formatMessage(messages.timerSet)}</option>
              </Form.Control>
              {timerMode === 'set'
                && numberField(timer, setTimer, 0, intl.formatMessage(editorMessages.timerSettingsTitle))}
            </Form.Group>
            <p className="small text-gray-700 mb-0">{intl.formatMessage(messages.modalPublishNote)}</p>
          </Stack>
        )}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary">
            {intl.formatMessage(messages.cancel)}
          </ModalDialog.CloseButton>
          <LoadingButton
            label={intl.formatMessage(messages.apply)}
            onClick={onApply}
            disabled={!canApply}
          />
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ProblemSettingsModal;
