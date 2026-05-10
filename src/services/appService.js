import {
  buildChallengeState,
  buildStreakState,
  computeFullDay,
  computeMinimumDay,
  computeNoZeroDay,
  computeRealityScore,
  computeSleepQualified,
  getActiveMode,
  mergeDerivedEntry,
  invertPrimaryFocus
} from "../lib/accountability";
import { addUtcDays, isoDateForTimezone } from "../lib/date";
import { supabase } from "../lib/supabase";

function buildEntryPayload(nextEntry, proofCount, driftCount) {
  const mode = getActiveMode(nextEntry.date);

  return {
    big_goal_text: nextEntry.big_goal_text,
    big_goal_completed: nextEntry.big_goal_completed,
    aptitude_completed: nextEntry.aptitude_completed,
    primary_focus_type: nextEntry.primary_focus_type,
    primary_focus_completed: nextEntry.primary_focus_completed,
    secondary_continuity_type: nextEntry.secondary_continuity_type,
    secondary_continuity_completed: nextEntry.secondary_continuity_completed,
    german_completed: nextEntry.german_completed,
    sleep_time: nextEntry.sleep_time,
    wake_time: nextEntry.wake_time,
    sleep_qualified: computeSleepQualified(nextEntry, mode),
    silent_time_minutes: nextEntry.silent_time_minutes,
    walk_without_headphones_completed: nextEntry.walk_without_headphones_completed,
    fantasy_detection_answer: nextEntry.fantasy_detection_answer,
    daily_reality_check: nextEntry.daily_reality_check,
    recovery_mode_used: nextEntry.recovery_mode_used,
    recovery_tier: nextEntry.recovery_tier,
    recovery_action_key: nextEntry.recovery_action_key,
    proof_submitted: proofCount > 0,
    reality_score: computeRealityScore(nextEntry, driftCount, proofCount, mode),
    minimum_viable_day_completed: computeMinimumDay(nextEntry, mode),
    minimum_study_sprint_completed: nextEntry.minimum_study_sprint_completed,
    minimum_pushups_completed: nextEntry.minimum_pushups_completed,
    no_zero_day_completed: computeNoZeroDay(nextEntry, proofCount, mode),
    full_day_completed: computeFullDay(nextEntry, mode),
    notes: nextEntry.notes ?? ""
  };
}

function buildChallengePayload(historyRows, currentEntry, proofCount, driftCount, timezone, userId) {
  const merged = (historyRows || []).map((row) => (row.date === currentEntry.date ? mergeDerivedEntry(currentEntry, proofCount, driftCount) : row));
  return buildChallengeState(merged, timezone, userId);
}

export async function ensureProfile(user) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, timezone")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from("profiles").insert({
      id: user.id,
      display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
      timezone
    });
  } else if (existingProfile.timezone !== timezone) {
    await supabase.from("profiles").update({ timezone }).eq("id", user.id);
  }

  await supabase.from("streak_state").upsert({
    user_id: user.id,
    weekly_grace_available: false,
    weekly_grace_last_reset_date: isoDateForTimezone(timezone)
  });

  await supabase.from("reminder_preferences").upsert({
    user_id: user.id
  });

  await supabase.from("challenge_state").upsert({
    user_id: user.id,
    challenge_start_date: "2026-05-11",
    challenge_day_number: 1,
    strict_days_completed: 0,
    saved_days: 0,
    missed_days: 0,
    status: "active"
  });
}

