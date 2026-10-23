/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Robbo: the best grade the learners of a group can get for an assignment type.
 *
 * The LMS grader takes the subsections of the type that give points to the learner, pads them with zeros
 * up to the «Total number» (min_count), drops the «Number of droppable» lowest and averages the rest. So a
 * group that sees fewer subsections than the total number can't get 100% for the type. The counts come
 * from the grading API (group_assignment_counts, cms/djangoapps/contentstore/utils.py).
 */

/**
 * The best percent (rounded down) for a learner who sees `count` subsections of the type.
 */
export const maxPercentForCount = (count, minCount, dropCount) => {
  const total = Math.max(count, Number.isFinite(minCount) ? minCount : 0);
  const kept = total - (Number.isFinite(dropCount) ? dropCount : 0);
  if (count <= 0 || kept <= 0) {
    return 0;
  }
  return Math.floor((Math.min(count, kept) / kept) * 100);
};

/**
 * Groups of an assignment type that see fewer subsections than the course has and can't get 100%:
 * `limitedGroups` (named groups), `limitedOutsiders` (learners in none of the groups of a configuration),
 * `hasHiddenSubsections` (some group sees fewer subsections at all) and `suggestedMinCount` (the smallest
 * count of a named group: with it as the total number every group can get 100%).
 */
export const getGroupLimits = (groupCounts, minCount, dropCount) => {
  const everyone = groupCounts?.everyone ?? 0;
  const entries = (groupCounts?.groups || []).map((entry) => ({
    ...entry,
    group: entry.group === null ? null : String(entry.group).trim(),
    max: maxPercentForCount(entry.count, minCount, dropCount),
  }));
  const hidden = entries.filter((entry) => entry.count < everyone);
  const namedCounts = entries.filter((entry) => entry.group !== null).map((entry) => entry.count);
  const smallest = namedCounts.length ? Math.min(...namedCounts) : 0;
  return {
    everyone,
    hasHiddenSubsections: hidden.some((entry) => entry.group !== null),
    limitedGroups: hidden.filter((entry) => entry.group !== null && entry.max < 100),
    limitedOutsiders: hidden.filter((entry) => entry.group === null && entry.max < 100),
    suggestedMinCount: smallest >= 1 && smallest < minCount ? smallest : null,
  };
};
