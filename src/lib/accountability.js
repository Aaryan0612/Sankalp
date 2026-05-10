import { addUtcDays, isoDateForTimezone, startOfWeekIso } from "./date";

export function safeTimeCompare(timeValue, threshold) {
  if (!timeValue) return false;
  return timeValue <= threshold;
}

export function computeSleepQualified(entry) {
  return safeTimeCompare(entry.sleep_time || "", "23:30");
}

export function computeMinimumDay(entry) {
  return Boolean(
    entry.minimum_build_completed &&
      entry.minimum_pushups_completed &&
      entry.minimum_no_porn_completed &&
      safeTimeCompare(entry.sleep_time || "", "24:00")
  );
}

export function computeFullDay(entry) {
  return Boolean(
    entry.big_goal_completed &&
      entry.study_build_completed &&
      entry.exercise_completed &&
      computeSleepQualified(entry)
  );
}

export function computeNoZeroDay(entry, proofCount) {
  return Boolean(
    proofCount > 0 ||
      entry.minimum_build_completed ||
      entry.study_build_completed ||
      entry.exercise_completed ||
      computeMinimumDay(entry)
  );
}

export function computeRealityScore(entry, driftCount, proofCount) {
  let score = 0;

  if (entry.big_goal_completed) score += 25;
  if (entry.study_build_completed) score += 20;
  if (entry.exercise_completed) score += 20;
  if (computeSleepQualified(entry)) score += 15;
  if ((entry.silent_time_minutes || 0) >= 20) score += 10;
  if (proofCount > 0) score += 10;

  score -= driftCount * 6;

  if (entry.fantasy_detection_answer === "yes") score -= 10;
  if (entry.fantasy_detection_answer === "a_little") score -= 4;

  return Math.max(0, Math.min(100, score));
}

export function getTodayState(entry, proofCount, driftCount) {
  const full = computeFullDay(entry);
  const min = computeMinimumDay(entry) || entry.minimum_viable_day_completed;
  const noZero = computeNoZeroDay(entry, proofCount);

  if (full) {
    return {
      full,
      min,
      noZero,
      sleepQualified: computeSleepQualified(entry),
      realityScore: computeRealityScore(entry, driftCount, proofCount),
      status: "full_success"
    };
  }

  if (min || noZero) {
    return {
      full,
      min,
      noZero,
      sleepQualified: computeSleepQualified(entry),
      realityScore: computeRealityScore(entry, driftCount, proofCount),
      status: "minimum_day"
    };
  }

  return {
    full,
    min,
    noZero,
    sleepQualified: computeSleepQualified(entry),
    realityScore: computeRealityScore(entry, driftCount, proofCount),
    status: "miss"
  };
}

export function mergeDerivedEntry(entry, proofCount, driftCount) {
  const state = getTodayState(entry, proofCount, driftCount);
  return {
    ...entry,
    sleep_qualified: state.sleepQualified,
    reality_score: state.realityScore,
    minimum_viable_day_completed: state.min,
    no_zero_day_completed: state.noZero,
    full_day_completed: state.full,
    proof_submitted: proofCount > 0
  };
}

export function buildStreakState({ historyRows, nextEntry, proofsCount, driftCount, timezone, userId }) {
  const mergedDays = (historyRows || [])
    .map((row) => {
      if (row.date === nextEntry.date) {
        return mergeDerivedEntry(nextEntry, proofsCount, driftCount);
      }
      return row;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const today = isoDateForTimezone(timezone);
  const firstTrackedDate = mergedDays[0]?.date || today;
  const dayMap = new Map(mergedDays.map((row) => [row.date, row]));
  const allDays = [];

  for (let cursor = firstTrackedDate; cursor <= today; cursor = addUtcDays(cursor, 1)) {
    allDays.push(
      dayMap.get(cursor) || {
        date: cursor,
        full_day_completed: false,
        no_zero_day_completed: false,
        minimum_viable_day_completed: false
      }
    );
  }

  let bestFullStreak = 0;
  let currentFull = 0;
  let currentNoZero = 0;
  let identitySaveCount = 0;
  let workingWeek = null;
  let graceUsedThisWeek = false;

  allDays.forEach((row) => {
    const weekStart = startOfWeekIso(row.date);
    if (workingWeek !== weekStart) {
      workingWeek = weekStart;
      graceUsedThisWeek = false;
    }

    if (row.full_day_completed) {
      currentFull += 1;
    } else if (!graceUsedThisWeek) {
      graceUsedThisWeek = true;
    } else {
      currentFull = 0;
    }

    bestFullStreak = Math.max(bestFullStreak, currentFull);

    if (row.no_zero_day_completed) {
      currentNoZero += 1;
    } else {
      currentNoZero = 0;
    }

    if (row.minimum_viable_day_completed && !row.full_day_completed) {
      identitySaveCount += 1;
    }
  });

  const currentWeekStart = startOfWeekIso(today);
  const currentWeekRows = allDays.filter((row) => startOfWeekIso(row.date) === currentWeekStart);
  const currentWeekMisses = currentWeekRows.filter((row) => !row.full_day_completed).length;

  return {
    user_id: userId,
    full_streak: currentFull,
    best_full_streak: Math.max(bestFullStreak, currentFull),
    no_zero_day_streak: currentNoZero,
    identity_save_count: identitySaveCount,
    weekly_grace_available: currentWeekMisses === 0,
    weekly_grace_last_reset_date: currentWeekStart,
    last_success_date: allDays.filter((row) => row.full_day_completed).slice(-1)[0]?.date || null
  };
}
