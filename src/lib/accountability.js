import { addUtcDays, isoDateForTimezone, startOfWeekIso } from "./date";

export const EXAM_SURVIVAL_START = "2026-05-11";
export const EXAM_SURVIVAL_END = "2026-06-27";
export const CHALLENGE_LENGTH_DAYS = 30;

export function safeTimeCompare(timeValue, threshold) {
  if (!timeValue) return false;
  return timeValue <= threshold;
}

export function invertPrimaryFocus(primaryFocusType) {
  return primaryFocusType === "react" ? "dsa" : "react";
}

export function getActiveMode(dateString) {
  if (dateString >= EXAM_SURVIVAL_START && dateString <= EXAM_SURVIVAL_END) {
    return {
      type: "exam_survival",
      startsAt: EXAM_SURVIVAL_START,
      endsAt: EXAM_SURVIVAL_END,
      strictTasks: ["aptitude", "sleep", "primary_focus", "secondary_continuity"]
    };
  }

  return {
    type: "standard"
  };
}

export function computeSleepQualified(entry, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  const threshold = mode.type === "exam_survival" ? "01:00" : "23:30";
  return safeTimeCompare(entry.sleep_time || "", threshold);
}

export function computeMinimumDay(entry, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  const threshold = mode.type === "exam_survival" ? "01:00" : "24:00";
  return Boolean(
    entry.minimum_study_sprint_completed &&
      entry.minimum_pushups_completed &&
      safeTimeCompare(entry.sleep_time || "", threshold)
  );
}

export function computeFullDay(entry, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  if (mode.type === "exam_survival") {
    return Boolean(
      entry.big_goal_text?.trim() &&
        entry.aptitude_completed &&
        entry.primary_focus_completed &&
        entry.secondary_continuity_completed &&
        computeSleepQualified(entry, mode)
    );
  }

  return Boolean(
    entry.big_goal_completed &&
      entry.study_build_completed &&
      entry.exercise_completed &&
      computeSleepQualified(entry, mode)
  );
}

export function computeNoZeroDay(entry, proofCount, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  if (proofCount > 0 || computeMinimumDay(entry, mode)) return true;

  if (mode.type === "exam_survival") {
    return Boolean(
      entry.aptitude_completed ||
        entry.primary_focus_completed ||
        entry.secondary_continuity_completed ||
        entry.german_completed
    );
  }

  return Boolean(entry.study_build_completed || entry.exercise_completed);
}

export function computeRealityScore(entry, driftCount, proofCount, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  let score = 0;

  if (mode.type === "exam_survival") {
    if (entry.big_goal_text?.trim()) score += 6;
    if (entry.big_goal_completed) score += 10;
    if (entry.aptitude_completed) score += 22;
    if (entry.primary_focus_completed) score += 22;
    if (entry.secondary_continuity_completed) score += 12;
    if (computeSleepQualified(entry, mode)) score += 15;
    if (entry.german_completed) score += 4;
    if ((entry.silent_time_minutes || 0) >= 20) score += 6;
    if (proofCount > 0) score += 10;
    if (entry.daily_reality_check && entry.daily_reality_check !== "nothing") score += 4;
  } else {
    if (entry.big_goal_completed) score += 25;
    if (entry.study_build_completed) score += 20;
    if (entry.exercise_completed) score += 20;
    if (computeSleepQualified(entry, mode)) score += 15;
    if ((entry.silent_time_minutes || 0) >= 20) score += 10;
    if (proofCount > 0) score += 10;
  }

  score -= driftCount * 6;

  if (entry.fantasy_detection_answer === "yes") score -= 10;
  if (entry.fantasy_detection_answer === "a_little") score -= 4;
  if (entry.daily_reality_check === "nothing") score -= 8;

  return Math.max(0, Math.min(100, score));
}

