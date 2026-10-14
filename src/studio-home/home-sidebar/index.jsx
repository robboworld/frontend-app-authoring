import React from 'react';
import { useSelector } from 'react-redux';
import { Hyperlink, MailtoLink } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { COURSE_CREATOR_STATES } from '../../constants';
import { useHelpUrls } from '../../help-urls/hooks';
import { HelpSidebar, HelpSidebarLink } from '../../generic/help-sidebar';
import { getStudioHomeData } from '../data/selectors';
import messages from './messages';

const ROBBO_SUPPORT_URL = 'https://support.robbo.world/';

const HomeSidebar = () => {
  const intl = useIntl();
  const {
    studioName,
    platformName,
    studioRequestEmail,
    techSupportEmail,
    courseCreatorStatus,
  } = useSelector(getStudioHomeData);
  const { home: aboutHomeLink } = useHelpUrls(['home']);

  // eslint-disable-next-line max-len
  const isShowMailToGetInstruction = courseCreatorStatus === COURSE_CREATOR_STATES.disallowedForThisSite
    && !!studioRequestEmail;
  const isShowUnrequestedInstruction = courseCreatorStatus === COURSE_CREATOR_STATES.unrequested;
  const isShowDeniedInstruction = courseCreatorStatus === COURSE_CREATOR_STATES.denied;

  return (
    <HelpSidebar>
      <h4 className="help-sidebar-about-title">
        {intl.formatMessage(messages.aboutTitle, { studioName })}
      </h4>
      <p className="help-sidebar-about-descriptions">
        {intl.formatMessage(messages.robboSupportDescription, {
          supportLink: (
            <Hyperlink destination={ROBBO_SUPPORT_URL} target="_blank" showLaunchIcon={false}>
              {intl.formatMessage(messages.robboSupportLink)}
            </Hyperlink>
          ),
        })}
      </p>
      <HelpSidebarLink
        as="span"
        pathToPage={aboutHomeLink || ''}
        title={intl.formatMessage(messages.studioHomeLinkToGettingStarted, { studioName })}
      />
      {isShowMailToGetInstruction && (
        <>
          <hr />
          <h4 className="help-sidebar-about-title">
            {intl.formatMessage(messages.sidebarHeader2, { studioName })}
          </h4>
          <p className="help-sidebar-about-descriptions">
            {intl.formatMessage(messages.sidebarDescription2, {
              studioName,
              mailTo: (
                <MailtoLink to={studioRequestEmail}>
                  {intl.formatMessage(messages.sidebarDescription2MailTo, { platformName })}
                </MailtoLink>
              ),
            })}
          </p>
        </>
      )}
      {isShowUnrequestedInstruction && (
        <>
          <hr />
          <h4 className="help-sidebar-about-title">
            {intl.formatMessage(messages.sidebarHeader3, { studioName })}
          </h4>
          <p className="help-sidebar-about-descriptions">
            {intl.formatMessage(messages.sidebarDescription3, { studioName })}
          </p>
        </>
      )}
      {isShowDeniedInstruction && (
        <>
          <hr />
          <h4 className="help-sidebar-about-title">
            {intl.formatMessage(messages.sidebarHeader4, { studioName })}
          </h4>
          <p className="help-sidebar-about-descriptions">
            {intl.formatMessage(messages.sidebarDescription4, {
              studioName,
              mailTo: (
                <MailtoLink to={techSupportEmail}>
                  {intl.formatMessage(messages.sidebarDescription4MailTo, { platformName })}
                </MailtoLink>
              ),
            })}
          </p>
        </>
      )}
    </HelpSidebar>
  );
};

export default HomeSidebar;
