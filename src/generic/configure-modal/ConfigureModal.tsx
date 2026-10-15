/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 * Robbo: group access for sections and subsections (upstream offers it for units and components only),
 * «show only to» / «hide from» the selected groups; group_access is sent only when the author changed it.
 * Overflow is visible only on the «Basic» tab, so the taller «Visibility» tab scrolls.
 * Group access of a block inside a restricted section, subsection or unit is locked (GroupAccessLocked).
 */
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  Form,
  Tab,
  Tabs,
} from '@openedx/paragon';
import { Formik } from 'formik';

import { VisibilityTypes } from '@src/data/constants';
import { COURSE_BLOCK_NAMES } from '@src/constants';
import { AccessManagedXBlockDataTypes } from '@src/data/types';
import messages from './messages';
import BasicTab from './BasicTab';
import VisibilityTab from './VisibilityTab';
import AdvancedTab from './AdvancedTab';
import GroupAccessLocked from '@src/generic/group-access-label/GroupAccessLocked';
import { AccessEditComponent, UnitTab, buildGroupAccess } from './UnitTab';
import { PUBLISH_TYPES } from '@src/course-unit/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigureSubmit: (args: object) => void;
  enableProctoredExams?: boolean;
  enableTimedExams?: boolean;
  currentItemData?: AccessManagedXBlockDataTypes;
  isXBlockComponent?: boolean;
  isSelfPaced?: boolean;
  isOverflowVisible?: boolean;
}

