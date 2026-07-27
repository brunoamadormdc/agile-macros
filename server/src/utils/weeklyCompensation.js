const EPSILON = 0.005;

function round2(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function calculateMetric({ weeklyTarget, days, dayIndex, field }) {
  if (weeklyTarget == null) {
    return null;
  }

  const baseDailyTarget = Number(weeklyTarget || 0) / 7;
  const consumedBeforeDate = days
    .slice(0, dayIndex)
    .reduce((sum, day) => sum + Number(day?.[field] || 0), 0);
  const consumedOnDate = Number(days[dayIndex]?.[field] || 0);
  const daysToDistribute = Math.max(0, days.length - dayIndex);
  const remainingWeekBudget = Number(weeklyTarget || 0) - consumedBeforeDate;
  const rawDailyTarget = daysToDistribute
    ? remainingWeekBudget / daysToDistribute
    : 0;

  return {
    baseDailyTarget: round2(baseDailyTarget),
    rawDailyTarget: round2(rawDailyTarget),
    dailyAdjustment: round2(rawDailyTarget - baseDailyTarget),
    consumedBeforeDate: round2(consumedBeforeDate),
    consumedOnDate: round2(consumedOnDate),
    remainingWeekBudget: round2(remainingWeekBudget),
    availableToday: round2(rawDailyTarget - consumedOnDate),
  };
}

function getBudgetState(metric, daysToDistribute) {
  if (!daysToDistribute || metric.baseDailyTarget <= EPSILON) return null;
  if (metric.rawDailyTarget < -EPSILON) return 'exceeded';
  if (metric.rawDailyTarget <= EPSILON) return 'depleted';
  return null;
}

function getStatus(kcalMetric, daysToDistribute) {
  if (!daysToDistribute) return 'week_complete';
  if (getBudgetState(kcalMetric, daysToDistribute)) return 'weekly_budget_exhausted';
  if (kcalMetric.dailyAdjustment < -EPSILON) return 'reduced_target';
  if (kcalMetric.dailyAdjustment > EPSILON) return 'increased_target';
  return 'on_track';
}

/**
 * Calculates the target for a date without knowing anything about HTTP,
 * MongoDB or local time. `days` must contain the seven dates in week order and
 * `dayIndex` must point to the requested date.
 */
function calculateWeeklyCompensation({ date, days, dayIndex, targetWeek }) {
  if (!Array.isArray(days) || days.length === 0) {
    throw new Error('Weekly compensation requires daily totals');
  }
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex >= days.length) {
    throw new Error('Weekly compensation requires a valid day index');
  }

  const kcal = calculateMetric({
    weeklyTarget: targetWeek?.kcal,
    days,
    dayIndex,
    field: 'kcal',
  });
  const daysToDistribute = days.length - dayIndex;
  const daysAfterDate = Math.max(0, daysToDistribute - 1);

  const macros = {};
  for (const field of ['protein_g', 'carbs_g', 'fat_g']) {
    const metric = calculateMetric({
      weeklyTarget: targetWeek?.[field],
      days,
      dayIndex,
      field,
    });
    if (metric) {
      macros[field] = {
        ...metric,
        budgetState: getBudgetState(metric, daysToDistribute),
      };
    }
  }

  return {
    forDate: date,
    dayIndex,
    daysToDistribute,
    daysAfterDate,
    status: getStatus(kcal, daysToDistribute),
    budgetState: getBudgetState(kcal, daysToDistribute),
    baseDailyKcal: kcal.baseDailyTarget,
    rawDailyTargetKcal: kcal.rawDailyTarget,
    dailyAdjustmentKcal: kcal.dailyAdjustment,
    consumedBeforeDateKcal: kcal.consumedBeforeDate,
    consumedOnDateKcal: kcal.consumedOnDate,
    remainingWeekBudgetKcal: kcal.remainingWeekBudget,
    availableTodayKcal: kcal.availableToday,
    macros,
  };
}

module.exports = { calculateWeeklyCompensation };
