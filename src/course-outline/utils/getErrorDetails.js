import { API_ERROR_TYPES } from '../constants';
import { describeError, inlineText } from '../../robbo-errors';

export const getErrorDetails = (error, dismissible = true) => {
  const errorInfo = { dismissible };
  if (error.response?.status === 403) {
    // For 403 status the error shouldn't be dismissible
    errorInfo.dismissible = false;
    errorInfo.type = API_ERROR_TYPES.forbidden;
    errorInfo.status = error.response.status;
  } else if (error.response?.data) {
    // Robbo: the human text with the code and number (src/robbo-errors), not the server's raw JSON.
    errorInfo.data = inlineText(describeError(error));
    errorInfo.status = error.response.status;
    errorInfo.type = API_ERROR_TYPES.serverError;
  } else if (error.request) {
    errorInfo.type = API_ERROR_TYPES.networkError;
  } else {
    errorInfo.type = API_ERROR_TYPES.unknown;
    errorInfo.data = error.message;
  }
  return errorInfo;
};
