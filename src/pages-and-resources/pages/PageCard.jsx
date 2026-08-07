import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Card } from '@openedx/paragon';
import PropTypes from 'prop-types';
import React from 'react';
import messages, { getCourseAppCardLabels } from '../messages';
import { useIsDesktop } from '../../utils';
import PageSettingButton from './PageSettingButton';
import './PageCard.scss';

const CoursePageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  legacyLink: PropTypes.string,
  allowedOperations: PropTypes.shape({
    enable: PropTypes.bool,
    configure: PropTypes.bool,
  }),
});

export { CoursePageShape };

const PageCard = ({
  page,
  settingButton,
  courseId,
}) => {
  const intl = useIntl();
  const isDesktop = useIsDesktop();
  const { name, description } = getCourseAppCardLabels(
    intl,
    page.id,
    page.name,
    page.description,
  );

  const SettingButton = settingButton || <PageSettingButton courseId={courseId} {...page} />;

  return (
    <Card
      className={classNames('shadow justify-content-between', {
        'desktop-card': isDesktop,
        'mobile-card': !isDesktop,
      })}
    >
      <Card.Header
        title={name}
        subtitle={page.enabled && (
          <Badge variant="success" className="mt-1">
            {intl.formatMessage(messages.enabled)}
          </Badge>
        )}
        actions={<div className="mt-1">{SettingButton}</div>}
        size="sm"
      />
      <Card.Body>
        <Card.Section>
          {description}
        </Card.Section>
      </Card.Body>
    </Card>
  );
};

PageCard.defaultProps = {
  settingButton: null,
  courseId: null,
};

PageCard.propTypes = {
  page: CoursePageShape.isRequired,
  settingButton: PropTypes.node,
  courseId: PropTypes.string,
};

export default PageCard;
