import { supabase } from "../lib/supabase";
import { computeFullDay, computeMinimumDay, computeNoZeroDay, computeRealityScore, computeSleepQualified, mergeDerivedEntry, buildStreakState } from "../lib/accountability";
import { isoDateForTimezone } from "../lib/date";

function buildEntryPayload(nextEntry, proofCount, driftCount) {
  return {
    big_goal_text: nextEntry.big_goal_text,
    big_goal_completed: nextEntry.big_goal_completed,
    study_build_completed: nextEntry.study_build_completed,
    exercise_completed: nextEntry.exercise_completed,
    sleep_time: nextEntry.sleep_time,
    wake_time: nextEntry.wake_time,
    sleep_qualified: computeSleepQualified(nextEntry),
    silent_time_minutes: nextEntry.silent_time_minutes,
    walk_without_headphones_completed: nextEntry.walk_without_headphones_completed,
    fantasy_detection_answer: nextEntry.fantasy_detection_answer,
    recovery_mode_used: nextEntry.recovery_mode_used,
    recovery_action_key: nextEntry.recovery_action_key,
    proof_submitted: proofCount > 0,
    reality_score: computeRealityScore(nextEntry, driftCount, proofCount),
    minimum_viable_day_completed: computeMinimumDay(nextEntry),
    minimum_build_completed: nextEntry.minimum_build_completed,
    minimum_pushups_completed: nextEntry.minimum_pushups_completed,
    minimum_no_porn_completed: nextEntry.minimum_no_porn_completed,
    minimum_sleep_before_midnight_completed: nextEntry.minimum_sleep_before_midnight_completed,
    no_zero_day_completed: computeNoZeroDay(nextEntry, proofCount),
    full_day_completed: computeFullDay(nextEntry),
    notes: nextEntry.notes ?? ""
  };
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
    await supabase
      .from("profiles")
      .update({ timezone })
      .eq("id", user.id);
  }

  await supabase.from("streak_state").upsert({
    user_id: user.id,
    weekly_grace_available: true,
    weekly_grace_last_reset_date: isoDateForTimezone(timezone)
  });

  await supabase.from("reminder_preferences").upsert({
    user_id: user.id
  });
}

export async function getBootData(user) {
  await ensureProfile(user);

  const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const timezone = profileRow?.timezone || "Asia/Kolkata";
  const today = isoDateForTimezone(timezone);

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
      study_build_completed: false,
      exercise_completed: false,
      sleep_time: null,
      wake_time: null,
      sleep_qualified: false,
      silent_time_minutes: 0,
      walk_without_headphones_completed: false,
      fantasy_detection_answer: "a_little",
      recovery_mode_used: false,
      recovery_action_key: null,
      proof_submitted: false,
      reality_score: 0,
      minimum_viable_day_completed: false,
      minimum_build_completed: false,
      minimum_pushups_completed: false,
      minimum_no_porn_completed: false,
      minimum_sleep_before_midnight_completed: false,
      no_zero_day_completed: false,
      full_day_completed: false,
      notes: ""
    };

    const { data: created } = await supabase.from("daily_entries").insert(seed).select("*").single();
    currentEntry = created;
  }

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 6);
  const driftSince = sinceDate.toISOString().slice(0, 10);

  const [
    { data: proofRows },
    { data: driftRows },
    { data: historyRows },
    { data: streakRow },
    { data: reminderRows },
    { data: driftHistoryRows }
  ] = await Promise.all([
    supabase.from("proof_entries").select("*").eq("user_id", user.id).eq("date", today).order("created_at", { ascending: false }),
    supabase.from("daily_drift_logs").select("*").eq("user_id", user.id).eq("date", today),
    supabase.from("daily_entries").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(21),
    supabase.from("streak_state").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("reminder_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("daily_drift_logs").select("*").eq("user_id", user.id).gte("date", driftSince)
  ]);

  const proofCount = (proofRows || []).length;
  const driftCount = (driftRows || []).length;

  return {
    profile: profileRow,
    entry: mergeDerivedEntry(currentEntry, proofCount, driftCount),
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
    }
  };
}

export async function saveEntry(entryId, nextEntry, proofCount, driftCount) {
  const payload = buildEntryPayload(nextEntry, proofCount, driftCount);

  const { data, error } = await supabase
    .from("daily_entries")
    .update(payload)
    .eq("id", entryId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function recomputeStreakState({ session, profile, nextEntry, proofCount, driftCount }) {
  const rows = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", session.user.id)
    .order("date", { ascending: false })
    .limit(120);

  const streakState = buildStreakState({
    historyRows: rows.data || [],
    nextEntry,
    proofsCount: proofCount,
    driftCount,
    timezone: profile.timezone,
    userId: session.user.id
  });

  await supabase.from("streak_state").upsert(streakState);
  return streakState;
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
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
