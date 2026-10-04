/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: optional "create from archive" — fields are prefilled from an OLX
 * export, and the archive is imported into the new course after creation.
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form } from '@openedx/paragon';
import { FileUpload as FileUploadIcon } from '@openedx/paragon/icons';

import { CreateOrRerunCourseForm } from '../../generic/create-or-rerun-course';
import { readCourseArchive } from './readCourseArchive';
import messages from './messages';

const emptyCourseData = {
  displayName: '',
  org: '',
  number: '',
  run: '',
};

const CreateNewCourseForm = ({ handleOnClickCancel }) => {
  const intl = useIntl();
  const fileInputRef = useRef(null);
  const [initialNewCourseData, setInitialNewCourseData] = useState(emptyCourseData);
  const [archiveFile, setArchiveFile] = useState(null);
  const [isReadingArchive, setReadingArchive] = useState(false);
  const [archiveError, setArchiveError] = useState('');

  const handleArchiveChange = async (event) => {
    const file = event.target.files?.[0];
    // allow choosing the same file again after "Remove"
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
    if (!file) {
      return;
    }
    setArchiveError('');
    setReadingArchive(true);
    const info = await readCourseArchive(file);
    setReadingArchive(false);
    if (!info) {
      setArchiveFile(null);
      setArchiveError(intl.formatMessage(messages.archiveReadError));
      return;
    }
    setArchiveFile(file);
    setInitialNewCourseData({
      displayName: info.displayName,
      org: info.org,
      number: info.number,
      run: info.run,
    });
  };

  const handleArchiveRemove = () => {
    setArchiveFile(null);
    setArchiveError('');
    setInitialNewCourseData({ ...emptyCourseData });
  };

  return (
    <div className="mb-4.5" data-testid="create-course-form">
      <CreateOrRerunCourseForm
        title={intl.formatMessage(messages.createNewCourse)}
        initialValues={initialNewCourseData}
        onClickCancel={handleOnClickCancel}
        importFile={archiveFile}
        isCreateNewCourse
      >
        <Form.Group className="form-group-custom create-course-archive">
          <Form.Label as="span">{intl.formatMessage(messages.archiveLabel)}</Form.Label>
          <div className="create-course-archive__row">
            <Button
              variant="outline-primary"
              iconBefore={FileUploadIcon}
              onClick={() => fileInputRef.current?.click()}
              disabled={isReadingArchive}
            >
              {intl.formatMessage(isReadingArchive ? messages.archiveReading : messages.archiveChoose)}
            </Button>
            {archiveFile && (
              <>
                <span className="create-course-archive__name">
                  {intl.formatMessage(messages.archiveChosen, { fileName: archiveFile.name })}
                </span>
                <Button variant="link" size="sm" onClick={handleArchiveRemove}>
                  {intl.formatMessage(messages.archiveRemove)}
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".tar.gz,.tgz,application/gzip,application/x-gzip"
              className="d-none"
              aria-label={intl.formatMessage(messages.archiveChoose)}
              onChange={handleArchiveChange}
            />
          </div>
          <Form.Text>
            {intl.formatMessage(archiveFile ? messages.archiveChosenHelpText : messages.archiveHelpText)}
          </Form.Text>
          {archiveError && (
            <Form.Control.Feedback type="invalid" hasIcon={false}>
              {archiveError}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </CreateOrRerunCourseForm>
    </div>
  );
};

CreateNewCourseForm.propTypes = {
  handleOnClickCancel: PropTypes.func.isRequired,
};

export default CreateNewCourseForm;
