import {
  ActionRow,
  Button,
  AlertModal,
} from '@openedx/paragon';
import { useIntl, type MessageDescriptor } from '@edx/frontend-platform/i18n';

import {
  courseBlockNameGenitiveMessages,
  courseBlockNameMessages,
} from '@src/constants/messages';
import messages from './messages';
import LoadingButton from '../loading-button';

interface DeleteModalProps {
  isOpen: boolean;
  close: () => void;
  category?: string;
  onDeleteSubmit: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode | React.ReactNode[];
  variant?: string;
  btnLabel?: string;
  icon?: React.ElementType;
  buttonVariant?: 'tertiary' | 'brand' | 'primary' | 'danger';
  cancelButtonVariant?: 'tertiary' | 'brand' | 'primary' | 'default';
}

/** Map DeleteModal category keys to localized course-block display names. */
const CATEGORY_MESSAGES: Record<string, MessageDescriptor> = {
  chapter: courseBlockNameMessages.chapter,
  section: courseBlockNameMessages.chapter,
  sequential: courseBlockNameMessages.sequential,
  subsection: courseBlockNameMessages.sequential,
  vertical: courseBlockNameMessages.vertical,
  unit: courseBlockNameMessages.vertical,
  component: courseBlockNameMessages.component,
  itembank: courseBlockNameMessages.itembank,
  library_content: courseBlockNameMessages.libraryContent,
  'library-content': courseBlockNameMessages.libraryContent,
  split_test: courseBlockNameMessages.splitTest,
  'split-test': courseBlockNameMessages.splitTest,
};

const CATEGORY_GENITIVE_MESSAGES: Record<string, MessageDescriptor> = {
  chapter: courseBlockNameGenitiveMessages.chapter,
  section: courseBlockNameGenitiveMessages.chapter,
  sequential: courseBlockNameGenitiveMessages.sequential,
  subsection: courseBlockNameGenitiveMessages.sequential,
  vertical: courseBlockNameGenitiveMessages.vertical,
  unit: courseBlockNameGenitiveMessages.vertical,
  component: courseBlockNameGenitiveMessages.component,
  itembank: courseBlockNameGenitiveMessages.itembank,
  library_content: courseBlockNameGenitiveMessages.libraryContent,
  'library-content': courseBlockNameGenitiveMessages.libraryContent,
  split_test: courseBlockNameGenitiveMessages.splitTest,
  'split-test': courseBlockNameGenitiveMessages.splitTest,
};

/** Fallback when the caller already passed a localized nominative label (RU). */
const RU_GENITIVE_BY_NOMINATIVE: Record<string, string> = {
  компонент: 'компонента',
  блок: 'блока',
  раздел: 'раздела',
  подраздел: 'подраздела',
  'банк задач': 'банка задач',
  'содержимое библиотеки': 'содержимого библиотеки',
  'a/b-тест': 'a/b-теста',
  'блок со случайным содержимым': 'блока со случайным содержимым',
};

const DeleteModal = ({
  category = '',
  isOpen,
  close,
  onDeleteSubmit,
  title,
  description,
  variant = 'default',
  buttonVariant = 'danger',
  cancelButtonVariant = 'default',
  btnLabel,
  icon,
}: DeleteModalProps) => {
  const intl = useIntl();

  const categoryMessage = CATEGORY_MESSAGES[category];
  const categoryGenitiveMessage = CATEGORY_GENITIVE_MESSAGES[category];
  let categoryLabel: string;
  let categoryGenitiveLabel: string;

  if (categoryMessage) {
    categoryLabel = intl.formatMessage(categoryMessage).toLowerCase();
    categoryGenitiveLabel = intl.formatMessage(
      categoryGenitiveMessage || courseBlockNameGenitiveMessages.component,
    ).toLowerCase();
  } else if (!category || /^[a-z0-9_-]+$/i.test(category)) {
    // Raw English block-type key (video, html, …) → localized "component"
    categoryLabel = intl.formatMessage(courseBlockNameMessages.component).toLowerCase();
    categoryGenitiveLabel = intl.formatMessage(
      courseBlockNameGenitiveMessages.component,
    ).toLowerCase();
  } else {
    // Already localized by the caller (e.g. outline passes "раздел")
    categoryLabel = category;
    categoryGenitiveLabel = RU_GENITIVE_BY_NOMINATIVE[category.toLowerCase()] || category;
  }

  const modalTitle = title || intl.formatMessage(messages.title, { category: categoryLabel });
  const modalDescription = description || intl.formatMessage(messages.description, {
    category: categoryGenitiveLabel,
  });
  const defaultBtnLabel = btnLabel || intl.formatMessage(messages.deleteButton);

  return (
    <AlertModal
      title={modalTitle}
      isOpen={isOpen}
      onClose={close}
      variant={variant}
      icon={icon}
      footerNode={
        <ActionRow>
          <Button
            variant={cancelButtonVariant}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
          >
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <LoadingButton
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await onDeleteSubmit();
            }}
            variant={buttonVariant}
            label={defaultBtnLabel}
          />
        </ActionRow>
      }
    >
      <div>{modalDescription}</div>
    </AlertModal>
  );
};

export default DeleteModal;
