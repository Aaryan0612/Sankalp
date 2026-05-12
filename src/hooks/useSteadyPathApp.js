import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAILY_REALITY_OPTIONS,
  DAY_RULES,
  DRIFT_TRIGGERS,
  EXAM_SURVIVAL_MODE,
  REALITY_CHECK_LINES,
  RECOVERY_ACTIONS,
  SESSION_PRESETS
} from "../data/appContent";
import { buildHistoryInsights, deriveTodayPresentation, getActiveMode, invertPrimaryFocus, mergeDerivedEntry } from "../lib/accountability";
import { currentLocalHourBucket, daysUntilBirthday, displayDateForTimezone, isoDateForTimezone, timeNowForTimezone, weekdayForTimezone } from "../lib/date";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import {
  getBootData,
  insertProof,
  recomputeProgressState,
  replaceDriftLogs,
  saveEntry,
  updatePlannedDay,
  updateProfile,
  updateReminderPreferences
} from "../services/appService";

function createDefaultSession(key) {
  const preset = SESSION_PRESETS[key];
  if (!preset) return null;

  return {
    ...preset,
    startedAt: Date.now()
  };
}

function buildBootCacheKey(userId) {
  return `sankalp-boot-cache-${userId}`;
}

export function useSteadyPathApp() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem("steady-path-theme") || "light");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [activePage, setActivePage] = useState("today");
  const [profile, setProfile] = useState(null);
  const [entry, setEntry] = useState(null);
  const [proofs, setProofs] = useState([]);
  const [history, setHistory] = useState([]);
  const [driftLogs, setDriftLogs] = useState([]);
  const [driftHistory, setDriftHistory] = useState([]);
  const [selectedDrifts, setSelectedDrifts] = useState(new Set());
  const [streak, setStreak] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [reminders, setReminders] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [bannerMessage, setBannerMessage] = useState("");
  const [proofType, setProofType] = useState("note");
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [todayPlan, setTodayPlan] = useState(null);
  const [tomorrowPlan, setTomorrowPlan] = useState(null);
  const [plannedBigGoalText, setPlannedBigGoalText] = useState("");
  const [planningNote, setPlanningNote] = useState("");
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const [sessionAttachProof, setSessionAttachProof] = useState(false);
  const reminderIntervalRef = useRef(null);

  function applyBootData(data) {
    setProfile(data.profile);
    setEntry(data.entry);
    setProofs(data.proofs);
    setDriftLogs(data.driftLogs);
    setDriftHistory(data.driftHistory);
    setSelectedDrifts(new Set(data.driftLogs.map((item) => item.drift_trigger)));
    setHistory(data.history);
    setStreak(data.streak);
    setChallenge(data.challenge);
    setReminders(data.reminders);
    setTodayPlan(data.todayPlan);
    setTomorrowPlan(data.tomorrowPlan);
    setPlannedBigGoalText(data.tomorrowPlan?.planned_big_goal_text || "");
    setPlanningNote(data.tomorrowPlan?.planning_note || "");
  }

  useEffect(() => {
    document.body.classList.toggle("theme-light", theme === "light");
    window.localStorage.setItem("steady-path-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function bootstrapAuth() {
      const currentUrl = new URL(window.location.href);
      const authCode = currentUrl.searchParams.get("code");
      const authError = currentUrl.searchParams.get("error_description") || currentUrl.searchParams.get("error");

      try {
        if (authError && mounted) {
          setBootError(decodeURIComponent(authError));
        }

        if (authCode) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
          if (error) throw error;

          if (mounted) {
            setSession(data.session || null);
          }

          currentUrl.searchParams.delete("code");
          currentUrl.searchParams.delete("error");
          currentUrl.searchParams.delete("error_code");
          currentUrl.searchParams.delete("error_description");
          window.history.replaceState({}, document.title, currentUrl.pathname);
        }

        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) setBootError(error.message);
        setSession(data.session || null);
      } catch (error) {
        if (!mounted) return;
        setBootError(error.message || "Could not complete sign-in.");
        setSession(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user || !supabase) return;

    let cancelled = false;

    async function load() {
      const cacheKey = buildBootCacheKey(session.user.id);
      const cachedRaw = window.localStorage.getItem(cacheKey);
      let hasHydratedFromCache = false;

      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          if (!cancelled && cached?.entry && cached?.profile) {
            applyBootData(cached);
            setLoading(false);
            hasHydratedFromCache = true;
          }
        } catch {
          window.localStorage.removeItem(cacheKey);
        }
      }

      try {
        if (!hasHydratedFromCache) {
          setLoading(true);
        }
        const data = await getBootData(session.user);
        if (cancelled) return;
        applyBootData(data);
        window.localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (error) {
        if (!cancelled) {
          setBootError(error.message || "Failed to load app.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!entry || !profile || !reminders) return;
    if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);

    const pingReminders = () => {
      const today = isoDateForTimezone(profile.timezone);
      const hourMinute = timeNowForTimezone(profile.timezone);

      const slots = [
        { key: "morning", time: reminders.morning_reminder_time, text: "Set the anchor. Face aptitude before the day gets noisy." },
        { key: "exercise", time: reminders.exercise_reminder_time, text: "Move your body before the day slips away." },
        { key: "evening", time: reminders.evening_checkin_time, text: "Protect the streak. Close the day with evidence." }
      ];

      slots.forEach((slot) => {
        const cacheKey = `steady-path-reminder-${today}-${slot.key}`;
        if (hourMinute >= slot.time && sessionStorage.getItem(cacheKey) !== "1") {
          sessionStorage.setItem(cacheKey, "1");
          setBannerMessage(slot.text);
          if (reminders.notifications_enabled && "Notification" in window && Notification.permission === "granted") {
            new Notification("Sankalp", { body: slot.text });
          }
        }
      });
    };

    pingReminders();
    reminderIntervalRef.current = window.setInterval(pingReminders, 30000);

    return () => {
      if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    };
  }, [entry, profile, reminders]);

  const proofCount = proofs.length;
  const driftCount = driftLogs.length;
  const mode = entry ? getActiveMode(entry.date) : getActiveMode(isoDateForTimezone("Asia/Kolkata"));
  const currentTime = profile ? timeNowForTimezone(profile.timezone) : "12:00";
  const todayState = entry ? deriveTodayPresentation(entry, proofCount, driftCount, mode, currentTime) : null;
  const weekdayKey = profile ? weekdayForTimezone(profile.timezone) : "monday";
  const guidance = DAY_RULES[weekdayKey] || DAY_RULES.monday;
  const profileName = profile?.display_name || session?.user?.email?.split("@")[0] || "User";
  const dayPart = currentLocalHourBucket(profile?.timezone);
  const historyInsights = useMemo(() => buildHistoryInsights(history), [history]);
  const birthdayCountdown = useMemo(() => {
    if (!profile?.timezone) return null;
    return daysUntilBirthday(profile.timezone, 12, 6);
  }, [profile?.timezone]);

  const driftTrend = useMemo(() => {
    const counts = Object.fromEntries(DRIFT_TRIGGERS.map((item) => [item.key, 0]));
    driftHistory.forEach((item) => {
      counts[item.drift_trigger] = (counts[item.drift_trigger] || 0) + 1;
    });
    return counts;
  }, [driftHistory]);

  const recentSummary = useMemo(() => {
    return {
      full: historyInsights.strictDays,
      noZero: (history || []).filter((item) => item.no_zero_day_completed).length,
      minimum: historyInsights.savedDays
    };
  }, [history, historyInsights]);

  const realityCheckLine = useMemo(() => {
    if (!todayState || todayState.status !== "at_risk") return null;
    if (driftCount >= 2) return REALITY_CHECK_LINES[0];
    if (!entry?.primary_focus_completed && !entry?.secondary_continuity_completed) return REALITY_CHECK_LINES[1];
    if (!entry?.aptitude_completed && currentTime >= "18:00") return REALITY_CHECK_LINES[2];
    return null;
  }, [todayState, driftCount, entry, currentTime]);

  async function persistEntry(patch, overrides = {}) {
    if (!entry || !session || !profile) return;

    try {
      setSaveState("saving");
      const nextEntry = {
        ...entry,
        ...patch
      };

      if (patch.primary_focus_type) {
        nextEntry.secondary_continuity_type = invertPrimaryFocus(patch.primary_focus_type);
      }

      const nextProofCount = overrides.proofsCount ?? proofs.length;
      const nextDriftCount = overrides.driftCount ?? driftLogs.length;
      const data = await saveEntry(entry.id, nextEntry, nextProofCount, nextDriftCount);
      const merged = mergeDerivedEntry(
        {
          ...data,
          planned_big_goal_text: todayPlan?.planned_big_goal_text || "",
          planning_note: todayPlan?.planning_note || ""
        },
        nextProofCount,
        nextDriftCount,
        mode
      );
      setEntry(merged);
      const nextProgress = await recomputeProgressState({
        session,
        profile,
        nextEntry: merged,
        proofCount: nextProofCount,
        driftCount: nextDriftCount
      });
      setStreak(nextProgress.streak);
      setChallenge(nextProgress.challenge);
      setHistory((current) => {
        const filtered = current.filter((item) => item.date !== merged.date);
        return [merged, ...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 400);
      });
      if (session?.user?.id) {
        const cacheKey = buildBootCacheKey(session.user.id);
        window.localStorage.setItem(cacheKey, JSON.stringify({
          profile,
          entry: merged,
          proofs,
          driftLogs,
          driftHistory,
          history: [merged, ...history.filter((item) => item.date !== merged.date)].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 400),
          streak: nextProgress.streak,
          challenge: nextProgress.challenge,
          reminders,
          todayPlan,
          tomorrowPlan
        }));
      }
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1200);
      return merged;
    } catch (error) {
      setSaveState("error");
      setBannerMessage(error.message || "Could not save today.");
      throw error;
    }
  }

  async function handleDriftToggle(trigger) {
    if (!session || !entry) return;

    try {
      const next = new Set(selectedDrifts);
      if (next.has(trigger)) {
        next.delete(trigger);
      } else {
        next.add(trigger);
      }

      setSelectedDrifts(next);
      const nextDriftRows = await replaceDriftLogs({
        userId: session.user.id,
        date: entry.date,
        triggerKeys: Array.from(next)
      });

      setDriftLogs(nextDriftRows);
      setDriftHistory((current) => {
        const filtered = current.filter((item) => item.date !== entry.date);
        return [...filtered, ...nextDriftRows];
      });

      if (next.size > 0) {
        await persistEntry({ recovery_mode_used: true }, { driftCount: nextDriftRows.length });
        setBannerMessage("Recover the day. Choose one correction and get back into reality.");
      } else {
        await persistEntry({}, { driftCount: nextDriftRows.length });
      }
    } catch (error) {
      setBannerMessage(error.message || "Could not save drift triggers.");
    }
  }

  async function handleProofSubmit(event) {
    event.preventDefault();
    if (!session || !entry) return;

    try {
      const proof = await insertProof({
        userId: session.user.id,
        date: entry.date,
        proofType,
        proofText,
        proofUrl,
        proofFile
      });

      const nextProofs = [proof, ...proofs];
      setProofs(nextProofs);
      setProofText("");
      setProofUrl("");
      setProofFile(null);
      await persistEntry({ proof_submitted: true }, { proofsCount: nextProofs.length });
      setBannerMessage("Proof saved. Illusion loses power when the day leaves evidence.");
    } catch (error) {
      setBannerMessage(error.message || "Could not save proof.");
    }
  }

  async function handleReminderPrefChange(key, value) {
    if (!session || !reminders) return;
    const next = { ...reminders, [key]: value };
    setReminders(next);
    await updateReminderPreferences(session.user.id, next);
  }

  async function handleProfileSave(displayName) {
    if (!session || !profile) return;
    try {
      const nextProfile = await updateProfile(session.user.id, {
        display_name: displayName.trim() || "User"
      });
      setProfile(nextProfile);
      if (session?.user?.id) {
        const cacheKey = buildBootCacheKey(session.user.id);
        const cachedRaw = window.localStorage.getItem(cacheKey);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            window.localStorage.setItem(cacheKey, JSON.stringify({ ...cached, profile: nextProfile }));
          } catch {
            // ignore cache errors
          }
        }
      }
      setBannerMessage("Name updated.");
    } catch (error) {
      setBannerMessage(error.message || "Could not update profile.");
    }
  }

  async function requestNotifications() {
    if (!("Notification" in window)) {
      setBannerMessage("Browser notifications are not supported here.");
      return;
    }

    const result = await Notification.requestPermission();
    if (result === "granted") {
      setBannerMessage("Browser alerts are enabled while the app is open.");
      await handleReminderPrefChange("notifications_enabled", true);
    } else {
      setBannerMessage("Notifications were not allowed. In-app reminders will still work.");
      await handleReminderPrefChange("notifications_enabled", false);
    }
  }

  async function saveTomorrowAnchor() {
    if (!session || !profile) return;

    const tomorrow = addUtcDays(isoDateForTimezone(profile.timezone), 1);
    const nextPlan = await updatePlannedDay(session.user.id, tomorrow, plannedBigGoalText.trim(), planningNote.trim());
    setTomorrowPlan(nextPlan);
    setBannerMessage("Tomorrow now has an anchor.");
  }

  function beginSession(key) {
    const next = createDefaultSession(key);
    if (!next) return;
    setCurrentSession(next);
    setSessionNote("");
    setSessionAttachProof(false);
  }

  async function completeSession() {
    if (!currentSession || !entry) return;

    const patch = {};

    if (currentSession.key === "aptitude") patch.aptitude_completed = true;
    if (currentSession.key === "german") patch.german_completed = true;
    if (currentSession.key === "dsa") {
      if (entry.primary_focus_type === "dsa") {
        patch.primary_focus_completed = true;
      } else {
        patch.secondary_continuity_completed = true;
      }
    }
    if (currentSession.key === "react") {
      if (entry.primary_focus_type === "react") {
        patch.primary_focus_completed = true;
      } else {
        patch.secondary_continuity_completed = true;
      }
    }
    if (currentSession.key === "recovery") {
      patch.recovery_mode_used = true;
      patch.recovery_tier = "standard";
      patch.minimum_study_sprint_completed = true;
    }
    if (currentSession.key === "low_energy") {
      patch.recovery_mode_used = true;
      patch.recovery_tier = "low_energy";
      patch.minimum_study_sprint_completed = true;
    }

    if (sessionNote.trim()) {
      patch.notes = sessionNote.trim();
    }

    if (sessionAttachProof && sessionNote.trim() && session) {
      const proof = await insertProof({
        userId: session.user.id,
        date: entry.date,
        proofType: "note",
        proofText: sessionNote.trim(),
        proofUrl: "",
        proofFile: null
      });
      setProofs((current) => [proof, ...current]);
      await persistEntry(patch, { proofsCount: proofs.length + 1 });
    } else {
      await persistEntry(patch);
    }

    setCurrentSession(null);
    setSessionNote("");
    setSessionAttachProof(false);
    setBannerMessage("Session recorded. Evidence beats imagination.");
  }

  function cancelSession() {
    setCurrentSession(null);
    setSessionNote("");
    setSessionAttachProof(false);
  }

  async function selectRecoveryAction(action, tier = "standard") {
    await persistEntry({
      recovery_mode_used: true,
      recovery_tier: tier,
      recovery_action_key: action
    });
    setBannerMessage(tier === "low_energy" ? "Low-energy restart chosen. Keep it small and real." : "Course correction chosen. Protect the day now.");
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    if (!supabase) return;
    setAuthMessage("");

    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        setAuthMessage("Account created. If your project requires email confirmation, check your inbox.");
      }
    } catch (error) {
      setAuthMessage(error.message || "Authentication failed.");
    }
  }

  async function handleGoogleAuth() {
    if (!supabase) return;
    setAuthMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      setAuthMessage(error.message || "Google sign-in failed.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    if (session?.user?.id) {
      window.localStorage.removeItem(buildBootCacheKey(session.user.id));
    }
    setSession(null);
    setProfile(null);
    setEntry(null);
    setProofs([]);
    setDriftLogs([]);
    setDriftHistory([]);
    setHistory([]);
    setChallenge(null);
  }

  return {
    hasSupabaseConfig,
    loading,
    bootError,
    session,
    theme,
    setTheme,
    authMode,
    setAuthMode,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authMessage,
    activePage,
    setActivePage,
    birthdayCountdown,
    profile,
    profileName,
    dayPart,
    entry,
    setEntry,
    proofs,
    history,
    driftLogs,
    driftTrend,
    selectedDrifts,
    streak,
    challenge,
    reminders,
    saveState,
    bannerMessage,
    setBannerMessage,
    proofType,
    setProofType,
    proofText,
    setProofText,
    proofUrl,
    setProofUrl,
    proofFile,
    setProofFile,
    proofCount,
    driftCount,
    todayState,
    guidance,
    recentSummary,
    displayDate: profile ? displayDateForTimezone(profile.timezone) : "",
    mode,
    currentTime,
    currentSession,
    beginSession,
    completeSession,
    cancelSession,
    sessionNote,
    setSessionNote,
    sessionAttachProof,
    setSessionAttachProof,
    handleAuthSubmit,
    handleGoogleAuth,
    signOut,
    persistEntry,
    handleDriftToggle,
    handleProofSubmit,
    handleReminderPrefChange,
    handleProfileSave,
    requestNotifications,
    historyInsights,
    todayPlan,
    tomorrowPlan,
    plannedBigGoalText,
    setPlannedBigGoalText,
    planningNote,
    setPlanningNote,
    saveTomorrowAnchor,
    selectRecoveryAction,
    realityCheckLine,
    realityOptions: DAILY_REALITY_OPTIONS,
    recoveryActions: RECOVERY_ACTIONS,
    examModeMeta: EXAM_SURVIVAL_MODE
  };
}
