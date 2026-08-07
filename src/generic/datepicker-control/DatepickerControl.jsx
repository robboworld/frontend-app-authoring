import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Icon } from '@openedx/paragon';
import { AccessTime, Calendar } from '@openedx/paragon/icons';
import { getLocale, useIntl } from '@edx/frontend-platform/i18n';

import { convertToDateFromString, convertToStringFromDate, isValidDate } from '../../utils';
import { DATE_FORMAT, TIME_FORMAT } from '../../constants';
import { getDatePickerLocale } from './datepickerLocale';
import messages from './messages';

export const DATEPICKER_TYPES = {
  date: 'date',
  time: 'time',
};

/** Display format for the date input; storage remains ISO UTC via utils. */
const getDateDisplayFormat = () => (
  getLocale().startsWith('ru') ? 'dd.MM.yyyy' : DATE_FORMAT
);

const DatepickerControl = ({
  type,
  label,
  value,
  showUTC,
  readonly,
  helpText,
  isInvalid,
  controlName,
  onChange,
}) => {
  const intl = useIntl();
  const formattedDate = convertToDateFromString(value);
  const inputFormat = {
    [DATEPICKER_TYPES.date]: getDateDisplayFormat(),
    [DATEPICKER_TYPES.time]: TIME_FORMAT,
  };
  const isTimePicker = type === DATEPICKER_TYPES.time;

  let describedByIds;
  if (isTimePicker) {
    const ids = [`${controlName}-timehint`];
    if (helpText) {
      ids.push(`${controlName}-helptext`);
    }
    describedByIds = ids.filter(Boolean).join(' ') || undefined;
  } else if (helpText) {
    describedByIds = `${controlName}-helptext`;
  }

  return (
    <Form.Group controlId={controlName} className="form-group-custom datepicker-custom">
      <Form.Label className="d-flex justify-content-between">
        {label}
        {showUTC && (
          <span className="h6 font-weight-normal text-gray-500 mb-0">
            ({intl.formatMessage(messages.datepickerUTC)})
          </span>
        )}
      </Form.Label>
      <div className="position-relative">
        {type === DATEPICKER_TYPES.date && !readonly && (
          <Icon
            src={Calendar}
            className="datepicker-custom-control-icon"
            alt={intl.formatMessage(messages.calendarAltText)}
          />
        )}
        {type === DATEPICKER_TYPES.time && (
          <Icon
            src={AccessTime}
            className="datepicker-custom-control-icon"
            alt={intl.formatMessage(messages.timeAltText)}
          />
        )}
        <DatePicker
          id={controlName}
          name={controlName}
          selected={formattedDate}
          disabled={readonly}
          locale={getDatePickerLocale()}
          dateFormat={inputFormat[type]}
          timeFormat={inputFormat[type]}
          className={classNames('datepicker-custom-control', {
            'datepicker-custom-control_readonly': readonly,
            'datepicker-custom-control_isInvalid': isInvalid,
          })}
          autoComplete="off"
          selectsStart
          showTimeSelect={type === DATEPICKER_TYPES.time}
          showTimeSelectOnly={type === DATEPICKER_TYPES.time}
          placeholderText={
            isTimePicker
              ? intl.formatMessage(messages.timePlaceholder)
              : intl.formatMessage(messages.datePlaceholder)
          }
          showPopperArrow={false}
          aria-describedby={describedByIds}
          onChange={(date) => {
            if (isValidDate(date)) {
              onChange(convertToStringFromDate(date));
            }
          }}
        />
      </div>
      {isTimePicker && (
        <Form.Text id={`${controlName}-timehint`} className="sr-only">
          {intl.formatMessage(messages.timepickerScreenreaderHint, {
            timeFormat: inputFormat[type].toLocaleUpperCase(),
          })}
        </Form.Text>
      )}
      {helpText && (
        <Form.Control.Feedback id={`${controlName}-helptext`}>
          {helpText}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

DatepickerControl.defaultProps = {
  helpText: '',
  showUTC: false,
  value: '',
  readonly: false,
  isInvalid: false,
};

DatepickerControl.propTypes = {
  type: PropTypes.oneOf(Object.values(DATEPICKER_TYPES)).isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  showUTC: PropTypes.bool,
  helpText: PropTypes.string,
  readonly: PropTypes.bool,
  isInvalid: PropTypes.bool,
  controlName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DatepickerControl;
