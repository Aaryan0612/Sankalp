import { useEffect, useMemo, useRef, useState } from "react";
import { DAY_RULES, DRIFT_TRIGGERS } from "../data/appContent";
import { getTodayState } from "../lib/accountability";
import { currentLocalHourBucket, displayDateForTimezone, isoDateForTimezone, timeNowForTimezone, weekdayForTimezone } from "../lib/date";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { getBootData, insertProof, recomputeStreakState, replaceDriftLogs, saveEntry, updateReminderPreferences } from "../services/appService";

export function useSteadyPathApp() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem("steady-path-theme") || "dark");
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
  const [reminders, setReminders] = useState(null);
  const [saveState, setSaveState] = useState("idle");
  const [bannerMessage, setBannerMessage] = useState("");
  const [proofType, setProofType] = useState("note");
  const [proofText, setProofText] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const reminderIntervalRef = useRef(null);

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
      try {
        setLoading(true);
        const data = await getBootData(session.user);
        if (cancelled) return;
        setProfile(data.profile);
        setEntry(data.entry);
        setProofs(data.proofs);
        setDriftLogs(data.driftLogs);
        setDriftHistory(data.driftHistory);
        setSelectedDrifts(new Set(data.driftLogs.map((item) => item.drift_trigger)));
        setHistory(data.history);
        setStreak(data.streak);
        setReminders(data.reminders);
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
        { key: "morning", time: reminders.morning_reminder_time, text: "Set your one big goal and check today’s grounding." },
        { key: "exercise", time: reminders.exercise_reminder_time, text: "Move your body before the day slips away." },
        { key: "evening", time: reminders.evening_checkin_time, text: "Finish the strict tasks before the day closes." }
      ];

      slots.forEach((slot) => {
        const cacheKey = `steady-path-reminder-${today}-${slot.key}`;
        if (hourMinute >= slot.time && sessionStorage.getItem(cacheKey) !== "1") {
          sessionStorage.setItem(cacheKey, "1");
          setBannerMessage(slot.text);
          if (reminders.notifications_enabled && "Notification" in window && Notification.permission === "granted") {
            new Notification("The Steady Path", { body: slot.text });
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
  const todayState = entry ? getTodayState(entry, proofCount, driftCount) : null;
  const weekdayKey = profile ? weekdayForTimezone(profile.timezone) : "monday";
  const guidance = DAY_RULES[weekdayKey] || DAY_RULES.monday;
  const profileName = profile?.display_name || session?.user?.email?.split("@")[0] || "User";
  const dayPart = currentLocalHourBucket();

  const driftTrend = useMemo(() => {
    const counts = Object.fromEntries(DRIFT_TRIGGERS.map((item) => [item.key, 0]));
    driftHistory.forEach((item) => {
      counts[item.drift_trigger] = (counts[item.drift_trigger] || 0) + 1;
    });
    return counts;
  }, [driftHistory]);

  const recentSummary = useMemo(() => {
    if (!history.length) return { full: 0, noZero: 0, minimum: 0 };

    return history.reduce(
      (acc, item) => {
        if (item.full_day_completed) acc.full += 1;
        if (item.no_zero_day_completed) acc.noZero += 1;
        if (item.minimum_viable_day_completed) acc.minimum += 1;
        return acc;
      },
      { full: 0, noZero: 0, minimum: 0 }
    );
  }, [history]);

  async function persistEntry(patch, overrides = {}) {
    if (!entry || !session || !profile) return;

    try {
      setSaveState("saving");
      const nextEntry = { ...entry, ...patch };
      const nextProofCount = overrides.proofsCount ?? proofs.length;
      const nextDriftCount = overrides.driftCount ?? driftLogs.length;
      const data = await saveEntry(entry.id, nextEntry, nextProofCount, nextDriftCount);
      setEntry(data);
      const nextStreak = await recomputeStreakState({
        session,
        profile,
        nextEntry: data,
        proofCount: nextProofCount,
        driftCount: nextDriftCount
      });
      setStreak(nextStreak);
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1200);
    } catch (error) {
      setSaveState("error");
      setBannerMessage(error.message || "Could not save today.");
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
        setBannerMessage("Recover the day. Do the next right thing now.");
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
    setSession(null);
    setProfile(null);
    setEntry(null);
    setProofs([]);
    setDriftLogs([]);
    setDriftHistory([]);
    setHistory([]);
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
    handleAuthSubmit,
    handleGoogleAuth,
    signOut,
    persistEntry,
    handleDriftToggle,
    handleProofSubmit,
    handleReminderPrefChange,
    requestNotifications
  };
}
