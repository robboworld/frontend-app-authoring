// Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Alert,
} from '@openedx/paragon';
import { describeError, isHttpError, RobboErrorDetails } from '../../robbo-errors';
import messages from './messages';

export interface AlertErrorProps {
  error: unknown;
  title?: string;
  onDismiss?: () => void;
}

/* eslint-disable react/prop-types */
const AlertError: React.FC<AlertErrorProps> = ({ error, title, onDismiss }) => {
  const intl = useIntl();
  // Robbo: a failed request shows the human text with the code and number (src/robbo-errors), not
  // error.message and the server's raw JSON. Texts and Errors made by the app itself stay as they are.
  const info = isHttpError(error) ? describeError(error) : null;

  return (
    <Alert
      variant="danger"
      className="mt-3"
      dismissible={!!onDismiss}
      closeLabel={intl.formatMessage(messages.dismissLabel)}
      onClose={onDismiss}
    >
      {(title || info) && <Alert.Heading>{title || info?.title}</Alert.Heading>}
      {info ?
        (
          <>
            <p>{info.message}</p>
            <RobboErrorDetails info={info} />
          </>
        ) :
        (
          error instanceof Object && 'message' in error ? String(error.message) : String(error)
        )}
    </Alert>
  );
};

export default AlertError;
