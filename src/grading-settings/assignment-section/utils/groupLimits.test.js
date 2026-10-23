/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { getGroupLimits, maxPercentForCount } from './groupLimits';

const counts = {
  everyone: 34,
  groups: [
    { partition: 'Content groups', group: 'B2B', count: 33 },
    { partition: 'Content groups', group: 'B2G ', count: 29 },
    { partition: 'Content groups', group: null, count: 0 },
  ],
};

describe('maxPercentForCount', () => {
  it('pads the missing subsections up to the total number with zeros', () => {
    expect(maxPercentForCount(29, 34, 0)).toBe(85);
    expect(maxPercentForCount(33, 34, 0)).toBe(97);
  });
  it('gives 100% when the learner sees at least the total number', () => {
    expect(maxPercentForCount(29, 29, 0)).toBe(100);
    expect(maxPercentForCount(33, 29, 2)).toBe(100);
  });
  it('drops the padded zeros first', () => {
    expect(maxPercentForCount(29, 34, 5)).toBe(100);
    expect(maxPercentForCount(29, 34, 2)).toBe(90);
  });
  it('gives 0% to a learner who sees nothing', () => {
    expect(maxPercentForCount(0, 34, 0)).toBe(0);
  });
});

describe('getGroupLimits', () => {
  it('lists the groups that cannot get 100% and suggests the smallest group count', () => {
    const limits = getGroupLimits(counts, 34, 0);
    expect(limits.limitedGroups.map(entry => [entry.group, entry.max])).toEqual([['B2B', 97], ['B2G', 85]]);
    expect(limits.limitedOutsiders.map(entry => entry.max)).toEqual([0]);
    expect(limits.suggestedMinCount).toBe(29);
    expect(limits.hasHiddenSubsections).toBe(true);
  });
  it('has no limited groups with the suggested total number', () => {
    const limits = getGroupLimits(counts, 29, 0);
    expect(limits.limitedGroups).toEqual([]);
    expect(limits.suggestedMinCount).toBe(null);
    expect(limits.limitedOutsiders).toHaveLength(1);
  });
  it('has nothing without group counts', () => {
    expect(getGroupLimits(undefined, 4, 0)).toEqual({
      everyone: 0,
      hasHiddenSubsections: false,
      limitedGroups: [],
      limitedOutsiders: [],
      suggestedMinCount: null,
    });
  });
});
