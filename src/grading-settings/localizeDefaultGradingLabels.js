/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Map Open edX English default grading-policy labels to Russian for Studio UI.
 * Applies only to known upstream defaults (Homework/HW/Pass/…).
 *
 * Assignment type names are localized only when no subsections use that type,
 * so LMS grading (matched by subsection format) is not broken.
 */

const DEFAULT_ASSIGNMENT_TYPES = {
  Homework: 'Домашнее задание',
  Lab: 'Лабораторная работа',
  'Midterm Exam': 'Промежуточный экзамен',
  'Final Exam': 'Итоговый экзамен',
};

const DEFAULT_SHORT_LABELS = {
  HW: 'ДЗ',
  Midterm: 'Пром.',
  Final: 'Итог',
};

const DEFAULT_SHORT_LABEL_BY_TYPE = {
  Homework: 'ДЗ',
  'Midterm Exam': 'Пром.',
  'Final Exam': 'Итог',
};

const DEFAULT_GRADE_CUTOFFS = {
  Pass: 'Зачёт',
};

const isRussianLocale = (locale) => String(locale || '').toLowerCase().startsWith('ru');

const renameObjectKeys = (obj, keyMap) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [keyMap[key] || key, value]),
  );
};

const isTypeInUse = (type, courseAssignmentLists) => {
  const usages = courseAssignmentLists?.[type];
  return Array.isArray(usages) && usages.length > 0;
};

export const localizeDefaultGraders = (graders, locale, courseAssignmentLists) => {
  if (!isRussianLocale(locale) || !Array.isArray(graders)) {
    return graders;
  }
  return graders.map((grader) => {
    if (!grader) {
      return grader;
    }
    const canRenameType = DEFAULT_ASSIGNMENT_TYPES[grader.type]
      && !isTypeInUse(grader.type, courseAssignmentLists);
    let shortLabel = DEFAULT_SHORT_LABELS[grader.shortLabel] || grader.shortLabel;
    if (canRenameType && !shortLabel) {
      shortLabel = DEFAULT_SHORT_LABEL_BY_TYPE[grader.type] || shortLabel;
    }
    return {
      ...grader,
      type: canRenameType ? DEFAULT_ASSIGNMENT_TYPES[grader.type] : grader.type,
      shortLabel,
    };
  });
};

export const localizeDefaultGradeCutoffs = (gradeCutoffs, locale) => {
  if (!isRussianLocale(locale)) {
    return gradeCutoffs;
  }
  return renameObjectKeys(gradeCutoffs, DEFAULT_GRADE_CUTOFFS);
};

export const localizeDefaultCourseAssignmentLists = (courseAssignmentLists, locale, graders) => {
  if (!isRussianLocale(locale) || !courseAssignmentLists) {
    return courseAssignmentLists;
  }
  // Only rename list keys for types we also renamed on graders (unused types).
  const renamedTypes = new Set(
    (graders || [])
      .map((grader) => grader?.type)
      .filter((type) => Object.values(DEFAULT_ASSIGNMENT_TYPES).includes(type)),
  );
  const keyMap = Object.fromEntries(
    Object.entries(DEFAULT_ASSIGNMENT_TYPES).filter(([, ruType]) => renamedTypes.has(ruType)),
  );
  return renameObjectKeys(courseAssignmentLists, keyMap);
};

export const localizeDefaultGradingDetails = (courseDetails, locale, courseAssignmentLists) => {
  if (!courseDetails || !isRussianLocale(locale)) {
    return courseDetails;
  }
  return {
    ...courseDetails,
    graders: localizeDefaultGraders(courseDetails.graders, locale, courseAssignmentLists),
    gradeCutoffs: localizeDefaultGradeCutoffs(courseDetails.gradeCutoffs, locale),
  };
};
