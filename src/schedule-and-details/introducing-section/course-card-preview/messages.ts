/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Card mock-up strings repeat the real cards: catalog — robbo_catalog.py / _robbo_course_card.html,
 * «Мои курсы» — learner-dashboard `learner-dash.courseCard.*` (ru from openedx-translations).
 */
/* eslint-disable max-len */
import { defineMessages } from '@edx/frontend-platform/i18n';

const PREFIX = 'course-authoring.schedule-section.introducing.robbo-card-preview';

const messages = defineMessages({
  intro: {
    id: `${PREFIX}.intro`,
    defaultMessage: 'This is how learners will see the course card. Changes on this page show up here right away.',
  },
  unsavedHint: {
    id: `${PREFIX}.unsaved`,
    defaultMessage: 'Save your changes to see them on the site too.',
  },
  catalogTitle: {
    id: `${PREFIX}.catalog.title`,
    defaultMessage: 'In the catalog',
  },
  dashboardTitle: {
    id: `${PREFIX}.dashboard.title`,
    defaultMessage: 'In My courses',
  },
  openOnSite: {
    id: `${PREFIX}.open-on-site`,
    defaultMessage: 'Open on the site',
  },
  openOnSiteLabel: {
    id: `${PREFIX}.open-on-site.label`,
    defaultMessage: '{place}: open on the site in a new tab',
  },
  imageEmpty: {
    id: `${PREFIX}.image.empty`,
    defaultMessage: 'Your course has no image yet. Upload a 4:3 picture, at least 1200×900 px, JPEG or PNG.',
  },
  imageHelp: {
    id: `${PREFIX}.image.help`,
    defaultMessage: 'A 4:3 image of at least 1200×900 px (JPEG or PNG) fits best. Keep text, faces and logos closer to the center: the edges of the picture may be cropped in the cards.',
  },
  imageSize: {
    id: `${PREFIX}.image.size`,
    defaultMessage: 'Image: {width}×{height} px.',
  },
  imageTooSmall: {
    id: `${PREFIX}.image.too-small`,
    defaultMessage: 'Smaller than the recommended {width}×{height} px: it may look blurry on high-resolution screens.',
  },
  imageNotFourThree: {
    id: `${PREFIX}.image.not-4-3`,
    defaultMessage: 'Not 4:3: part of the picture will be cropped in the catalog.',
  },
  safeZoneToggle: {
    id: `${PREFIX}.safe-zone.toggle`,
    defaultMessage: 'Show the safe zone',
  },
  safeZoneHint: {
    id: `${PREFIX}.safe-zone.hint`,
    defaultMessage: 'Inside the dashed frame is what both the catalog and My courses show. Outside it the picture may be cropped.',
  },
  safeZoneNone: {
    id: `${PREFIX}.safe-zone.none`,
    defaultMessage: 'No part of this picture is shown in both cards. Choose an image closer to 4:3.',
  },
  cropButton: {
    id: `${PREFIX}.crop.button`,
    defaultMessage: 'Crop to 4:3',
  },
  cropTitle: {
    id: `${PREFIX}.crop.title`,
    defaultMessage: 'Crop the course card image',
  },
  cropHelp: {
    id: `${PREFIX}.crop.help`,
    defaultMessage: 'Drag the picture to choose the part to keep and set the zoom with the mouse wheel or the slider. With the keyboard, arrows move the frame (more with Shift).',
  },
  cropFromOriginal: {
    id: `${PREFIX}.crop.from-original`,
    defaultMessage: 'This picture was cropped here before, so the original opens with the same crop: you can bring back the edges cut off then.',
  },
  cropOriginalMissing: {
    id: `${PREFIX}.crop.original-missing`,
    defaultMessage: 'The original of this crop is no longer in Files & Uploads, so the current picture is cropped.',
  },
  cropViewportLabel: {
    id: `${PREFIX}.crop.viewport`,
    defaultMessage: '4:3 frame for the course card',
  },
  cropLegend: {
    id: `${PREFIX}.crop.legend`,
    defaultMessage: 'The lines show where the picture will end: «Catalog» in the course catalog, «My courses» in My courses, on the home page and on the About page. The dimmed part stays outside the crop.',
  },
  cropLabelCatalog: {
    id: `${PREFIX}.crop.label.catalog`,
    defaultMessage: 'Catalog',
  },
  cropLabelDashboard: {
    id: `${PREFIX}.crop.label.dashboard`,
    defaultMessage: 'My courses',
  },
  cropZoom: {
    id: `${PREFIX}.crop.zoom`,
    defaultMessage: 'Zoom',
  },
  cropLockedBothSmall: {
    id: `${PREFIX}.crop.locked.both-small`,
    defaultMessage: 'The crop covers the whole picture, and the picture is too small to zoom in.',
  },
  cropLockedVerticalSmall: {
    id: `${PREFIX}.crop.locked.vertical-small`,
    defaultMessage: 'The crop takes the full height of the picture, and the picture is too small to zoom in, so the crop moves only left and right.',
  },
  cropLockedHorizontalSmall: {
    id: `${PREFIX}.crop.locked.horizontal-small`,
    defaultMessage: 'The crop takes the full width of the picture, and the picture is too small to zoom in, so the crop moves only up and down.',
  },
  cropResult: {
    id: `${PREFIX}.crop.result`,
    defaultMessage: 'The result will be {width}×{height} px.',
  },
  cropResultSmall: {
    id: `${PREFIX}.crop.result-small`,
    defaultMessage: 'That is smaller than the recommended {width}×{height} px.',
  },
  cropReset: {
    id: `${PREFIX}.crop.reset`,
    defaultMessage: 'Reset',
  },
  cropCancel: {
    id: `${PREFIX}.crop.cancel`,
    defaultMessage: 'Cancel',
  },
  cropApply: {
    id: `${PREFIX}.crop.apply`,
    defaultMessage: 'Apply',
  },
  cropApplying: {
    id: `${PREFIX}.crop.applying`,
    defaultMessage: 'Uploading…',
  },
  cropLoadError: {
    id: `${PREFIX}.crop.load-error`,
    defaultMessage: 'Could not open the image for cropping.',
  },
  cropCanvasError: {
    id: `${PREFIX}.crop.canvas-error`,
    defaultMessage: 'The browser did not allow processing this image. Download it, crop it in an image editor and upload it again.',
  },
  cropUploadError: {
    id: `${PREFIX}.crop.upload-error`,
    defaultMessage: 'Could not upload the cropped image. Please try again.',
  },
  replaceImage: {
    id: `${PREFIX}.replace`,
    defaultMessage: 'Drag a new image here or click to replace the current one',
  },
  catalogStart: {
    id: `${PREFIX}.catalog.start`,
    defaultMessage: 'Start: {date}',
  },
  catalogAbout: {
    id: `${PREFIX}.catalog.about`,
    defaultMessage: 'About the course',
  },
  catalogCta: {
    id: `${PREFIX}.catalog.cta`,
    defaultMessage: 'Start learning',
  },
  dashboardNotStarted: {
    id: `${PREFIX}.dashboard.status.not-started`,
    defaultMessage: 'Not started',
  },
  dashboardCourseStarts: {
    id: `${PREFIX}.dashboard.course-starts`,
    defaultMessage: 'Course starts {startDate}',
  },
  dashboardCourseEnds: {
    id: `${PREFIX}.dashboard.course-ends`,
    defaultMessage: 'Course ends {endDate}',
  },
  dashboardCourseEnded: {
    id: `${PREFIX}.dashboard.course-ended`,
    defaultMessage: 'Course ended {endDate}',
  },
  dashboardUnits: {
    id: `${PREFIX}.dashboard.units`,
    defaultMessage: '{completed} of {total} units completed',
  },
  dashboardNotStartedBanner: {
    id: `${PREFIX}.dashboard.banner.not-started`,
    defaultMessage: 'You can\'t access this course just yet because the course hasn\'t started yet. The course will start on {startDate}.',
  },
  dashboardPassingGrade: {
    id: `${PREFIX}.dashboard.banner.passing-grade`,
    defaultMessage: 'Passing Grade: {minPassingGrade}%',
  },
  dashboardCertMinGrade: {
    id: `${PREFIX}.dashboard.banner.cert-min-grade`,
    defaultMessage: '{minPassingGrade}% is needed to earn a certificate.',
  },
  dashboardNotEligible: {
    id: `${PREFIX}.dashboard.banner.not-eligible`,
    defaultMessage: 'You are not eligible for a certificate.',
  },
  dashboardViewGrades: {
    id: `${PREFIX}.dashboard.banner.view-grades`,
    defaultMessage: 'View grades.',
  },
  dashboardBeginCourse: {
    id: `${PREFIX}.dashboard.begin-course`,
    defaultMessage: 'Begin Course',
  },
});

export default messages;
