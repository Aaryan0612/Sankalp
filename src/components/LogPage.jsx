import { Bell, BookOpen, Brain, Footprints, Goal, MoonStar, ShieldAlert, Swords, Target, TimerReset } from "lucide-react";
import { DAILY_REALITY_OPTIONS, DRIFT_TRIGGERS, EXAM_SURVIVAL_SUBJECTS } from "../data/appContent";

function TaskCard({ icon, title, description, meta, completed, onToggle, onBegin }) {
  return (
    <div className="exam-task-card">
      <div className="exam-task-head">
        <div className="task-chip">{icon}{title}</div>
        <button className={`toggle ${completed ? "active" : ""}`} onClick={onToggle}>
          {completed ? "Done" : "Pending"}
        </button>
      </div>
      <div className="task-meta">{meta}</div>
      <p className="task-description">{description}</p>
      <div className="exam-task-actions">
        <button className="ghost-btn" type="button" onClick={onBegin}>
          Begin
        </button>
      </div>
    </div>
  );
}

export default function LogPage({
  saveState,
  bannerMessage,
  todayState,
  entry,
  setEntry,
  persistEntry,
  selectedDrifts,
  handleDriftToggle,
  proofType,
  setProofType,
  proofText,
  setProofText,
  proofUrl,
  setProofUrl,
  proofFile,
  setProofFile,
  handleProofSubmit,
  proofs,
  mode,
  currentSession,
  beginSession,
  completeSession,
  cancelSession,
  sessionNote,
  setSessionNote,
  sessionAttachProof,
  setSessionAttachProof,
  todayPlan,
  tomorrowPlan,
  plannedBigGoalText,
  setPlannedBigGoalText,
  planningNote,
  setPlanningNote,
  saveTomorrowAnchor,
  selectRecoveryAction,
  realityCheckLine,
  recoveryActions,
  requestNotifications
}) {
  const primarySubject = entry.primary_focus_type === "react" ? "React" : "DSA";
  const secondarySubject = entry.secondary_continuity_type === "react" ? "React" : "DSA";

  return (
    <div className="log-stack">
      <section className="panel tone-neutral log-hero">
        <div className="section-label">Daily log</div>
        <h1 className="section-title">Enter the real day.</h1>
        <p className="section-copy">This page is for proof, tasks, recovery, and closure. Keep the home screen clean. Do the real logging here.</p>
        <div className="hero-actions">
          <button className="ghost-btn" type="button" onClick={requestNotifications}>
            <Bell size={16} strokeWidth={2.2} />
            Turn on reminders
          </button>
          <button className="primary-btn" type="button" onClick={() => selectRecoveryAction("Put phone away", "standard")}>
            <ShieldAlert size={16} strokeWidth={2.2} />
            I’m drifting
          </button>
        </div>
        {(bannerMessage || todayState?.protectable || realityCheckLine || saveState === "saving") ? (
          <div className="banner-stack compact-banner-stack">
            {bannerMessage ? (
              <div className="banner">
                <strong>Attention</strong>
                <div>{bannerMessage}</div>
              </div>
            ) : null}
            {todayState?.protectable ? (
              <div className="banner">
                <strong>The streak is still protectable.</strong>
                <div>{todayState.protectMessage}</div>
              </div>
            ) : null}
            {realityCheckLine ? (
              <div className="banner danger-banner">
                <strong>Reality Check</strong>
                <div>{realityCheckLine}</div>
              </div>
            ) : null}
            {saveState === "saving" ? (
              <div className="banner">
                <strong>Saving</strong>
                <div>Writing the day into reality.</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {currentSession ? (
        <section className="panel tone-neutral session-panel">
          <div className="section-label">Current mission</div>
          <h2 className="section-title">{currentSession.label}</h2>
          <p className="section-copy">Reduce everything to one action. Finish the block, leave evidence, then move on.</p>
          <div className="session-timer">
            <TimerReset size={18} strokeWidth={2.2} />
            {currentSession.duration} minute target
          </div>
          <div className="field-stack field-top">
            <label>Optional note or proof line</label>
            <input value={sessionNote} onChange={(event) => setSessionNote(event.target.value)} placeholder="What moved forward in reality?" />
          </div>
          <label className="session-proof-toggle">
            <input type="checkbox" checked={sessionAttachProof} onChange={(event) => setSessionAttachProof(event.target.checked)} />
            Attach this as a quick proof
          </label>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={completeSession}>Session completed</button>
            <button className="ghost-btn" type="button" onClick={cancelSession}>Exit session</button>
          </div>
        </section>
      ) : null}

      <div className="dashboard-grid">
        <section className="panel tone-lavender">
          <div className="section-label">Strict streak module</div>
          <h2 className="section-title">The day only counts if the real work happened.</h2>
          {todayPlan?.planned_big_goal_text ? (
            <div className="metric-status metric-status-action">
              <span>Tonight's planned anchor: {todayPlan.planned_big_goal_text}</span>
              <button
                className="ghost-btn"
                type="button"
                onClick={() => {
                  setEntry({ ...entry, big_goal_text: todayPlan.planned_big_goal_text });
                  persistEntry({ big_goal_text: todayPlan.planned_big_goal_text });
                }}
              >
                Use planned anchor
              </button>
            </div>
          ) : null}
          <div className="field-stack field-top">
            <label>Today's Big Goal</label>
            <input
              type="text"
              value={entry.big_goal_text || ""}
              placeholder="One meaningful thing that must be done today"
              onChange={(event) => setEntry({ ...entry, big_goal_text: event.target.value })}
              onBlur={() => persistEntry({ big_goal_text: entry.big_goal_text })}
            />
          </div>
          <div className="task-list">
            <div className="task-row">
              <div className="task-info">
                <strong className="task-strong"><Goal size={16} strokeWidth={2.2} />Big Goal complete</strong>
                <span>The one thing that proves the day was real.</span>
              </div>
              <button className={`toggle ${entry.big_goal_completed ? "active" : ""}`} onClick={() => persistEntry({ big_goal_completed: !entry.big_goal_completed })}>
                {entry.big_goal_completed ? "Done" : "Pending"}
              </button>
            </div>
            <div className="task-row">
              <div className="task-info">
                <strong className="task-strong"><Brain size={16} strokeWidth={2.2} />Primary focus</strong>
                <span>Choose which subject gets the deep session today.</span>
              </div>
              <div className="chip-grid">
                {["dsa", "react"].map((value) => (
                  <button
                    key={value}
                    className={`chip secondary ${entry.primary_focus_type === value ? "selected" : ""}`}
                    onClick={() => persistEntry({ primary_focus_type: value, secondary_continuity_type: value === "dsa" ? "react" : "dsa" })}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="task-row">
              <div className="task-info">
                <strong className="task-strong"><MoonStar size={16} strokeWidth={2.2} />Sleep time</strong>
                <span>Exam-mode sleep target is 1:00 AM.</span>
              </div>
              <input
                className="small-input"
                type="time"
                value={entry.sleep_time || ""}
                onChange={(event) => setEntry({ ...entry, sleep_time: event.target.value })}
                onBlur={() => persistEntry({ sleep_time: entry.sleep_time })}
              />
            </div>
          </div>
        </section>

        <section className="panel tone-neutral">
          <div className="section-label">Begin system</div>
          <h2 className="section-title">Reduce initiation friction.</h2>
          <div className="exam-task-grid">
            <TaskCard
              icon={<Target size={16} strokeWidth={2.2} />}
              title="Aptitude"
              meta="60–90 minutes · daily exposure"
              description="Face the problem. Do not escape it."
              completed={entry.aptitude_completed}
              onToggle={() => persistEntry({ aptitude_completed: !entry.aptitude_completed })}
              onBegin={() => beginSession("aptitude")}
            />
            <TaskCard
              icon={<Swords size={16} strokeWidth={2.2} />}
              title={`${primarySubject} deep`}
              meta="Primary session"
              description={primarySubject === "DSA" ? "Solve first. Do not hide in tutorials." : "Build while learning. Output over playlists."}
              completed={entry.primary_focus_completed}
              onToggle={() => persistEntry({ primary_focus_completed: !entry.primary_focus_completed })}
              onBegin={() => beginSession(entry.primary_focus_type)}
            />
            <TaskCard
              icon={<BookOpen size={16} strokeWidth={2.2} />}
              title={`${secondarySubject} continuity`}
              meta="Small visible proof"
              description="Keep the other track alive with one small piece of evidence."
              completed={entry.secondary_continuity_completed}
              onToggle={() => persistEntry({ secondary_continuity_completed: !entry.secondary_continuity_completed })}
              onBegin={() => beginSession(entry.secondary_continuity_type)}
            />
            <TaskCard
              icon={<Footprints size={16} strokeWidth={2.2} />}
              title="German"
              meta="20 minutes only"
              description="Supportive continuity. Keep it light."
              completed={entry.german_completed}
              onToggle={() => persistEntry({ german_completed: !entry.german_completed })}
              onBegin={() => beginSession("german")}
            />
          </div>
          <div className="metric-status">Primary focus: {primarySubject}. Continuity proof: {secondarySubject}.</div>
        </section>

        <section className="panel tone-yellow">
          <div className="section-label">Exam mission</div>
          <h2 className="section-title">What counts today.</h2>
          <div className="guide-day-list">
            {EXAM_SURVIVAL_SUBJECTS.map((item) => (
              <div key={item.key}>
                <strong>{item.title}</strong> {item.minimum} — {item.principle}
              </div>
            ))}
          </div>
        </section>

        <section className="panel tone-sky">
          <div className="section-label">Recovery mode</div>
          <h2 className="section-title">Discipline is recovering faster.</h2>
          <div className="guide-lists-grid">
            <div className="guide-list-card">
              <strong>Standard recovery</strong>
              <div className="chip-grid">
                {recoveryActions.standard.map((action) => (
                  <button key={action} className="chip secondary" onClick={() => selectRecoveryAction(action, "standard")}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
            <div className="guide-list-card">
              <strong>Low-energy recovery</strong>
              <div className="chip-grid">
                {recoveryActions.low_energy.map((action) => (
                  <button key={action} className="chip secondary" onClick={() => selectRecoveryAction(action, "low_energy")}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel tone-rose">
          <div className="section-label">Drift tracking</div>
          <h2 className="section-title">Track the real ways you leave the path.</h2>
          <div className="chip-grid">
            {DRIFT_TRIGGERS.map((trigger) => (
              <button key={trigger.key} className={`chip ${selectedDrifts.has(trigger.key) ? "selected" : ""}`} onClick={() => handleDriftToggle(trigger.key)}>
                {trigger.label}
              </button>
            ))}
          </div>
          <div className="footer-note">Awareness first. Shame never.</div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid-wide">
        <section className="panel tone-mint">
          <div className="section-label">Supportive insight</div>
          <h2 className="section-title">Reality before self-deception.</h2>
          <div className="supportive-grid">
            <div className="field-stack compact-field">
              <label>Silent time minutes</label>
              <input
                className="small-input"
                type="text"
                value={String(entry.silent_time_minutes || 0)}
                onChange={(event) => setEntry({ ...entry, silent_time_minutes: Number(event.target.value.replace(/\D/g, "")) || 0 })}
                onBlur={() => persistEntry({ silent_time_minutes: entry.silent_time_minutes })}
              />
            </div>
            <div className="field-stack">
              <label>Daily reality check</label>
              <div className="chip-grid">
                {DAILY_REALITY_OPTIONS.map(([value, label]) => (
                  <button key={value} className={`chip secondary ${entry.daily_reality_check === value ? "selected" : ""}`} onClick={() => persistEntry({ daily_reality_check: value })}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="field-stack field-top">
            <label>Fantasy detection</label>
            <div className="chip-grid">
              {[
                ["no", "No"],
                ["a_little", "A little"],
                ["yes", "Yes"]
              ].map(([value, label]) => (
                <button key={value} className={`chip secondary ${entry.fantasy_detection_answer === value ? "selected" : ""}`} onClick={() => persistEntry({ fantasy_detection_answer: value })}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="panel tone-peach">
          <div className="section-label">Proof of day</div>
          <h2 className="section-title">What moved forward in reality?</h2>
          <form className="proof-form" onSubmit={handleProofSubmit}>
            <div className="chip-grid">
              {[
                ["note", "Note"],
                ["github_link", "GitHub link"],
                ["screenshot", "Screenshot"],
                ["photo", "Photo"]
              ].map(([value, label]) => (
                <button key={value} type="button" className={`chip secondary ${proofType === value ? "selected" : ""}`} onClick={() => setProofType(value)}>
                  {label}
                </button>
              ))}
            </div>
            {proofType === "note" ? (
              <div className="field-stack field-top">
                <label>Short note</label>
                <input value={proofText} onChange={(event) => setProofText(event.target.value)} placeholder="Solved percentage set. Built card component. Revised DSA notes." />
              </div>
            ) : null}
            {proofType === "github_link" ? (
              <div className="field-stack field-top">
                <label>GitHub link</label>
                <input value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} placeholder="https://github.com/..." />
              </div>
            ) : null}
            {(proofType === "screenshot" || proofType === "photo") ? (
              <div className="field-stack field-top">
                <label>Upload file</label>
                <input type="file" onChange={(event) => setProofFile(event.target.files?.[0] || null)} />
              </div>
            ) : null}
            <div className="form-actions">
              <button className="primary-btn" type="submit">Add proof</button>
            </div>
          </form>
          <div className="proof-list">
            {proofs.slice(0, 3).map((proof) => (
              <div key={proof.id} className="proof-item">
                <strong>{proof.proof_type.replace("_", " ")}</strong>
                <p>{proof.text_content || proof.external_url || proof.storage_path}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel tone-lavender">
        <div className="section-label">Tonight's continuity</div>
        <h2 className="section-title">Plan tomorrow before drift takes the evening.</h2>
        <div className="field-stack field-top">
          <label>Tomorrow's anchor goal</label>
          <input value={plannedBigGoalText} onChange={(event) => setPlannedBigGoalText(event.target.value)} placeholder="What must matter tomorrow?" />
        </div>
        <div className="field-stack field-top">
          <label>Optional note</label>
          <input value={planningNote} onChange={(event) => setPlanningNote(event.target.value)} placeholder="Protect morning. Face aptitude early." />
        </div>
        <div className="form-actions">
          <button className="primary-btn" type="button" onClick={saveTomorrowAnchor}>Save tomorrow</button>
        </div>
        {tomorrowPlan?.planned_big_goal_text ? (
          <div className="metric-status">Tomorrow is anchored: {tomorrowPlan.planned_big_goal_text}</div>
        ) : null}
      </section>
    </div>
  );
}
