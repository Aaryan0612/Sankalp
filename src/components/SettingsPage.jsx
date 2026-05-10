import { AlarmClock, Focus } from "lucide-react";

export default function SettingsPage({ reminders, handleReminderPrefChange }) {
  return (
    <div className="main-stack">
      <section className="panel">
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

      <section className="panel">
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
    </div>
  );
}
