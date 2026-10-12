/**
 * Centralised scoring configuration and calculation.
 *
 * Weights are tunable here. Scoring rules:
 *  - Only checks with status pass/warning/fail and points > 0 contribute to
 *    a category score (earned = points * status multiplier).
 *  - Info and not_measured checks are excluded from BOTH the numerator and
 *    denominator, so missing/unavailable data never awards or docks points.
 *  - A category with zero measurable checks reports score = null and is
 *    excluded from the weighted overall (weights are renormalised over the
 *    categories that actually have a score). This is disclosed in the report.
 */

import type { CategoryId, Check, CheckStatus, OverallScore } from './types';
import { CATEGORY_LABELS } from './types';

/** Category weights (must sum to 1). */
export const CATEGORY_WEIGHTS: Record<CategoryId, number> = {
  seo: 0.3,
  ai: 0.25,
  performance: 0.2,
  accessibility: 0.15,
  security: 0.1
};

export const STATUS_MULTIPLIER: Record<CheckStatus, number> = {
  pass: 1,
  warning: 0.5,
  fail: 0,
  info: 0,
  not_measured: 0
};

export function countChecks(checks: Check[]) {
  const counts = { pass: 0, warning: 0, fail: 0, info: 0, notMeasured: 0 };
  for (const c of checks) {
    if (c.status === 'pass') counts.pass += 1;
    else if (c.status === 'warning') counts.warning += 1;
    else if (c.status === 'fail') counts.fail += 1;
    else if (c.status === 'info') counts.info += 1;
    else counts.notMeasured += 1;
  }
  return counts;
}

/** Score a category 0-100. Returns null when nothing was measurable. */
export function scoreCategory(checks: Check[]): { score: number | null; counts: ReturnType<typeof countChecks> } {
  const counts = countChecks(checks);
  let earned = 0;
  let possible = 0;
  for (const c of checks) {
    const points = c.points ?? 0;
    if (c.status === 'pass' || c.status === 'warning' || c.status === 'fail') {
      possible += points;
      earned += points * STATUS_MULTIPLIER[c.status];
    }
  }
  const score = possible > 0 ? Math.round((earned / possible) * 100) : null;
  return { score, counts };
}

export interface CategoryScoreInput {
  id: CategoryId;
  checks: Check[];
}

export interface CategoryScored extends CategoryScoreInput {
  score: number | null;
  counts: ReturnType<typeof countChecks>;
  weight: number;
  label: string;
}

export function scoreCategories(inputs: CategoryScoreInput[]): CategoryScored[] {
  return inputs.map((input) => {
    const { score, counts } = scoreCategory(input.checks);
    return {
      ...input,
      score,
      counts,
      weight: CATEGORY_WEIGHTS[input.id],
      label: CATEGORY_LABELS[input.id]
    };
  });
}

export function gradeFor(score: number | null): OverallScore {
  if (score === null) return { score: null, grade: '—', label: 'Not enough data' };
  if (score >= 95) return { score, grade: 'A+', label: 'Excellent' };
  if (score >= 88) return { score, grade: 'A', label: 'Excellent' };
  if (score >= 80) return { score, grade: 'B+', label: 'Very good' };
  if (score >= 70) return { score, grade: 'B', label: 'Good' };
  if (score >= 60) return { score, grade: 'C+', label: 'Fair' };
  if (score >= 45) return { score, grade: 'C', label: 'Needs work' };
  if (score >= 30) return { score, grade: 'D', label: 'Poor' };
  return { score, grade: 'F', label: 'Critical issues' };
}

/**
 * Weighted overall score. Weights are renormalised over the categories that
 * actually have a measurable score, so unavailable categories never drag the
 * result down silently. Returns null when no category is measurable.
 */
export function overallScore(categories: CategoryScored[]): { overall: OverallScore; weightsUsed: Record<CategoryId, number> } {
  const measurable = categories.filter((c) => c.score !== null);
  if (measurable.length === 0) {
    return { overall: gradeFor(null), weightsUsed: {} as Record<CategoryId, number> };
  }
  const totalWeight = measurable.reduce((sum, c) => sum + c.weight, 0);
  const weightsUsed = {} as Record<CategoryId, number>;
  let combined = 0;
  for (const c of measurable) {
    const normalizedWeight = totalWeight > 0 ? c.weight / totalWeight : 0;
    weightsUsed[c.id] = normalizedWeight;
    combined += (c.score ?? 0) * normalizedWeight;
  }
  return { overall: gradeFor(Math.round(combined)), weightsUsed };
}
