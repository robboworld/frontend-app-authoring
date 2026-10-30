/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course type: paid access and paid certificate).
 * See NOTICE at repository root.
 */
import userEvent from '@testing-library/user-event';

import { CourseAuthoringProvider } from '@src/CourseAuthoringContext';
import {
  initializeMocks,
  render,
  screen,
  waitFor,
} from '@src/testUtils';

import { getCourseTypeApiUrl } from './api';
import { CourseTypePage } from '.';
import messages from './messages';

const courseId = 'course-v1:org+101+101';
let axiosMock;

const apiData = (overrides = {}) => ({
  can_edit: true,
  paid_certificates_switch: true,
  passing_percent: 50,
  certificate: {
    paid: false,
    price: null,
    min_percent: null,
    free_for_verified: true,
    free_for_cohorts: [],
  },
  full_access: { paid: false, price: null, learners: 0 },
  cohorts: [{ id: 7, name: 'B2B' }],
  paid_content: {
    enabled: false,
    free_sections: null,
    graded_paid: false,
    display: 'locked',
    grading: 'zero',
    sections: 12,
    locked: 3,
  },
  ...overrides,
});

const renderPage = () =>
  render(
    <CourseAuthoringProvider courseId={courseId}>
      <CourseTypePage />
    </CourseAuthoringProvider>,
  );

describe('<CourseTypePage />', () => {
  beforeEach(() => {
    axiosMock = initializeMocks().axiosMock;
  });

  it('shows the course team a read-only free course', async () => {
    axiosMock.onGet(getCourseTypeApiUrl(courseId)).reply(200, apiData({ can_edit: false }));
    renderPage();

    expect(await screen.findByText(messages.readOnly.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId('robbo-course-type-current')).toHaveTextContent(messages.typeFree.defaultMessage);
    expect(screen.getByRole('switch', { name: messages.certificatePaid.defaultMessage })).toBeDisabled();
    expect(screen.queryByRole('button', { name: messages.save.defaultMessage })).not.toBeInTheDocument();
  });

  it('lets staff make the certificate paid', async () => {
    const user = userEvent.setup();
    axiosMock.onGet(getCourseTypeApiUrl(courseId)).reply(200, apiData());
    axiosMock.onPut(getCourseTypeApiUrl(courseId)).reply(
      200,
      apiData({
        certificate: {
          paid: true,
          price: 990,
          min_percent: 80,
          free_for_verified: true,
          free_for_cohorts: [7],
        },
      }),
    );
    renderPage();

    await user.click(await screen.findByRole('switch', { name: messages.certificatePaid.defaultMessage }));
    await user.type(screen.getByLabelText(messages.price.defaultMessage), '990');
    await user.type(screen.getByLabelText(messages.minPercent.defaultMessage), '80');
    await user.click(screen.getByRole('checkbox', { name: 'B2B' }));
    expect(screen.getByTestId('robbo-course-type-current')).toHaveTextContent(messages.typeCertificate.defaultMessage);
    await user.click(screen.getByRole('button', { name: messages.save.defaultMessage }));

    expect(await screen.findByText(messages.saved.defaultMessage)).toBeInTheDocument();
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
      full_access: { paid: false },
      paid_content: { enabled: false },
      certificate: {
        paid: true,
        price: '990',
        min_percent: '80',
        free_for_verified: true,
        free_for_cohorts: [7],
      },
    });
  });

  it('shows the server message when saving fails', async () => {
    const user = userEvent.setup();
    axiosMock.onGet(getCourseTypeApiUrl(courseId)).reply(200, apiData());
    axiosMock.onPut(getCourseTypeApiUrl(courseId)).reply(400, { error: 'Цена — целое число рублей.' });
    renderPage();

    await user.click(await screen.findByRole('switch', { name: messages.fullAccessPaid.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.save.defaultMessage }));

    await waitFor(() => expect(screen.getByText('Цена — целое число рублей.')).toBeInTheDocument());
  });

  it('warns staff that certificate sales are off on the site', async () => {
    axiosMock.onGet(getCourseTypeApiUrl(courseId)).reply(
      200,
      apiData({
        paid_certificates_switch: false,
        certificate: {
          paid: true,
          price: 990,
          min_percent: null,
          free_for_verified: true,
          free_for_cohorts: [],
        },
      }),
    );
    renderPage();

    expect(await screen.findByText(messages.switchOff.defaultMessage)).toBeInTheDocument();
  });

  it('lets staff turn on paid content and warns when full access is not sold', async () => {
    const user = userEvent.setup();
    axiosMock.onGet(getCourseTypeApiUrl(courseId)).reply(200, apiData());
    axiosMock.onPut(getCourseTypeApiUrl(courseId)).reply(200, apiData());
    renderPage();

    await user.click(await screen.findByRole('switch', { name: messages.paidContentEnabled.defaultMessage }));
    expect(screen.getByText(messages.notSold.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText('Marked «Full access only» in the course outline: 3')).toBeInTheDocument();
    await user.type(screen.getByLabelText(messages.freeSections.defaultMessage), '2');
    await user.click(screen.getByRole('checkbox', { name: messages.gradedPaid.defaultMessage }));
    await user.click(screen.getByRole('radio', { name: messages.displayHidden.defaultMessage }));
    await user.click(screen.getByRole('radio', { name: messages.gradingExcluded.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.save.defaultMessage }));

    await screen.findByText(messages.saved.defaultMessage);
    expect(JSON.parse(axiosMock.history.put[0].data).paid_content).toEqual({
      enabled: true,
      free_sections: '2',
      graded_paid: true,
      display: 'hidden',
      grading: 'excluded',
    });
  });
});
