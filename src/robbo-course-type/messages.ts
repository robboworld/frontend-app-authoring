/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution (course type: paid access and paid certificate).
 * See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.robbo-course-type.title',
    defaultMessage: "Course type",
  },
  headingSubtitle: {
    id: 'course-authoring.robbo-course-type.subtitle',
    defaultMessage: "Settings",
  },
  description: {
    id: 'course-authoring.robbo-course-type.description',
    defaultMessage: "What learners pay for in this course. Learning itself stays free: learners enroll without paying.",
  },
  typeFree: {
    id: 'course-authoring.robbo-course-type.type.free',
    defaultMessage: "Free course: learning and the certificate are free",
  },
  typeCertificate: {
    id: 'course-authoring.robbo-course-type.type.certificate',
    defaultMessage: "Free learning, paid certificate",
  },
  typeFullAccess: {
    id: 'course-authoring.robbo-course-type.type.full-access',
    defaultMessage: "Free and paid versions of the course",
  },
  typeBoth: {
    id: 'course-authoring.robbo-course-type.type.both',
    defaultMessage: "Free and paid versions of the course, paid certificate",
  },
  currentType: {
    id: 'course-authoring.robbo-course-type.current',
    defaultMessage: "Course type: {type}",
  },
  readOnly: {
    id: 'course-authoring.robbo-course-type.read-only',
    defaultMessage: "Only platform administrators change the course type. Ask them if the course should become paid.",
  },
  switchOff: {
    id: 'course-authoring.robbo-course-type.switch-off',
    defaultMessage: "Certificate sales are off on the site: learners get certificates free until an administrator turns on the waffle switch robbo_certificates.paid_certificates.",
  },
  fullAccessTitle: {
    id: 'course-authoring.robbo-course-type.full-access.title',
    defaultMessage: "Free and paid versions of the course",
  },
  fullAccessHint: {
    id: 'course-authoring.robbo-course-type.full-access.hint',
    defaultMessage: "The course can be taken for free, and its full version can be bought. What opens only in the full version is marked in «Paid content» below; learners who bought it get the «Full access» tab in the course.",
  },
  fullAccessPaid: {
    id: 'course-authoring.robbo-course-type.full-access.paid',
    defaultMessage: "Sell the full version of the course",
  },
  fullAccessLearners: {
    id: 'course-authoring.robbo-course-type.full-access.learners',
    defaultMessage: "Bought the full version: {count}",
  },
  fullAccessOffWithLearners: {
    id: 'course-authoring.robbo-course-type.full-access.off-with-learners',
    defaultMessage: "Those who bought it keep the full version; it is just not sold any more.",
  },
  certificateTitle: {
    id: 'course-authoring.robbo-course-type.certificate.title',
    defaultMessage: "Certificate",
  },
  certificateHint: {
    id: 'course-authoring.robbo-course-type.certificate.hint',
    defaultMessage: "A learner who passed the course sees the price on the Progress page and pays through YooKassa; the certificate is issued after the payment.",
  },
  certificatePaid: {
    id: 'course-authoring.robbo-course-type.certificate.paid',
    defaultMessage: "The certificate is paid",
  },
  price: {
    id: 'course-authoring.robbo-course-type.price',
    defaultMessage: "Price, ₽",
  },
  minPercent: {
    id: 'course-authoring.robbo-course-type.min-percent',
    defaultMessage: "Result needed for the certificate, %",
  },
  minPercentHint: {
    id: 'course-authoring.robbo-course-type.min-percent.hint',
    defaultMessage: "Empty — the course passing grade ({percent}%). Not lower than it.",
  },
  minPercentHintUnknown: {
    id: 'course-authoring.robbo-course-type.min-percent.hint-unknown',
    defaultMessage: "Empty — the course passing grade. Not lower than it.",
  },
  freeForVerified: {
    id: 'course-authoring.robbo-course-type.certificate.free-for-verified',
    defaultMessage: "Free for learners who bought the full version",
  },
  freeForCohorts: {
    id: 'course-authoring.robbo-course-type.certificate.free-for-cohorts',
    defaultMessage: "Free for groups",
  },
  noCohorts: {
    id: 'course-authoring.robbo-course-type.certificate.no-cohorts',
    defaultMessage: "The course has no groups.",
  },
  save: {
    id: 'course-authoring.robbo-course-type.save',
    defaultMessage: "Save",
  },
  saving: {
    id: 'course-authoring.robbo-course-type.saving',
    defaultMessage: "Saving",
  },
  saved: {
    id: 'course-authoring.robbo-course-type.saved',
    defaultMessage: "Course type saved",
  },
  saveError: {
    id: 'course-authoring.robbo-course-type.save-error',
    defaultMessage: "Could not save the course type.",
  },
  paidContentTitle: {
    id: 'course-authoring.robbo-course-type.paid-content.title',
    defaultMessage: "Paid content",
  },
  paidContentHint: {
    id: 'course-authoring.robbo-course-type.paid-content.hint',
    defaultMessage: "What learners on the free path can't open without full access. The rules add up.",
  },
  paidContentEnabled: {
    id: 'course-authoring.robbo-course-type.paid-content.enabled',
    defaultMessage: "Part of the course is for full access only",
  },
  lockedInOutline: {
    id: 'course-authoring.robbo-course-type.paid-content.locked',
    defaultMessage: "Marked «Full access only» in the course outline: {count}",
  },
  lockedHint: {
    id: 'course-authoring.robbo-course-type.paid-content.locked-hint',
    defaultMessage: "Mark a section or subsection in the outline: its menu → «Full access only». Everything inside, including what you add later, follows it.",
  },
  freeSections: {
    id: 'course-authoring.robbo-course-type.paid-content.free-sections',
    defaultMessage: "Free sections at the start of the course",
  },
  freeSectionsHint: {
    id: 'course-authoring.robbo-course-type.paid-content.free-sections-hint',
    defaultMessage: "Empty — no such rule. The course has {count} sections.",
  },
  gradedPaid: {
    id: 'course-authoring.robbo-course-type.paid-content.graded-paid',
    defaultMessage: "All graded problems are paid",
  },
  display: {
    id: 'course-authoring.robbo-course-type.paid-content.display',
    defaultMessage: "What a learner on the free path sees instead",
  },
  displayLocked: {
    id: 'course-authoring.robbo-course-type.paid-content.display.locked',
    defaultMessage: "A lock: the title, «available with full access» and a button to buy it",
  },
  displayHidden: {
    id: 'course-authoring.robbo-course-type.paid-content.display.hidden',
    defaultMessage: "Nothing: paid parts are hidden",
  },
  grading: {
    id: 'course-authoring.robbo-course-type.paid-content.grading',
    defaultMessage: "Paid graded problems in the grade of a learner on the free path",
  },
  gradingZero: {
    id: 'course-authoring.robbo-course-type.paid-content.grading.zero',
    defaultMessage: "Count as not done (0)",
  },
  gradingExcluded: {
    id: 'course-authoring.robbo-course-type.paid-content.grading.excluded',
    defaultMessage: "Not counted: 100% is the whole free part",
  },
  notSold: {
    id: 'course-authoring.robbo-course-type.paid-content.not-sold',
    defaultMessage: "The full version of the course is not on sale, so learners can't open paid parts at all. Turn on «Sell the full version of the course» above.",
  },
  typeNoCertificate: {
    id: 'course-authoring.robbo-course-type.type.no-certificate',
    defaultMessage: "Free course without a certificate",
  },
  typeFullAccessNoCertificate: {
    id: 'course-authoring.robbo-course-type.type.full-access-no-certificate',
    defaultMessage: "Free and paid versions of the course, no certificate",
  },
  certificateIssued: {
    id: 'course-authoring.robbo-course-type.certificate.issued',
    defaultMessage: "The course issues a certificate",
  },
  certificateIssuedHint: {
    id: 'course-authoring.robbo-course-type.certificate.issued-hint',
    defaultMessage: "Learners enroll in «honor» and get the certificate when they pass the course. It is not turned off here, so that enrolled learners keep their certificates.",
  },
  certificateOffHint: {
    id: 'course-authoring.robbo-course-type.certificate.off-hint',
    defaultMessage: "Now learners enroll in «audit» and get no certificate. Turn it on and the course switches to «honor».",
  },
  certificateOnPending: {
    id: 'course-authoring.robbo-course-type.certificate.on-pending',
    defaultMessage: "After saving, the course switches to «honor». Set up the certificate itself in «Settings → Certificates».",
  },
  certificateAuditLearners: {
    id: 'course-authoring.robbo-course-type.certificate.audit-learners',
    defaultMessage: "Learners already in «audit» ({count}) are moved to «honor» too.",
  },
  certificatePaidNeedsIssued: {
    id: 'course-authoring.robbo-course-type.certificate.paid-needs-issued',
    defaultMessage: "A certificate can be paid only in a course that issues certificates.",
  },
});

export default messages;