export function getTodayState(entry, proofCount, driftCount, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  const full = computeFullDay(entry, mode);
  const min = computeMinimumDay(entry, mode) || entry.minimum_viable_day_completed;
  const noZero = computeNoZeroDay(entry, proofCount, mode);

  if (full) {
    return {
      full,
      min,
      noZero,
      sleepQualified: computeSleepQualified(entry, mode),
      realityScore: computeRealityScore(entry, driftCount, proofCount, mode),
      outcome: "full_success"
    };
  }

  if (min) {
    return {
      full,
      min,
      noZero,
      sleepQualified: computeSleepQualified(entry, mode),
      realityScore: computeRealityScore(entry, driftCount, proofCount, mode),
      outcome: "saved"
    };
  }

  if (noZero) {
    return {
      full,
      min,
      noZero,
      sleepQualified: computeSleepQualified(entry, mode),
      realityScore: computeRealityScore(entry, driftCount, proofCount, mode),
      outcome: "no_zero"
    };
  }

  return {
    full,
    min,
    noZero,
    sleepQualified: computeSleepQualified(entry, mode),
    realityScore: computeRealityScore(entry, driftCount, proofCount, mode),
    outcome: "miss"
  };
}

export function deriveTodayPresentation(entry, proofCount, driftCount, mode, currentTime = "12:00") {
  const state = getTodayState(entry, proofCount, driftCount, mode);
  const currentHour = Number((currentTime || "12:00").split(":")[0]);

  if (state.outcome === "full_success") {
    return {
      ...state,
      status: "alive",
      closure: "Day secured.",
      protectable: false,
      protectMessage: "Evidence recorded."
    };
  }

  if (state.outcome === "saved") {
    return {
      ...state,
      status: "saved",
      closure: "Continuity protected.",
      protectable: false,
      protectMessage: "The full streak is gone for today, but the day was not wasted."
    };
  }

  const incompleteAptitude = !entry.aptitude_completed;
  const incompletePrimary = !entry.primary_focus_completed;
  const incompleteContinuity = !entry.secondary_continuity_completed;
  const incompleteSleep = !computeSleepQualified(entry, mode);

  const missing = [];

  if (incompleteAptitude) missing.push("aptitude");
  if (incompletePrimary) missing.push(entry.primary_focus_type === "react" ? "React deep session" : "DSA deep session");
  if (incompleteContinuity) missing.push(entry.secondary_continuity_type === "react" ? "React proof" : "DSA proof");
  if (incompleteSleep) missing.push("sleep target");

  const protectable = currentHour < 24 && missing.length > 0;

  if (currentHour >= 23 && !state.noZero) {
    return {
      ...state,
      status: "broken",
      closure: "Continuity broke. Begin again today.",
      protectable: false,
      protectMessage: "Do not disappear. Use the next morning to restart cleanly."
    };
  }

  if (protectable && (currentHour >= 19 || missing.length >= 2)) {
    return {
      ...state,
      status: "at_risk",
      closure: null,
      protectable: true,
      protectMessage: `The streak is still protectable. Complete ${missing.slice(0, 2).join(" and ")} to keep today alive.`
    };
  }

  return {
    ...state,
    status: "alive",
    closure: null,
    protectable: true,
    protectMessage: `One focused session can still save today. ${missing.length ? `Current gap: ${missing[0]}.` : ""}`.trim()
  };
}

export function mergeDerivedEntry(entry, proofCount, driftCount, mode = getActiveMode(entry?.date || isoDateForTimezone("Asia/Kolkata"))) {
  const state = getTodayState(entry, proofCount, driftCount, mode);
  return {
    ...entry,
    primary_focus_type: entry.primary_focus_type || "dsa",
    secondary_continuity_type: entry.secondary_continuity_type || invertPrimaryFocus(entry.primary_focus_type || "dsa"),
    sleep_qualified: state.sleepQualified,
    reality_score: state.realityScore,
    minimum_viable_day_completed: state.min,
    no_zero_day_completed: state.noZero,
    full_day_completed: state.full,
    proof_submitted: proofCount > 0
  };
}

