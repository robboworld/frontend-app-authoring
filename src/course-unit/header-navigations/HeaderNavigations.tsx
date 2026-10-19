/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: tooltips that tell «Предварительный просмотр» (the draft) from «Открыть на сайте» (what learners see).
 */
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Stack,
  Tooltip,
} from '@openedx/paragon';
import {
  Add,
  Edit as EditIcon,
  FindInPage,
  InfoOutline,
} from '@openedx/paragon/icons';
import { COURSE_BLOCK_NAMES } from '@src/constants';

import messages from './messages';
import { isUnitPageNewDesignEnabled } from '../utils';
import { useUnitSidebarContext } from '../unit-sidebar/UnitSidebarContext';

export type HeaderNavigationActions = {
  handleViewLive: () => void;
  handlePreview: () => void;
  handleEdit: () => void;
};

type HeaderNavigationsProps = {
  headerNavigationsActions: HeaderNavigationActions;
  category: string;
  isPublished?: boolean;
};

/**
 * Generic header navigations to be used in this pages:
 * - Unit page
 * - Legacy library content page
 * - Split test page
 */
const HeaderNavigations = ({
  headerNavigationsActions,
  category,
  isPublished = true,
}: HeaderNavigationsProps) => {
  const intl = useIntl();
  const {
    handleViewLive,
    handlePreview,
    handleEdit,
  } = headerNavigationsActions;

  const { setCurrentPageKey, readOnly } = useUnitSidebarContext();

  const showNewDesignButtons = isUnitPageNewDesignEnabled();

  return (
    <nav className="header-navigations ml-auto flex-shrink-0">
      {
        /**
         * Action buttons used in the unit page
         */
      }
      {category === COURSE_BLOCK_NAMES.vertical.id && (
        <Stack direction="horizontal" gap={3}>
          {showNewDesignButtons && (
            <>
              <Button
                variant="outline-primary"
                iconBefore={InfoOutline}
                onClick={() => setCurrentPageKey('info', null)}
              >
                {intl.formatMessage(messages.infoButton)}
              </Button>
              {!readOnly && (
                <Button
                  variant="outline-primary"
                  iconBefore={Add}
                  onClick={() => setCurrentPageKey('add', null)}
                >
                  {intl.formatMessage(messages.addButton)}
                </Button>
              )}
            </>
          )}
          <ButtonGroup>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="unit-preview-tooltip">{intl.formatMessage(messages.previewTooltip)}</Tooltip>}
            >
              <Button
                variant="outline-primary"
                onClick={handlePreview}
                iconBefore={FindInPage}
              >
                {intl.formatMessage(messages.previewButton)}
              </Button>
            </OverlayTrigger>
            {/* TODO: convert to <Button as="a" href="..."> since it navigates to a URL */}
            {/* Robbo: aria-disabled, not disabled: a disabled button gets no hover or focus, so no tooltip */}
            <OverlayTrigger
              placement="bottom"
              overlay={(
                <Tooltip id="unit-view-live-tooltip">
                  {intl.formatMessage(isPublished ? messages.viewLiveTooltip : messages.viewLiveUnpublishedTooltip)}
                </Tooltip>
              )}
            >
              <Button
                variant="outline-primary"
                className={isPublished ? undefined : 'disabled'}
                aria-disabled={!isPublished}
                onClick={isPublished ? handleViewLive : undefined}
              >
                {intl.formatMessage(messages.viewLiveButton)}
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </Stack>
      )}
      {
        /**
         * Action buttons used in legacy libraries content page and split test page
         */
      }
      {[COURSE_BLOCK_NAMES.libraryContent.id, COURSE_BLOCK_NAMES.splitTest.id].includes(category) && (
        <Button
          iconBefore={EditIcon}
          variant="outline-primary"
          onClick={handleEdit}
          data-testid="header-edit-button"
        >
          {intl.formatMessage(messages.editButton)}
        </Button>
      )}
    </nav>
  );
};

export default HeaderNavigations;
