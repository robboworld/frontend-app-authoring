import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import { useOptionalLibraryContext } from '@src/library-authoring/common/context/LibraryContext';

import messages from './messages';

type PublishDraftButtonProps = {
  onClick: () => void;
  // robbo: lets the caller block the button while a publish request is in flight
  disabled?: boolean;
};

/**
 * PublishDraftButton renders a button that triggers the publishing action
 * for a draft component/container.
 *
 * The button is disabled when the library is in read-only mode.
 * It displays a localized label along with the draft status.
 *
 * @param onClick - Callback invoked when the button is clicked.
 * @param disabled - Extra reason to disable the button besides the read-only mode.
 */
export const PublishDraftButton = ({
  onClick,
  disabled = false,
}: PublishDraftButtonProps) => {
  const intl = useIntl();
  const { readOnly } = useOptionalLibraryContext();

  return (
    <Button
      variant="outline-primary w-100 rounded-0 status-button draft-status font-weight-bold"
      className="m-1"
      disabled={readOnly || disabled}
      onClick={onClick}
    >
      <FormattedMessage
        {...messages.publishContainerButton}
        values={{
          publishStatus: (
            <span className="font-weight-500">
              ({intl.formatMessage(messages.draftChipText)})
            </span>
          ),
        }}
      />
    </Button>
  );
};
