/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * «Перемешивать варианты ответа» for single and multiple choice problems: saved as
 * shuffle="true" on the choice group (ReactStateOLXParser) plus the problem randomization,
 * which decides when the order is drawn: once per learner ("per_student") or on every
 * attempt ("always": the learner presses «Сбросить» to answer again and gets a new order).
 */
import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import PropTypes from 'prop-types';
import SettingsOption from '../SettingsOption';
import messages from '../messages';
import { RandomizationTypesKeys } from '../../../../../../data/constants/problem';

export const ShuffleModes = {
  OFF: 'off',
  PER_STUDENT: 'per_student',
  EVERY_ATTEMPT: 'every_attempt',
};

const modeMessages = {
  [ShuffleModes.OFF]: messages.shuffleSettingsOff,
  [ShuffleModes.PER_STUDENT]: messages.shuffleSettingsPerStudent,
  [ShuffleModes.EVERY_ATTEMPT]: messages.shuffleSettingsEveryAttempt,
};

const modeSettings = {
  [ShuffleModes.OFF]: { shuffle: false, randomization: null },
  [ShuffleModes.PER_STUDENT]: { shuffle: true, randomization: RandomizationTypesKeys.PERSTUDENT },
  [ShuffleModes.EVERY_ATTEMPT]: { shuffle: true, randomization: RandomizationTypesKeys.ALWAYS },
};

export const getShuffleMode = ({ shuffle, randomization, defaultRandomization }) => {
  if (!shuffle) {
    return ShuffleModes.OFF;
  }
  const effective = randomization || defaultRandomization;
  return [RandomizationTypesKeys.ALWAYS, RandomizationTypesKeys.ONRESET].includes(effective)
    ? ShuffleModes.EVERY_ATTEMPT
    : ShuffleModes.PER_STUDENT;
};

const ShuffleCard = ({
  shuffle,
  randomization,
  defaultRandomization,
  updateSettings,
}) => {
  const intl = useIntl();
  const mode = getShuffleMode({ shuffle, randomization, defaultRandomization });
  return (
    <SettingsOption
      title={intl.formatMessage(messages.shuffleSettingsTitle)}
      summary={intl.formatMessage(modeMessages[mode])}
      className="shuffleCard"
    >
      <div className="halfSpacedMessage">
        <span>{intl.formatMessage(messages.shuffleSettingText)}</span>
      </div>
      <Form.RadioSet
        name="robbo-shuffle-mode"
        value={mode}
        onChange={(event) => updateSettings(modeSettings[event.target.value])}
        className="mb-2"
      >
        {Object.values(ShuffleModes).map((value) => (
          <Form.Radio key={value} value={value}>
            {intl.formatMessage(modeMessages[value])}
          </Form.Radio>
        ))}
      </Form.RadioSet>
    </SettingsOption>
  );
};

ShuffleCard.propTypes = {
  shuffle: PropTypes.bool.isRequired,
  randomization: PropTypes.string,
  defaultRandomization: PropTypes.string,
  updateSettings: PropTypes.func.isRequired,
};

ShuffleCard.defaultProps = {
  randomization: null,
  defaultRandomization: null,
};

export default ShuffleCard;
