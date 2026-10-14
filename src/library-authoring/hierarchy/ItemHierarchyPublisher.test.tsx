import userEvent from '@testing-library/user-event';
import type MockAdapter from 'axios-mock-adapter';

import { initializeMocks, render, screen } from '@src/testUtils';
import { getLibraryBlockHierarchyUrl, getLibraryContainerHierarchyApiUrl } from '../data/api';
import { ItemHierarchyPublisher } from './ItemHierarchyPublisher';

const componentId = 'lb:Axim:TEST:html:block-1';
const unitId = 'lct:Axim:TEST:unit:unit-1';

let axiosMock: MockAdapter;

// robbo: older openedx-platform has no hierarchy API; publishing must still be possible
describe('<ItemHierarchyPublisher /> without hierarchy API', () => {
  beforeEach(() => {
    ({ axiosMock } = initializeMocks());
  });

  it.each([
    { itemId: componentId, url: getLibraryBlockHierarchyUrl(componentId), warning: /This component will be/ },
    { itemId: unitId, url: getLibraryContainerHierarchyApiUrl(unitId), warning: /This unit will be/ },
  ])('shows confirm dialog and publishes when hierarchy of $itemId returns 404', async ({ itemId, url, warning }) => {
    axiosMock.onGet(url).reply(404);
    const handlePublish = jest.fn();
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(<ItemHierarchyPublisher itemId={itemId} handleClose={handleClose} handlePublish={handlePublish} />);

    expect(await screen.findByText('Confirm Publish')).toBeInTheDocument();
    expect(screen.getByText(warning)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Publish' }));
    expect(handlePublish).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
