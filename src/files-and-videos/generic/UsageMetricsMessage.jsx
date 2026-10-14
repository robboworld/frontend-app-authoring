/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 */
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Hyperlink,
  Icon,
  Row,
  Spinner,
} from '@openedx/paragon';
import { ErrorOutline } from '@openedx/paragon/icons';
import isEmpty from 'lodash/isEmpty';
import { RequestStatus } from '../../data/constants';
import { formatUsageLocation, usageKey, usageLink } from '../files-page/robbo-catalog/usageText';
import messages from './messages';

const UsageMetricsMessage = ({
  usagePathStatus,
  usageLocations,
  error,
}) => {
  const intl = useIntl();
  const { courseId } = useParams();
  let usageMessage;
  if (usagePathStatus === RequestStatus.SUCCESSFUL) {
    usageMessage = isEmpty(usageLocations) ?
      <FormattedMessage {...messages.usageNotInUseMessage} /> :
      (
        <ul className="p-0">
          {/* Robbo: Russian place names and links for course design, certificates, pages, blocks */}
          {usageLocations.map((location, index) => (
            <li key={usageKey(location, index)} style={{ listStyle: 'none' }}>
              <Hyperlink destination={usageLink(courseId, location)} target="_blank">
                {formatUsageLocation(intl, location)}
              </Hyperlink>
            </li>
          ))}
        </ul>
      );
  } else if (usagePathStatus === RequestStatus.FAILED) {
    usageMessage = (
      <Row className="m-0 pt-1">
        <Icon
          className="mr-1 text-danger-500"
          size="sm"
          src={ErrorOutline}
        />
        {intl.formatMessage(messages.errorAlertMessage, { message: error })}
      </Row>
    );
  } else {
    usageMessage = (
      <>
        <Spinner
          animation="border"
          size="sm"
          className="mie-3"
          screenReaderText={intl.formatMessage(messages.usageLoadingMessage)}
        />
        <FormattedMessage {...messages.usageLoadingMessage} />
      </>
    );
  }
  return usageMessage;
};

UsageMetricsMessage.propTypes = {
  usagePathStatus: PropTypes.string.isRequired,
  usageLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UsageMetricsMessage;
