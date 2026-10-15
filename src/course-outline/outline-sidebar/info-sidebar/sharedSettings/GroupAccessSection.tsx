/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course groups). See NOTICE at repository root.
 *
 * «Ограничения доступа» of a section or subsection in the outline sidebar, like the unit one
 * (GenericUnitInfoSettings): «show only to» / «hide from» the selected groups, or the lock while a section
 * above restricts access (GroupAccessLocked).
 */
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form as PForm } from '@openedx/paragon';
import { Form, Formik } from 'formik';
import { useMemo } from 'react';

import { useCourseItemData } from '@src/course-outline/data/apiHooks';
import unitInfoMessages from '@src/course-unit/unit-sidebar/unit-info/messages';
import type { AccessMode } from '@src/data/types';
import configureMessages from '@src/generic/configure-modal/messages';
import { AccessEditComponent, buildGroupAccess } from '@src/generic/configure-modal/UnitTab';
import GroupAccessLocked from '@src/generic/group-access-label/GroupAccessLocked';
import { SidebarSection } from '@src/generic/sidebar';

interface Props {
  itemId: string;
  isSubsection?: boolean;
  onSave: (groupAccess: Record<string, number[]>) => void;
  // removes the own rule of a locked subsection, so it inherits again
  onClearOwn?: () => void;
}

interface Values {
  selectedPartitionIndex: number;
  selectedGroups: string[];
  accessMode: AccessMode;
}

export const GroupAccessSection = ({
  itemId,
  isSubsection,
  onSave,
  onClearOwn,
}: Props) => {
  const intl = useIntl();
  const { data: itemData } = useCourseItemData(itemId);
  const userPartitionInfo = itemData?.userPartitionInfo;
  const groupAccessFrom = itemData?.groupAccessFrom;

  const initialValues = useMemo<Values>(() => {
    const selectedPartitionIndex = userPartitionInfo?.selectedPartitionIndex ?? -1;
    return {
      selectedPartitionIndex,
      selectedGroups: selectedPartitionIndex >= 0
        ? userPartitionInfo!.selectablePartitions[selectedPartitionIndex].groups
          .filter(({ selected }) => selected)
          .map(({ id }) => `${id}`)
        : [],
      accessMode: userPartitionInfo?.accessMode ?? 'allow',
    };
  }, [userPartitionInfo]);

  if (!groupAccessFrom && !userPartitionInfo?.selectablePartitions.length) {
    return null;
  }

  return (
    <SidebarSection title={intl.formatMessage(unitInfoMessages.sidebarInfoAccessTitle)}>
      {groupAccessFrom ? (
        <GroupAccessLocked
          source={groupAccessFrom}
          itemCategory={isSubsection ? 'sequential' : 'chapter'}
          own={itemData?.ownGroupAccess}
          onClearOwn={onClearOwn}
        />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values: Values, { resetForm }) => {
            onSave(buildGroupAccess(
              userPartitionInfo,
              values.selectedPartitionIndex,
              values.selectedGroups,
              values.accessMode,
            ));
            resetForm({ values });
          }}
        >
          {({ values, setFieldValue, dirty }) => (
            <Form>
              <AccessEditComponent
                selectedPartitionIndex={values.selectedPartitionIndex}
                setFieldValue={setFieldValue}
                userPartitionInfo={userPartitionInfo}
                selectedGroups={values.selectedGroups}
                accessMode={values.accessMode}
              />
              <PForm.Text className="mt-2">
                <FormattedMessage
                  {...(isSubsection ? configureMessages.subsectionAccessHint : configureMessages.sectionAccessHint)}
                />
              </PForm.Text>
              {dirty && (
                <Button className="mt-3" type="submit" variant="primary">
                  <FormattedMessage {...unitInfoMessages.visibilitySaveGroupsButton} />
                </Button>
              )}
            </Form>
          )}
        </Formik>
      )}
    </SidebarSection>
  );
};
