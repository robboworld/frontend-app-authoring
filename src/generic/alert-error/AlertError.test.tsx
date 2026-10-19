import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import AlertError from '.';

const RootWrapper = ({ error }: { error: unknown; }) => (
  <IntlProvider locale="en">
    <AlertError error={error} />
  </IntlProvider>
);

describe('<AlertMessage />', () => {
  test('render using a string', () => {
    const error = 'This is a string error message';
    const { getByText } = render(<RootWrapper error={error} />);
    expect(getByText('This is a string error message')).toBeInTheDocument();
  });

  test('render using an error', () => {
    const error = new Error('This is an error message');
    const { getByText } = render(<RootWrapper error={error} />);
    expect(getByText('This is an error message')).toBeInTheDocument();
  });

  // Robbo: a failed request shows the human text with the code and number (src/robbo-errors)
  // instead of error.message and the server's raw JSON.
  test('render using an error with response', () => {
    const error = {
      message: 'Axios Error (Response): 500 - See custom attributes for details.',
      response: {
        status: 500,
        headers: { 'x-request-id': '7f3a29c1-1d2e-4f00-8000-0123456789ab' },
        data: {
          message: 'This is a response body',
        },
      },
    };
    const { getByText, queryByText } = render(<RootWrapper error={error} />);
    expect(getByText('Не получилось выполнить действие')).toBeInTheDocument();
    expect(getByText('SRV-ERROR · 7F3A-29C1')).toBeInTheDocument();
    expect(queryByText(/this is a response body/i)).not.toBeInTheDocument();
    expect(queryByText(/axios error/i)).not.toBeInTheDocument();
  });
});