const ConfigureModal = ({
  isOpen,
  onClose,
  onConfigureSubmit,
  currentItemData,
  enableProctoredExams = false,
  enableTimedExams = false,
  isXBlockComponent = false,
  isSelfPaced,
  isOverflowVisible = false,
}: Props) => {
  const intl = useIntl();
  // Visible overflow (sections) lets the release date picker out of the modal, but a modal like that
  // does not scroll: keep it for the «Basic» tab only. The modal starts there every time it opens.
  const [activeTab, setActiveTab] = useState('basic');
  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
    }
  }, [isOpen]);

  if (!currentItemData) {
    return null;
  }

  const {
    displayName,
    start: sectionStartDate,
    visibilityState,
    due,
    isTimeLimited,
    defaultTimeLimitMinutes,
    hideAfterDue,
    showCorrectness,
    courseGraders,
    category: _category,
    format,
    userPartitionInfo,
    groupAccessFrom,
    ownGroupAccess,
    ancestorHasStaffLock,
    isPrereq,
    prereqs,
    prereq,
    prereqMinScore,
    prereqMinCompletion,
    releasedToStudents,
    wasExamEverLinkedWithExternal,
    isProctoredExam,
    isOnboardingExam,
    isPracticeExam,
    examReviewRules,
    supportsOnboarding,
    showReviewRules,
    onlineProctoringRules,
    discussionEnabled,
  } = currentItemData;
  const category = _category ?? '';

  const getSelectedGroups = () => {
    if ((userPartitionInfo?.selectedPartitionIndex || 0) >= 0) {
      return userPartitionInfo?.selectablePartitions[userPartitionInfo?.selectedPartitionIndex]
        ?.groups
        .filter(({ selected }) => selected)
        .map(({ id }) => `${id}`)
        || [];
    }
    return [];
  };

  const defaultPrereqScore = (val) => {
    if (val === null || val === undefined) {
      return 100;
    }
    return parseFloat(val);
  };

  const initialValues = {
    releaseDate: sectionStartDate,
    isVisibleToStaffOnly: visibilityState === VisibilityTypes.STAFF_ONLY,
    graderType: format == null ? 'notgraded' : format,
    dueDate: due == null ? '' : due,
    isTimeLimited,
    isProctoredExam,
    isOnboardingExam,
    isPracticeExam,
    examReviewRules,
    defaultTimeLimitMinutes,
    hideAfterDue: hideAfterDue === undefined ? false : hideAfterDue,
    showCorrectness,
    isPrereq,
    prereqUsageKey: prereq,
    prereqMinScore: defaultPrereqScore(prereqMinScore),
    prereqMinCompletion: defaultPrereqScore(prereqMinCompletion),
    // by default it is -1 i.e. accessible to all learners & staff
    selectedPartitionIndex: userPartitionInfo?.selectedPartitionIndex,
    selectedGroups: getSelectedGroups(),
    accessMode: userPartitionInfo?.accessMode ?? 'allow',
    // Robbo: locked block — remove its own rule on «Save» (GroupAccessLocked)
    clearOwnGroupAccess: false,
    discussionEnabled,
  };

  const validationSchema = Yup.object().shape({
    isTimeLimited: Yup.boolean(),
    isProctoredExam: Yup.boolean(),
    isPracticeExam: Yup.boolean(),
    isOnboardingExam: Yup.boolean(),
    examReviewRules: Yup.string(),
    defaultTimeLimitMinutes: Yup.number().nullable(true),
    hideAfterDueState: Yup.boolean(),
    showCorrectness: Yup.string().required(),
    isPrereq: Yup.boolean(),
    prereqUsageKey: Yup.string().nullable(true),
    prereqMinScore: Yup.number().min(
      0,
      intl.formatMessage(messages.minScoreError),
    ).max(
      100,
      intl.formatMessage(messages.minScoreError),
    ).nullable(true),
    prereqMinCompletion: Yup.number().min(
      0,
      intl.formatMessage(messages.minScoreError),
    ).max(
      100,
      intl.formatMessage(messages.minScoreError),
    ).nullable(true),
    selectedPartitionIndex: Yup.number().integer(),
    selectedGroups: Yup.array().of(Yup.string()),
    accessMode: Yup.string().oneOf(['allow', 'deny']),
    discussionEnabled: Yup.boolean(),
  });

  // group_access is an inherited field: the modal of a subsection or unit inside a restricted section
  // shows the section's groups as selected. Saving them back unchanged would pin the inherited
  // restriction on the child, and it would stay after the section is opened up again.
  const getChangedGroupAccess = (data: Record<string, any>) => {
    if (groupAccessFrom) {
      return undefined; // locked: the restriction of the unit above applies (own rule: clearOwnGroupAccess)
    }
    const sortedGroups = (groups: string[] = []) => [...groups].sort().join();
    if (
      data.selectedPartitionIndex === initialValues.selectedPartitionIndex
      && sortedGroups(data.selectedGroups) === sortedGroups(initialValues.selectedGroups)
      && data.accessMode === initialValues.accessMode
    ) {
      return undefined;
    }
    return buildGroupAccess(userPartitionInfo, data.selectedPartitionIndex, data.selectedGroups, data.accessMode);
  };

  const renderGroupAccess = (values: any, setFieldValue: any, isSubsection: boolean) => (
    groupAccessFrom ? (
      <>
        <h5 className="mt-4 text-gray-700">
          {intl.formatMessage(isSubsection ? messages.subsectionAccess : messages.sectionAccess)}
        </h5>
        <hr />
        <GroupAccessLocked
          source={groupAccessFrom}
          itemCategory={category}
          own={ownGroupAccess}
          ownCleared={values.clearOwnGroupAccess}
          onClearOwn={() => setFieldValue('clearOwnGroupAccess', true)}
          onUndoClearOwn={() => setFieldValue('clearOwnGroupAccess', false)}
        />
      </>
    ) : (userPartitionInfo?.selectablePartitions.length || 0) > 0 && (
      <Form.Group controlId="groupSelect" className="mb-0">
        <h5 className="mt-4 text-gray-700">
          {intl.formatMessage(isSubsection ? messages.subsectionAccess : messages.sectionAccess)}
        </h5>
        <hr />
        <AccessEditComponent
          selectedPartitionIndex={values.selectedPartitionIndex}
          setFieldValue={setFieldValue}
          userPartitionInfo={userPartitionInfo}
          selectedGroups={values.selectedGroups}
          accessMode={values.accessMode}
        />
        <Form.Text className="mt-2">
          {intl.formatMessage(isSubsection ? messages.subsectionAccessHint : messages.sectionAccessHint)}
        </Form.Text>
      </Form.Group>
    )
  );

  const dialogTitle = isXBlockComponent
    ? intl.formatMessage(messages.componentTitle, { title: displayName })
    : intl.formatMessage(messages.title, { title: displayName });

  const configureHandlers: Record<string, {
    handleSave: (data: Record<string, any>) => void;
    renderBody: (values: any, setFieldValue: any) => React.ReactNode;
  }> = {
    [COURSE_BLOCK_NAMES.chapter.id]: {
      handleSave: (data) => {
        onConfigureSubmit({
          isVisibleToStaffOnly: data.isVisibleToStaffOnly,
          startDatetime: data.releaseDate || null,
          groupAccess: getChangedGroupAccess(data),
        });
      },
      renderBody: (values, setFieldValue) => (
        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'basic')}>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              values={values}
              setFieldValue={setFieldValue}
              isSubsection={false}
              courseGraders={courseGraders || []}
              isSelfPaced={!!isSelfPaced}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              values={values}
              setFieldValue={setFieldValue}
              category={category}
              isSubsection={false}
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
              groupAccess={renderGroupAccess(values, setFieldValue, false)}
            />
          </Tab>
        </Tabs>
      ),
    },
    [COURSE_BLOCK_NAMES.sequential.id]: {
      handleSave: (data) => {
        onConfigureSubmit({
          isVisibleToStaffOnly: data.isVisibleToStaffOnly,
          releaseDate: data.releaseDate || null,
          graderType: data.graderType,
          dueDate: data.dueDate,
          isTimeLimited: data.isTimeLimited,
          isProctoredExam: data.isProctoredExam,
          isOnboardingExam: data.isOnboardingExam,
          isPracticeExam: data.isPracticeExam,
          examReviewRules: data.examReviewRules,
          defaultTimeLimitMinutes: data.isTimeLimited ? data.defaultTimeLimitMinutes : 0,
          hideAfterDue: data.hideAfterDue,
          showCorrectness: data.showCorrectness,
          isPrereq: data.isPrereq,
          prereqUsageKey: data.prereqUsageKey,
          prereqMinScore: data.prereqMinScore,
          prereqMinCompletion: data.prereqMinCompletion,
          groupAccess: getChangedGroupAccess(data),
          clearGroupAccess: !!groupAccessFrom && data.clearOwnGroupAccess,
        });
      },
      renderBody: (values, setFieldValue) => (
        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'basic')}>
          <Tab eventKey="basic" title={intl.formatMessage(messages.basicTabTitle)}>
            <BasicTab
              values={values}
              setFieldValue={setFieldValue}
              isSubsection
              courseGraders={courseGraders || []}
              isSelfPaced={!!isSelfPaced}
            />
          </Tab>
          <Tab eventKey="visibility" title={intl.formatMessage(messages.visibilityTabTitle)}>
            <VisibilityTab
              values={values}
              setFieldValue={setFieldValue}
              category={category}
              isSubsection
              showWarning={visibilityState === VisibilityTypes.STAFF_ONLY}
              isSelfPaced={isSelfPaced}
              groupAccess={renderGroupAccess(values, setFieldValue, true)}
            />
          </Tab>
          <Tab eventKey="advanced" title={intl.formatMessage(messages.advancedTabTitle)}>
            <div className="mt-4">
              <AdvancedTab
                values={values}
                setFieldValue={setFieldValue}
                prereqs={prereqs}
                releasedToStudents={releasedToStudents}
                wasExamEverLinkedWithExternal={wasExamEverLinkedWithExternal}
                enableProctoredExams={enableProctoredExams}
                enableTimedExams={enableTimedExams}
                supportsOnboarding={supportsOnboarding}
                showReviewRules={showReviewRules}
                wasProctoredExam={isProctoredExam}
                onlineProctoringRules={onlineProctoringRules}
              />
            </div>
          </Tab>
        </Tabs>
      ),
    },
  };

  // Node-content handler shared by vertical, libraryContent, splitTest, component
  const nodeHandler = {
    handleSave: (data: Record<string, any>) => {
      onConfigureSubmit({
        isVisibleToStaffOnly: data.isVisibleToStaffOnly,
        type: PUBLISH_TYPES.republish,
        groupAccess: getChangedGroupAccess(data),
        clearGroupAccess: !!groupAccessFrom && data.clearOwnGroupAccess,
        discussionEnabled: data.discussionEnabled,
      });
    },
    renderBody: (values, setFieldValue) => (
      <UnitTab
        isXBlockComponent={isXBlockComponent}
        category={category}
        values={values}
        setFieldValue={setFieldValue}
        showWarning={visibilityState === VisibilityTypes.STAFF_ONLY && !ancestorHasStaffLock}
        userPartitionInfo={userPartitionInfo}
        groupAccessFrom={groupAccessFrom}
        ownGroupAccess={ownGroupAccess}
      />
    ),
  };

  [
    COURSE_BLOCK_NAMES.vertical.id,
    COURSE_BLOCK_NAMES.libraryContent.id,
    COURSE_BLOCK_NAMES.splitTest.id,
    COURSE_BLOCK_NAMES.component.id,
  ].forEach(
    (key) => {
      configureHandlers[key] = nodeHandler;
    },
  );

  const activeHandler = configureHandlers[category];

  const handleSave = (data: Record<string, any>) => {
    activeHandler?.handleSave(data);
  };

  const renderModalBody = (values: any, setFieldValue: any) => {
    return activeHandler?.renderBody(values, setFieldValue) ?? null;
  };

  return (
    <ModalDialog
      className="configure-modal"
      title={dialogTitle}
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={isOverflowVisible && activeTab === 'basic'}
    >
      <div data-testid="configure-modal">
        <ModalDialog.Header className="configure-modal__header">
          <ModalDialog.Title>
            {dialogTitle}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSave}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange
        >
          {({
            values,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <ModalDialog.Body className="configure-modal__body">
                <Form.Group size="sm" className="form-field">
                  {renderModalBody(values, setFieldValue)}
                </Form.Group>
              </ModalDialog.Body>
              <ModalDialog.Footer className="pt-1">
                <ActionRow>
                  <ModalDialog.CloseButton variant="tertiary">
                    {intl.formatMessage(messages.cancelButton)}
                  </ModalDialog.CloseButton>
                  <Button
                    data-testid="configure-save-button"
                    type="submit"
                  >
                    {intl.formatMessage(messages.saveButton)}
                  </Button>
                </ActionRow>
              </ModalDialog.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </ModalDialog>
  );
};

export default ConfigureModal;
