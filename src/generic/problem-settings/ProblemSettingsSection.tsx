/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * «Настройки задач» in the settings tab of a unit, subsection or section and in the course sidebar of the
 * outline: opens ProblemSettingsModal for the problems inside.
 */
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@openedx/paragon';

import { SidebarSection } from '@src/generic/sidebar';
import { ProblemSettingsCategory, ProblemSettingsModal } from './ProblemSettingsModal';
import messages from './messages';

interface Props {
  /** Usage key of the unit, subsection, section or course block. */
  blockId: string;
  name: string;
  category: ProblemSettingsCategory;
  /** Called once the settings are applied, e.g. to refresh the unit preview. */
  onApplied?: () => void;
}

export const ProblemSettingsSection = ({
  blockId,
  name,
  category,
  onApplied,
}: Props) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(false);
  return (
    <SidebarSection title={intl.formatMessage(messages.sectionTitle)}>
      <p className="small mb-0">{intl.formatMessage(messages.sectionText, { category })}</p>
      <div>
        <Button variant="outline-primary" size="sm" onClick={open}>
          {intl.formatMessage(messages.openButton)}
        </Button>
      </div>
      {/* Mounted only while open, so every opening starts from «Не менять» and a fresh count. */}
      {isOpen && (
        <ProblemSettingsModal
          blockId={blockId}
          name={name}
          category={category}
          isOpen
          onClose={close}
          onApplied={onApplied}
        />
      )}
    </SidebarSection>
  );
};

export default ProblemSettingsSection;
