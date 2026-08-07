// @ts-check
import React from 'react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import { HelpSidebar } from '../../generic/help-sidebar';
import messages from './messages';

const SettingsSidebar = ({ courseId, proctoredExamSettingsUrl = '' }) => {
  const intl = useIntl();

  return (
    <HelpSidebar
      courseId={courseId}
      proctoredExamSettingsUrl={proctoredExamSettingsUrl}
      showOtherSettings
    >
      <h4 className="help-sidebar-about-title">
        <FormattedMessage {...messages.about} />
      </h4>
      <p className="help-sidebar-about-descriptions">
        <FormattedMessage {...messages.aboutDescription1} />
      </p>
      <p className="help-sidebar-about-descriptions">
        <FormattedMessage {...messages.aboutDescription2} />
      </p>
      <p className="help-sidebar-about-descriptions">
        <FormattedMessage
          {...messages.aboutDescription3}
          values={{
            notice: (
              <strong>
                {intl.formatMessage(messages.aboutNoteNotice)}
              </strong>
            ),
          }}
        />
      </p>
    </HelpSidebar>
  );
};

SettingsSidebar.propTypes = {
  courseId: PropTypes.string.isRequired,
  proctoredExamSettingsUrl: PropTypes.string,
};

export default SettingsSidebar;