export async function getBootData(user) {
  await ensureProfile(user);

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const timezone = profileRow?.timezone || "Asia/Kolkata";
  const today = isoDateForTimezone(timezone);
  const tomorrow = addUtcDays(today, 1);
  const mode = getActiveMode(today);

  const { data: existingEntry } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  let currentEntry = existingEntry;

  if (!currentEntry) {
    const seed = {
      user_id: user.id,
      date: today,
      big_goal_text: "",
      big_goal_completed: false,
      aptitude_completed: false,
      primary_focus_type: "dsa",
      primary_focus_completed: false,
      secondary_continuity_type: "react",
      secondary_continuity_completed: false,
      german_completed: false,
      sleep_time: null,
      wake_time: null,
      sleep_qualified: false,
      silent_time_minutes: 0,
      walk_without_headphones_completed: false,
      fantasy_detection_answer: "a_little",
      daily_reality_check: "nothing",
      recovery_mode_used: false,
      recovery_tier: null,
      recovery_action_key: null,
      proof_submitted: false,
      reality_score: 0,
      minimum_viable_day_completed: false,
      minimum_study_sprint_completed: false,
      minimum_pushups_completed: false,
      no_zero_day_completed: false,
      full_day_completed: false,
      notes: ""
    };

    const { data: created } = await supabase.from("daily_entries").insert(seed).select("*").single();
    currentEntry = created;
  }

  const sinceDate = addUtcDays(today, -29);

  const [
    { data: proofRows },
    { data: driftRows },
    { data: historyRows },
    { data: streakRow },
    { data: reminderRows },
    { data: driftHistoryRows },
    { data: todayPlanRow },
    { data: tomorrowPlanRow },
    { data: challengeRow }
  ] = await Promise.all([
    supabase.from("proof_entries").select("*").eq("user_id", user.id).eq("date", today).order("created_at", { ascending: false }),
    supabase.from("daily_drift_logs").select("*").eq("user_id", user.id).eq("date", today),
    supabase.from("daily_entries").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(60),
    supabase.from("streak_state").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("reminder_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("daily_drift_logs").select("*").eq("user_id", user.id).gte("date", sinceDate),
    supabase.from("planned_days").select("*").eq("user_id", user.id).eq("date", today).maybeSingle(),
    supabase.from("planned_days").select("*").eq("user_id", user.id).eq("date", tomorrow).maybeSingle(),
    supabase.from("challenge_state").select("*").eq("user_id", user.id).maybeSingle()
  ]);

  const proofCount = (proofRows || []).length;
  const driftCount = (driftRows || []).length;

  const mergedEntry = mergeDerivedEntry(
    {
      ...currentEntry,
      primary_focus_type: currentEntry.primary_focus_type || "dsa",
      secondary_continuity_type: currentEntry.secondary_continuity_type || invertPrimaryFocus(currentEntry.primary_focus_type || "dsa"),
      planned_big_goal_text: todayPlanRow?.planned_big_goal_text || "",
      planning_note: todayPlanRow?.planning_note || ""
    },
    proofCount,
    driftCount,
    mode
  );

  return {
    profile: profileRow,
    entry: mergedEntry,
    proofs: proofRows || [],
    driftLogs: driftRows || [],
    driftHistory: driftHistoryRows || [],
    history: historyRows || [],
    streak: streakRow || null,
    reminders: reminderRows || {
      morning_reminder_time: "07:30",
      exercise_reminder_time: "18:00",
      evening_checkin_time: "21:30",
      notifications_enabled: false
    },
    todayPlan: todayPlanRow || null,
    tomorrowPlan: tomorrowPlanRow || null,
    challenge: challengeRow || buildChallengePayload(historyRows || [], mergedEntry, proofCount, driftCount, timezone, user.id),
    mode
  };
}

export async function saveEntry(entryId, nextEntry, proofCount, driftCount) {
  const payload = buildEntryPayload(nextEntry, proofCount, driftCount);

  const { data, error } = await supabase.from("daily_entries").update(payload).eq("id", entryId).select("*").single();

  if (error) throw error;
  return data;
}

export async function recomputeProgressState({ session, profile, nextEntry, proofCount, driftCount }) {
  const rows = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", session.user.id)
    .order("date", { ascending: false })
    .limit(120);

  const historyRows = rows.data || [];

  const streakState = buildStreakState({
    historyRows,
    nextEntry,
    proofsCount: proofCount,
    driftCount,
    timezone: profile.timezone,
    userId: session.user.id
  });

  const challengeState = buildChallengePayload(historyRows, nextEntry, proofCount, driftCount, profile.timezone, session.user.id);

  await Promise.all([
    supabase.from("streak_state").upsert(streakState),
    supabase.from("challenge_state").upsert(challengeState)
  ]);

  return { streak: streakState, challenge: challengeState };
}

export async function replaceDriftLogs({ userId, date, triggerKeys }) {
  await supabase.from("daily_drift_logs").delete().eq("user_id", userId).eq("date", date);

  if (triggerKeys.length) {
    await supabase.from("daily_drift_logs").insert(
      triggerKeys.map((trigger) => ({
        user_id: userId,
        date,
        drift_trigger: trigger
      }))
    );
  }

  const { data } = await supabase.from("daily_drift_logs").select("*").eq("user_id", userId).eq("date", date);
  return data || [];
}

export async function insertProof({ userId, date, proofType, proofText, proofUrl, proofFile }) {
  const payload = {
    user_id: userId,
    date,
    proof_type: proofType,
    storage_path: null,
    external_url: null,
    text_content: null
  };

  if (proofType === "note") {
    payload.text_content = proofText.trim();
  } else if (proofType === "github_link") {
    payload.external_url = proofUrl.trim();
  } else if ((proofType === "photo" || proofType === "screenshot") && proofFile) {
    const filePath = `${userId}/${date}/${Date.now()}-${proofFile.name}`;
    const { error: uploadError } = await supabase.storage.from("proof-of-day").upload(filePath, proofFile, { upsert: false });
    if (uploadError) throw uploadError;
    payload.storage_path = filePath;
  } else {
    throw new Error("Add proof content before submitting.");
  }

  const { data, error } = await supabase.from("proof_entries").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateReminderPreferences(userId, reminders) {
  await supabase.from("reminder_preferences").upsert({
    user_id: userId,
    ...reminders
  });
}

export async function updateProfile(userId, patch) {
  const { data, error } = await supabase.from("profiles").update(patch).eq("id", userId).select("*").single();

  if (error) throw error;
  return data;
}

export async function updatePlannedDay(userId, date, plannedBigGoalText, planningNote) {
  const { data, error } = await supabase
    .from("planned_days")
    .upsert({
      user_id: userId,
      date,
      planned_big_goal_text: plannedBigGoalText,
      planning_note: planningNote
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
