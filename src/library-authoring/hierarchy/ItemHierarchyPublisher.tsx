import { type ReactNode } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Button,
  Container,
} from '@openedx/paragon';

import LoadingButton from '@src/generic/loading-button';
import { ContainerType, getBlockType } from '@src/generic/key-utils';
import Loading from '@src/generic/Loading';

import messages from './messages';
import { ItemHierarchy } from './ItemHierarchy';
import { useLibraryItemHierarchy } from '../data/apiHooks';

type ItemHierarchyPublisherProps = {
  itemId: string;
  handleClose: () => void;
  handlePublish: () => void;
};

export const ItemHierarchyPublisher = ({
  itemId,
  handleClose,
  handlePublish,
}: ItemHierarchyPublisherProps) => {
  const intl = useIntl();
  const itemType = getBlockType(itemId);

  const {
    data: hierarchy,
    isPending,
    isError,
  } = useLibraryItemHierarchy(itemId);

  if (isPending) {
    return <Loading />;
  }

  // robbo: the backend may not provide the hierarchy API (older openedx-platform). Without it we
  // cannot list the children, but publishing itself works, so keep the confirm dialog usable.

  const highlight = (...chunks: ReactNode[]) => <strong>{chunks}</strong>;
  const childWarningMessage = () => {
    let childCount: number;
    let childMessage: MessageDescriptor;
    let noChildMessage: MessageDescriptor;

    switch (itemType) {
      case ContainerType.Section:
        childCount = hierarchy?.subsections.length ?? 0;
        childMessage = messages.publishSectionWithChildrenWarning;
        noChildMessage = messages.publishSectionWarning;
        break;
      case ContainerType.Subsection:
        childCount = hierarchy?.units.length ?? 0;
        childMessage = messages.publishSubsectionWithChildrenWarning;
        noChildMessage = messages.publishSubsectionWarning;
        break;
      case ContainerType.Unit:
        childCount = hierarchy?.components.length ?? 0;
        childMessage = messages.publishUnitWithChildrenWarning;
        noChildMessage = messages.publishUnitWarning;
        break;
      default: // The item is a component
        childCount = 0;
        childMessage = messages.empty; // Never used
        noChildMessage = messages.publishComponentWarning;
        break;
    }
    return intl.formatMessage(
      childCount ? childMessage : noChildMessage,
      {
        childCount,
        highlight,
      },
    );
  };

  return (
    <Container className="p-3 status-box draft-status">
      <h4>{intl.formatMessage(messages.publishConfirmHeading)}</h4>
      <p>{childWarningMessage()}</p>
      {!isError && <ItemHierarchy showPublishStatus />}
      <ActionRow>
        <Button
          variant="outline-primary rounded-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
        >
          {intl.formatMessage(messages.publishCancel)}
        </Button>
        <LoadingButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePublish();
          }}
          variant="primary rounded-0"
          label={intl.formatMessage(messages.publishConfirm)}
        />
      </ActionRow>
    </Container>
  );
};
