import userEvent from '@testing-library/user-event';
import { getConfig, setConfig } from '@edx/frontend-platform';
import { render, initializeMocks, screen } from '@src/testUtils';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { COURSE_BLOCK_NAMES } from '../../constants';
import HeaderNavigations from './HeaderNavigations';
import messages from './messages';

const handleViewLiveFn = jest.fn();
const handlePreviewFn = jest.fn();
const handleEditFn = jest.fn();
const mockSetCurrentPageKey = jest.fn();

const headerNavigationsActions = {
  handleViewLive: handleViewLiveFn,
  handlePreview: handlePreviewFn,
  handleEdit: handleEditFn,
};

const renderComponent = (props) =>
  render(
    <IntlProvider locale="en">
      <HeaderNavigations
        category={COURSE_BLOCK_NAMES.vertical.id}
        headerNavigationsActions={headerNavigationsActions}
        {...props}
      />
    </IntlProvider>,
  );

jest.mock('../unit-sidebar/UnitSidebarContext', () => ({
  useUnitSidebarContext: () => ({
    readOnly: false,
    setCurrentPageKey: mockSetCurrentPageKey,
  }),
}));

describe('<HeaderNavigations />', () => {
  beforeEach(() => {
    initializeMocks();
  });

  it('render HeaderNavigations component correctly', () => {
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id });

    expect(screen.getByRole('button', { name: messages.viewLiveButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.previewButton.defaultMessage })).toBeInTheDocument();
  });

  it('calls the correct handlers when clicking buttons for unit page', async () => {
    const user = userEvent.setup();
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id });

    const viewLiveButton = screen.getByRole('button', { name: messages.viewLiveButton.defaultMessage });
    await user.click(viewLiveButton);
    expect(handleViewLiveFn).toHaveBeenCalledTimes(1);

    const previewButton = screen.getByRole('button', { name: messages.previewButton.defaultMessage });
    await user.click(previewButton);
    expect(handlePreviewFn).toHaveBeenCalledTimes(1);

    const editButton = screen.queryByRole('button', { name: messages.editButton.defaultMessage });
    expect(editButton).not.toBeInTheDocument();
  });

  ['libraryContent', 'splitTest'].forEach((category) => {
    it(`calls the correct handlers when clicking buttons for ${category} page`, async () => {
      const user = userEvent.setup();
      renderComponent({ category: COURSE_BLOCK_NAMES[category].id });

      const editButton = await screen.findByRole('button', { name: messages.editButton.defaultMessage });
      await user.click(editButton);
      expect(handleEditFn).toHaveBeenCalledTimes(1);

      [messages.viewLiveButton.defaultMessage, messages.previewButton.defaultMessage].forEach((btnName) => {
        expect(screen.queryByRole('button', { name: btnName })).not.toBeInTheDocument();
      });
    });
  });

  it('should enable the "View Live" button when isPublished is true', () => {
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id, isPublished: true });

    // Robbo: aria-disabled instead of disabled, so the button keeps its tooltip
    expect(screen.getByRole('button', { name: messages.viewLiveButton.defaultMessage }))
      .toHaveAttribute('aria-disabled', 'false');
  });

  it('should disable the "View Live" button when isPublished is false', async () => {
    const user = userEvent.setup();
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id, isPublished: false });

    const viewLiveButton = screen.getByRole('button', { name: messages.viewLiveButton.defaultMessage });
    expect(viewLiveButton).toHaveAttribute('aria-disabled', 'true');
    await user.click(viewLiveButton);
    expect(handleViewLiveFn).not.toHaveBeenCalled();
  });

  it('explains the preview and view live buttons in tooltips', async () => {
    const user = userEvent.setup();
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id, isPublished: false });

    await user.hover(screen.getByRole('button', { name: messages.previewButton.defaultMessage }));
    expect(await screen.findByText(messages.previewTooltip.defaultMessage)).toBeInTheDocument();
    await user.hover(screen.getByRole('button', { name: messages.viewLiveButton.defaultMessage }));
    expect(await screen.findByText(messages.viewLiveUnpublishedTooltip.defaultMessage)).toBeInTheDocument();
  });

  it('click Info button should open info sidebar', async () => {
    setConfig({
      ...getConfig(),
      ENABLE_UNIT_PAGE_NEW_DESIGN: 'true',
    });

    const user = userEvent.setup();
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id });

    const infoButton = screen.getByRole('button', { name: /unit info/i });
    expect(infoButton).toBeInTheDocument();
    await user.click(infoButton);

    expect(mockSetCurrentPageKey).toHaveBeenCalledWith('info', null);
  });

  it('click Add button should open add sidebar', async () => {
    const user = userEvent.setup();
    renderComponent({ unitCategory: COURSE_BLOCK_NAMES.vertical.id });

    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeInTheDocument();
    await user.click(addButton);

    expect(mockSetCurrentPageKey).toHaveBeenCalledWith('add', null);
  });
});
