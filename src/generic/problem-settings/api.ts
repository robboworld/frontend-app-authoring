/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * «Настроить задачи»: problem settings applied to every problem of a unit, subsection, section or course
 * (openedx-platform cms/djangoapps/contentstore/robbo_problem_settings.py).
 */
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export interface ProblemSettingsSummary {
  problems: number;
  choiceProblems: number;
  skippedChoiceProblems: number;
}

export interface ProblemSettingsResult extends ProblemSettingsSummary {
  changed: number;
}

/** Only the settings present are applied. */
export interface ProblemSettingsValues {
  shuffle?: 'off' | 'per_student' | 'every_attempt';
  max_attempts?: 'unlimited' | number;
  showanswer?: string;
  attempts_before_showanswer_button?: number;
  show_reset_button?: boolean;
  submission_wait_seconds?: number;
}

const getProblemSettingsUrl = (blockId: string) => `${getConfig().STUDIO_BASE_URL}/robbo/problem-settings/${blockId}`;

const toSummary = (data: Record<string, number>): ProblemSettingsSummary => ({
  problems: data.problems,
  choiceProblems: data.choice_problems,
  skippedChoiceProblems: data.skipped_choice_problems,
});

export async function getProblemSettingsSummary(blockId: string): Promise<ProblemSettingsSummary> {
  const { data } = await getAuthenticatedHttpClient().get(getProblemSettingsUrl(blockId));
  return toSummary(data);
}

export async function applyProblemSettings(
  blockId: string,
  values: ProblemSettingsValues,
): Promise<ProblemSettingsResult> {
  const { data } = await getAuthenticatedHttpClient().post(getProblemSettingsUrl(blockId), values);
  return { ...toSummary(data), changed: data.changed };
}
