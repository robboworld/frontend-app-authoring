/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { useIntl, defineMessages } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

const messages = defineMessages({
  placeholder: {
    id: 'course-authoring.files-and-uploads.table.textFilter.placeholder',
    defaultMessage: 'Search {header}',
    description: 'Placeholder for DataTable text filter input',
  },
});

const formatHeaderForLabel = (header) => {
  if (typeof header === 'function') {
    return header();
  }
  if (typeof header === 'string') {
    return header.toLowerCase();
  }
  return header;
};

/**
 * i18n-aware replacement for Paragon TextFilter, which hardcodes "Search …".
 */
const LocalizedTextFilter = ({
  column: {
    filterValue, setFilter, Header,
  },
}) => {
  const intl = useIntl();
  const controlId = useId();
  const formattedHeader = formatHeaderForLabel(Header);
  const inputText = React.isValidElement(formattedHeader)
    ? formattedHeader
    : intl.formatMessage(messages.placeholder, { header: formattedHeader });

  return (
    <Form.Group controlId={controlId}>
      <Form.Label className="sr-only">{inputText}</Form.Label>
      <Form.Control
        value={filterValue || ''}
        type="text"
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={inputText}
      />
    </Form.Group>
  );
};

LocalizedTextFilter.propTypes = {
  column: PropTypes.shape({
    setFilter: PropTypes.func.isRequired,
    Header: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]).isRequired,
    filterValue: PropTypes.string,
  }).isRequired,
};

export default LocalizedTextFilter;
