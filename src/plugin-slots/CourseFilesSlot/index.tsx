/**
 * Modifications Copyright (C) 2026 Robbo. See NOTICE at repository root.
 */
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import RobboCourseFiles from '@src/files-and-videos/files-page/robbo-catalog/RobboCourseFiles';
import React from 'react';

// Robbo: the default content is the files table with the catalog (automatic groups and folders).
const CourseFilesSlot = () => (
  <PluginSlot id="org.openedx.frontend.authoring.files_upload_page_table.v1">
    <RobboCourseFiles />
  </PluginSlot>
);

export default CourseFilesSlot;
