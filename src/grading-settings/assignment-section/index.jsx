/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: a warning lists the subsections of the type with nothing that gives points (the grade leaves
 * them out), and the counts no longer show as matching while there are such subsections.
 * The «… assignment(s) found» label is a message, so it is translated.
 * Another warning names the groups that can't get 100% for the type: some subsections are hidden from
 * them, and the grader pads the missing ones up to the total number with zeros (utils/groupLimits.js).
 * It suggests the total number that makes 100% possible for every group; with such a number the counts
 * show as fine for every group instead of the «does not match» warning.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Button } from '@openedx/paragon';
import { CheckCircle, Info, Warning } from '@openedx/paragon/icons';

import AlertMessage from '../../generic/alert-message';
import { validationAssignmentFields } from './utils/validation';
import AssignmentItem from './assignments/AssignmentItem';
import AssignmentTypeName from './assignments/AssignmentTypeName';
import { defaultAssignmentsPropTypes, ASSIGNMENT_TYPES } from './utils/enum';
import { getGroupLimits } from './utils/groupLimits';
import messages from './messages';

const MIN_NUMBER_VALUE = 0;
const MAX_NUMBER_VALUE = 100;

const AssignmentSection = ({
  handleRemoveAssignment,
  setShowSavePrompt,
  graders,
  setGradingData,
  courseAssignmentLists,
  unscoredAssignmentLists,
  groupAssignmentCounts,
  setShowSuccessAlert,
  isEditable = true,
}) => {
  const intl = useIntl();
  const [errorList, setErrorList] = useState({});
  const {
    type,
    weight,
    minCount,
    dropCount,
  } = ASSIGNMENT_TYPES;
  const isFieldsWithoutErrors = Object.values(errorList).every(field => field !== true);

  if (!isFieldsWithoutErrors) {
    setShowSavePrompt(false);
  }

  const handleAssignmentChange = (e, assignmentId) => {
    const { name, value, type: inputType } = e.target;

    let inputValue = value;
    if (inputType === 'number') {
      inputValue = parseInt(value, 10);
    }

    setShowSavePrompt(true);

    setGradingData(prevState => ({
      ...prevState,
      graders: graders.map(grader => {
        if (grader.id === assignmentId) {
          return { ...grader, [name]: inputValue };
        }
        return grader;
      }),
    }));

    validationAssignmentFields(
      assignmentId,
      name,
      type,
      value,
      setErrorList,
      setShowSavePrompt,
      graders,
      weight,
      minCount,
      dropCount,
    );
    setShowSuccessAlert(false);
  };

  return (
    <div className="assignment-items">
      {graders?.map((gradeField) => {
        const courseAssignmentUsage = courseAssignmentLists[gradeField.type];
        const groupLimits = getGroupLimits(
          groupAssignmentCounts?.[gradeField.type],
          gradeField.minCount,
          gradeField.dropCount,
        );
        // A total number below the subsections of the course, chosen so that every group can get 100%.
        const groupsExplainCount = groupLimits.hasHiddenSubsections && !groupLimits.limitedGroups.length
          && gradeField.minCount < courseAssignmentUsage?.length;
        const showDefinedCaseAlert = gradeField.minCount !== courseAssignmentUsage?.length
          && Boolean(courseAssignmentUsage?.length) && !groupsExplainCount;
        const showNotDefinedCaseAlert = !courseAssignmentUsage?.length && Boolean(gradeField.type);
        const unscoredAssignments = unscoredAssignmentLists?.[gradeField.type] || [];

        return (
          <div key={gradeField.id} className="course-grading-assignment-wrapper mb-4">
            <ol className="course-grading-assignment-items p-0 mb-4">
              <AssignmentTypeName
                value={gradeField.type}
                errorEffort={errorList[`${type}-${gradeField.id}`]}
                onChange={(e) => handleAssignmentChange(e, gradeField.id)}
                disabled={!isEditable}
              />
              <AssignmentItem
                className="course-grading-assignment-abbreviation"
                title={intl.formatMessage(messages.abbreviationTitle)}
                descriptions={intl.formatMessage(messages.abbreviationDescription)}
                type="text"
                name="shortLabel"
                value={gradeField.shortLabel}
                onChange={(e) => handleAssignmentChange(e, gradeField.id)}
                disabled={!isEditable}
              />
              <AssignmentItem
                className="course-grading-assignment-total-grade"
                title={intl.formatMessage(messages.weightOfTotalGradeTitle)}
                descriptions={intl.formatMessage(messages.weightOfTotalGradeDescription)}
                type="number"
                min={MIN_NUMBER_VALUE}
                max={MAX_NUMBER_VALUE}
                errorMsg={intl.formatMessage(messages.weightOfTotalGradeErrorMessage)}
                name={weight}
                value={gradeField.weight}
                onChange={(e) => handleAssignmentChange(e, gradeField.id)}
                errorEffort={errorList[`${weight}-${gradeField.id}`]}
                trailingElement="%"
                disabled={!isEditable}
              />
              <AssignmentItem
                className="course-grading-assignment-total-number"
                title={intl.formatMessage(messages.totalNumberTitle)}
                descriptions={intl.formatMessage(messages.totalNumberDescription)}
                type="number"
                min={1}
                errorMsg={intl.formatMessage(messages.totalNumberErrorMessage)}
                name={minCount}
                value={gradeField.minCount}
                onChange={(e) => handleAssignmentChange(e, gradeField.id)}
                errorEffort={errorList[`${minCount}-${gradeField.id}`]}
                disabled={!isEditable}
              />
              <AssignmentItem
                className="course-grading-assignment-number-droppable"
                title={intl.formatMessage(messages.numberOfDroppableTitle)}
                descriptions={intl.formatMessage(messages.numberOfDroppableDescription)}
                type="number"
                min={MIN_NUMBER_VALUE}
                errorMsg={intl.formatMessage(messages.numberOfDroppableErrorMessage)}
                name={dropCount}
                gradeField={gradeField}
                value={gradeField.dropCount}
                onChange={(e) => handleAssignmentChange(e, gradeField.id)}
                secondErrorMsg={intl.formatMessage(messages.numberOfDroppableSecondErrorMessage, {
                  type: gradeField.type,
                })}
                errorEffort={errorList[`${dropCount}-${gradeField.id}`]}
                disabled={!isEditable}
              />
            </ol>
            {showDefinedCaseAlert && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={intl.formatMessage(messages.assignmentAlertWarningUsageTitle, { type: gradeField.type })}
                description={
                  <>
                    <span className="course-grading-assignment-item-alert-warning-list-label">
                      {intl.formatMessage(messages.assignmentAlertWarningUsageFound, {
                        count: courseAssignmentUsage.length,
                      })}
                    </span>
                    <ol className="course-grading-assignment-item-alert-warning-list">
                      {courseAssignmentUsage.map(assignmentItem => <li key={assignmentItem}>{assignmentItem}</li>)}
                    </ol>
                  </>
                }
                aria-hidden="true"
              />
            )}
            {showNotDefinedCaseAlert && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={intl.formatMessage(messages.assignmentAlertWarningTitle, { type: gradeField.type })}
                description={
                  <span className="course-grading-assignment-item-alert-warning-list-label">
                    {intl.formatMessage(messages.assignmentAlertWarningDescription)}
                  </span>
                }
                aria-hidden="true"
              />
            )}
            {unscoredAssignments.length > 0 && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={intl.formatMessage(messages.assignmentAlertWarningUnscoredTitle, {
                  type: gradeField.type,
                  count: unscoredAssignments.length,
                })}
                description={
                  <ol className="course-grading-assignment-item-alert-warning-list">
                    {unscoredAssignments.map(assignmentItem => <li key={assignmentItem}>{assignmentItem}</li>)}
                  </ol>
                }
                aria-hidden="true"
              />
            )}
            {groupLimits.limitedGroups.length > 0 && (
              <AlertMessage
                className="course-grading-assignment-item-alert-warning"
                variant="warning"
                icon={Warning}
                title={intl.formatMessage(messages.assignmentAlertWarningGroupsTitle, {
                  type: gradeField.type,
                  minCount: gradeField.minCount,
                })}
                description={
                  <>
                    <ol className="course-grading-assignment-item-alert-warning-list">
                      {groupLimits.limitedGroups.map(entry => (
                        <li key={`${entry.partition}-${entry.group}`}>
                          {intl.formatMessage(messages.assignmentAlertWarningGroupsItem, {
                            ...entry,
                            everyone: groupLimits.everyone,
                          })}
                        </li>
                      ))}
                    </ol>
                    {groupLimits.suggestedMinCount && (
                      <span className="course-grading-assignment-item-alert-warning-hint">
                        {intl.formatMessage(messages.assignmentAlertWarningGroupsHint, {
                          suggested: groupLimits.suggestedMinCount,
                        })}
                      </span>
                    )}
                  </>
                }
                aria-hidden="true"
              />
            )}
            {groupsExplainCount && !unscoredAssignments.length && (
              <AlertMessage
                className="course-grading-assignment-item-alert-success"
                variant="success"
                icon={CheckCircle}
                title={intl.formatMessage(messages.assignmentAlertGroupsSuccess, { type: gradeField.type })}
                aria-hidden="true"
              />
            )}
            {groupLimits.limitedOutsiders.map(entry => (
              <AlertMessage
                key={`outsiders-${entry.partition}`}
                className="course-grading-assignment-item-alert-info"
                variant="info"
                icon={Info}
                title={intl.formatMessage(messages.assignmentAlertInfoOutsiders, {
                  ...entry,
                  type: gradeField.type,
                  everyone: groupLimits.everyone,
                })}
                aria-hidden="true"
              />
            ))}
            {gradeField.minCount === courseAssignmentUsage?.length && !unscoredAssignments.length
              && !groupLimits.limitedGroups.length && (
              <AlertMessage
                className="course-grading-assignment-item-alert-success"
                variant="success"
                icon={CheckCircle}
                title={intl.formatMessage(messages.assignmentAlertWarningSuccess, { type: gradeField.type })}
                aria-hidden="true"
              />
            )}
            <Button
              className="course-grading-assignment-delete-btn"
              variant="outline-primary"
              size="sm"
              onClick={() => handleRemoveAssignment(gradeField.id)}
              disabled={!isEditable}
            >
              {intl.formatMessage(messages.assignmentDeleteButton)}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

AssignmentSection.defaultProps = {
  courseAssignmentLists: undefined,
  unscoredAssignmentLists: undefined,
  groupAssignmentCounts: undefined,
  graders: undefined,
};

AssignmentSection.propTypes = {
  handleRemoveAssignment: PropTypes.func.isRequired,
  setGradingData: PropTypes.func.isRequired,
  setShowSavePrompt: PropTypes.func.isRequired,
  setShowSuccessAlert: PropTypes.func.isRequired,
  courseAssignmentLists: PropTypes.shape(defaultAssignmentsPropTypes),
  unscoredAssignmentLists: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  groupAssignmentCounts: PropTypes.objectOf(PropTypes.shape({
    everyone: PropTypes.number,
    groups: PropTypes.arrayOf(PropTypes.shape({
      partition: PropTypes.string,
      group: PropTypes.string,
      count: PropTypes.number,
    })),
  })),
  graders: PropTypes.arrayOf(
    PropTypes.shape(defaultAssignmentsPropTypes),
  ),
  isEditable: PropTypes.bool,
};

export default AssignmentSection;
