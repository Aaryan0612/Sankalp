import { AlarmClock, Focus, LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage({ reminders, handleReminderPrefChange, profile, handleProfileSave, signOut }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");

  useEffect(() => {
    setDisplayName(profile?.display_name || "");
  }, [profile]);

  return (
    <div className="main-stack">
      <section className="panel tone-cream">
        <div className="section-label">Profile</div>
        <h2 className="section-title">Choose how your name appears in the workspace.</h2>
        <div className="inline-badge">
          <UserRound size={16} strokeWidth={2.2} />
          Personal identity
        </div>
        <div className="field-grid profile-grid">
          <div className="field-stack">
            <label>Display name</label>
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Enter your name or username" />
          </div>
          <div className="form-actions settings-actions">
            <button className="primary-btn" type="button" onClick={() => handleProfileSave(displayName)}>
              Save name
            </button>
          </div>
        </div>
      </section>

      <section className="panel tone-neutral">
        <div className="section-label">Reminders</div>
        <h2 className="section-title">Keep them useful, not noisy.</h2>
        <div className="inline-badge">
          <AlarmClock size={16} strokeWidth={2.2} />
          Open-app browser reminders only in v1
        </div>
        <div className="field-grid">
          <div className="field-stack">
            <label>Morning reminder</label>
            <input
              type="time"
              value={reminders?.morning_reminder_time || "07:30"}
              onChange={(event) => handleReminderPrefChange("morning_reminder_time", event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label>Exercise reminder</label>
            <input
              type="time"
              value={reminders?.exercise_reminder_time || "18:00"}
              onChange={(event) => handleReminderPrefChange("exercise_reminder_time", event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label>Evening check-in</label>
            <input
              type="time"
              value={reminders?.evening_checkin_time || "21:30"}
              onChange={(event) => handleReminderPrefChange("evening_checkin_time", event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="panel tone-lavender">
        <div className="section-label">Mission mode</div>
        <h2 className="section-title">Reserved for a future focused mode system.</h2>
        <div className="inline-badge">
          <Focus size={16} strokeWidth={2.2} />
          Future layer
        </div>
        <p className="section-copy">
          This version leaves room for exam mode, dopamine detox week, deep work week, and fitness reset week without forcing them into v1.
        </p>
      </section>

      <section className="panel tone-neutral">
        <div className="section-label">Session</div>
        <h2 className="section-title">Manage your account access.</h2>
        <p className="section-copy">Sign out from here when you want to end the session on this device.</p>
        <div className="form-actions">
          <button className="ghost-btn" type="button" onClick={signOut}>
            <LogOut size={16} strokeWidth={2.2} />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