export function buildStreakState({ historyRows, nextEntry, proofsCount, driftCount, timezone, userId }) {
  const mode = getActiveMode(nextEntry.date);
  const mergedDays = (historyRows || [])
    .map((row) => {
      if (row.date === nextEntry.date) {
        return mergeDerivedEntry(nextEntry, proofsCount, driftCount, mode);
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

  allDays.forEach((row) => {
    if (row.full_day_completed) {
      currentFull += 1;
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

  return {
    user_id: userId,
    full_streak: currentFull,
    best_full_streak: Math.max(bestFullStreak, currentFull),
    no_zero_day_streak: currentNoZero,
    identity_save_count: identitySaveCount,
    weekly_grace_available: false,
    weekly_grace_last_reset_date: startOfWeekIso(today),
    last_success_date: allDays.filter((row) => row.full_day_completed).slice(-1)[0]?.date || null
  };
}

export function buildChallengeState(historyRows, timezone, userId) {
  const today = isoDateForTimezone(timezone);
  const challengeStartDate = EXAM_SURVIVAL_START;
  const endDate = addUtcDays(challengeStartDate, CHALLENGE_LENGTH_DAYS - 1);
  const relevantRows = (historyRows || []).filter((row) => row.date >= challengeStartDate && row.date <= endDate);

  let strictDaysCompleted = 0;
  let savedDays = 0;
  let missedDays = 0;

  for (let cursor = challengeStartDate; cursor <= endDate && cursor <= today; cursor = addUtcDays(cursor, 1)) {
    const row = relevantRows.find((item) => item.date === cursor);
    if (!row) {
      missedDays += 1;
      continue;
    }

    if (row.full_day_completed) {
      strictDaysCompleted += 1;
    } else if (row.minimum_viable_day_completed) {
      savedDays += 1;
    } else if (row.no_zero_day_completed) {
      missedDays += 1;
    } else {
      missedDays += 1;
    }
  }

  const challengeDayNumber = Math.min(
    CHALLENGE_LENGTH_DAYS,
    Math.max(1, dateDiffDays(challengeStartDate, today) + 1)
  );

  return {
    user_id: userId,
    challenge_start_date: challengeStartDate,
    challenge_day_number: challengeDayNumber,
    strict_days_completed: strictDaysCompleted,
    saved_days: savedDays,
    missed_days: missedDays,
    status: today > endDate ? "completed" : "active"
  };
}

export function buildHistoryInsights(historyRows = []) {
  const sorted = [...historyRows].sort((a, b) => a.date.localeCompare(b.date));
  const recent30 = sorted.slice(-30);
  const recentTimeline = recent30.map((row) => ({
    date: row.date,
    realityScore: row.reality_score || 0,
    outcome: row.full_day_completed
      ? "full_success"
      : row.minimum_viable_day_completed
        ? "saved"
        : row.no_zero_day_completed
          ? "no_zero"
          : "miss"
  }));

  let strictDays = 0;
  let savedDays = 0;
  let misses = 0;
  let recoveryStreak = 0;
  let maxRecoveryStreak = 0;
  let bounceBackRecoveries = 0;
  let bounceBackMisses = 0;
  let fastestRecoveryAfterMiss = null;
  let pendingMissIndex = null;

  recentTimeline.forEach((item, index) => {
    if (item.outcome === "full_success") strictDays += 1;
    if (item.outcome === "saved") savedDays += 1;
    if (item.outcome === "miss") misses += 1;

    if (item.outcome === "saved" || item.outcome === "full_success") {
      recoveryStreak += 1;
      maxRecoveryStreak = Math.max(maxRecoveryStreak, recoveryStreak);
    } else {
      recoveryStreak = 0;
    }

    if (pendingMissIndex !== null && item.outcome !== "miss") {
      bounceBackRecoveries += 1;
      fastestRecoveryAfterMiss =
        fastestRecoveryAfterMiss === null
          ? index - pendingMissIndex
          : Math.min(fastestRecoveryAfterMiss, index - pendingMissIndex);
      pendingMissIndex = null;
    }

    if (item.outcome === "miss") {
      bounceBackMisses += 1;
      pendingMissIndex = index;
    }
  });

  return {
    recentTimeline,
    strictDays,
    savedDays,
    misses,
    fastestRecoveryAfterMiss,
    recoveryStreak: maxRecoveryStreak,
    bounceBackRate: bounceBackMisses ? Math.round((bounceBackRecoveries / bounceBackMisses) * 100) : 0
  };
}

export function dateDiffDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86400000);
}
