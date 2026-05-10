import { Bell, Flame, Footprints, Goal, MoonStar, ShieldAlert, Sparkles, Target, Zap } from "lucide-react";
import { DRIFT_TRIGGERS, MINIMUM_DAY_TASKS, RECOVERY_ACTIONS, STRICT_TASKS } from "../data/appContent";

export default function TodayPage({
  profileName,
  dayPart,
  displayDate,
  saveState,
  bannerMessage,
  setBannerMessage,
  todayState,
  streak,
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
  guidance,
  requestNotifications,
  driftCount,
  proofCount
}) {
  return (
    <>
      <div className="banner-stack">
        {bannerMessage ? (
          <div className="banner">
            <strong>Attention</strong>
            <div>{bannerMessage}</div>
          </div>
        ) : null}
        {saveState === "saving" ? (
          <div className="banner">
            <strong>Saving</strong>
            <div>Writing today into reality.</div>
          </div>
        ) : null}
        {todayState?.status === "minimum_day" ? (
          <div className="banner">
            <strong>Recover the day</strong>
            <div>Do not collapse. Protect the identity. Save the day with one clean action at a time.</div>
          </div>
        ) : null}
      </div>

      <div className="page-grid">
        <div className="main-stack">
          <section className="panel hero-panel hero-band">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">{displayDate}</div>
                <h1 className="hero-title">Good {dayPart}.</h1>
                <div className="hero-name">{profileName}</div>
                <div className="hero-copy">
                  This workspace is for one thing: reduce noise, choose the next real action, and keep your identity tied to proof instead of mood.
                </div>
                <div className="hero-actions">
                  <button className="primary-btn" type="button" onClick={() => setBannerMessage("I’m drifting. Put the phone away and do one recovery action now.")}>
                    <ShieldAlert size={16} strokeWidth={2.2} />
                    Emergency reset
                  </button>
                  <button className="ghost-btn" type="button" onClick={requestNotifications}>
                    <Bell size={16} strokeWidth={2.2} />
                    Turn on reminders
                  </button>
                </div>
              </div>
              <div className="hero-note">
                <div className="hero-note-title">Read this before drift</div>
                <div className="hero-note-item">Execution first. Feeling follows.</div>
                <div className="hero-note-item">Protect one meaningful task.</div>
                <div className="hero-note-item">No zero days. Leave proof.</div>
              </div>
            </div>
            <div className="stats-grid stats-grid-compact">
              <div className="stat-card">
                <div className="stat-label">Full streak</div>
                <div className="stat-icon"><Flame size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{streak?.full_streak ?? 0}</div>
                <div className="stat-copy">Strict days only.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">No zero day</div>
                <div className="stat-icon"><Target size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{streak?.no_zero_day_streak ?? 0}</div>
                <div className="stat-copy">Continuity without collapse.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Reality score</div>
                <div className="stat-icon"><Sparkles size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{todayState?.realityScore ?? 0}</div>
                <div className="stat-copy">Execution beats illusion.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Today state</div>
                <div className="stat-icon"><Zap size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">
                  {todayState?.status === "full_success" ? "Full" : todayState?.status === "minimum_day" ? "Saved" : "Open"}
                </div>
                <div className="stat-copy">{saveState === "saved" ? "Saved to Supabase." : "Strict but stabilizing."}</div>
              </div>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="panel tone-lavender">
              <div className="section-label">Strict day success</div>
              <h2 className="section-title">The 4 things that decide the full streak.</h2>
              <p className="section-copy">Everything else matters, but these are the non-negotiables that move the main streak.</p>
              <div className="field-stack field-top">
                <label>Today’s Big Goal</label>
                <input
                  type="text"
                  value={entry.big_goal_text || ""}
                  placeholder="One meaningful thing that must be done today"
                  onChange={(event) => setEntry({ ...entry, big_goal_text: event.target.value })}
                  onBlur={() => persistEntry({ big_goal_text: entry.big_goal_text })}
                />
              </div>
              <div className="task-list">
                {STRICT_TASKS.map((task) => (
                  <div key={task.key} className="task-row">
                    <div className="task-info">
                      <strong className="task-strong">
                        <Goal size={16} strokeWidth={2.2} />
                        {task.title}
                      </strong>
                      <span>{task.description}</span>
                    </div>
                    <button className={`toggle ${entry[task.key] ? "active" : ""}`} onClick={() => persistEntry({ [task.key]: !entry[task.key] })}>
                      {entry[task.key] ? "Done" : "Pending"}
                    </button>
                  </div>
                ))}
                <div className="task-row">
                  <div className="task-info">
                    <strong className="task-strong">
                      <MoonStar size={16} strokeWidth={2.2} />
                      Sleep time
                    </strong>
                    <span>Objective input only. The app decides if sleep qualified.</span>
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

            <section className="panel tone-yellow">
              <div className="section-label">Minimum Viable Day</div>
              <h2 className="section-title">Protect the identity if perfection is gone.</h2>
              <p className="section-copy">This does not advance the full streak. It keeps the day from collapsing into nothing.</p>
              <div className="task-list">
                {MINIMUM_DAY_TASKS.map((task) => (
                  <div key={task.key} className="task-row">
                    <div className="task-info">
                      <strong className="task-strong">
                        <Target size={16} strokeWidth={2.2} />
                        {task.title}
                      </strong>
                      <span>{task.description}</span>
                    </div>
                    <button className={`toggle ${entry[task.key] ? "active" : ""}`} onClick={() => persistEntry({ [task.key]: !entry[task.key] })}>
                      {entry[task.key] ? "Done" : "Pending"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="metric-status">{todayState?.min ? "Minimum viable day protected" : "Still open — save the day if needed"}</div>
            </section>

            <section className="panel tone-rose">
              <div className="section-label">Drift triggers</div>
              <h2 className="section-title">Track the real ways you escape.</h2>
              <p className="section-copy">One tap only. No vague guilt. Just honest pattern visibility.</p>
              <div className="chip-grid">
                {DRIFT_TRIGGERS.map((trigger) => (
                  <button
                    key={trigger.key}
                    className={`chip ${selectedDrifts.has(trigger.key) ? "selected" : ""}`}
                    onClick={() => handleDriftToggle(trigger.key)}
                  >
                    {trigger.label}
                  </button>
                ))}
              </div>
              <div className="footer-note">If you log drift, the app moves you into recovery instead of “day ruined” thinking.</div>
            </section>

            <section className="panel tone-mint">
              <div className="section-label">Supportive insight</div>
              <h2 className="section-title">Silence, fantasy, and proof.</h2>
              <div className="field-grid">
                <div className="field-stack">
                  <label>Silent time minutes</label>
                  <input
                    type="text"
                    value={String(entry.silent_time_minutes || 0)}
                    onChange={(event) => setEntry({ ...entry, silent_time_minutes: Number(event.target.value.replace(/\D/g, "")) || 0 })}
                    onBlur={() => persistEntry({ silent_time_minutes: entry.silent_time_minutes })}
                  />
                </div>
                <div className="field-stack">
                  <label>Wake time (optional)</label>
                  <input
                    type="time"
                    value={entry.wake_time || ""}
                    onChange={(event) => setEntry({ ...entry, wake_time: event.target.value })}
                    onBlur={() => persistEntry({ wake_time: entry.wake_time })}
                  />
                </div>
              </div>
              <div className="task-list">
                <div className="task-row">
                  <div className="task-info">
                    <strong className="task-strong">
                      <Footprints size={16} strokeWidth={2.2} />
                      Walk without headphones
                    </strong>
                    <span>Your nervous system needs quiet retraining.</span>
                  </div>
                  <button
                    className={`toggle ${entry.walk_without_headphones_completed ? "active" : ""}`}
                    onClick={() =>
                      persistEntry({
                        walk_without_headphones_completed: !entry.walk_without_headphones_completed
                      })
                    }
                  >
                    {entry.walk_without_headphones_completed ? "Done" : "Pending"}
                  </button>
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
                    <button
                      key={value}
                      className={`chip secondary ${entry.fantasy_detection_answer === value ? "selected" : ""}`}
                      onClick={() => persistEntry({ fantasy_detection_answer: value })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel tone-sky">
              <div className="section-label">Recovery mode</div>
              <h2 className="section-title">Interrupt the collapse fast.</h2>
              <p className="section-copy">This is for the moment you feel the day slipping. Do not negotiate. Pick the next correction.</p>
              <div className="chip-grid">
                {RECOVERY_ACTIONS.map((action) => (
                  <button
                    key={action}
                    className={`chip secondary ${entry.recovery_action_key === action ? "selected" : ""}`}
                    onClick={() => persistEntry({ recovery_mode_used: true, recovery_action_key: action })}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>

            <section className="panel tone-peach">
              <div className="section-label">Proof of day</div>
              <h2 className="section-title">Kill imagined productivity with evidence.</h2>
              <form onSubmit={handleProofSubmit}>
                <div className="field-grid">
                  <div className="field-stack">
                    <label>Proof type</label>
                    <select value={proofType} onChange={(event) => setProofType(event.target.value)}>
                      <option value="note">Note</option>
                      <option value="github_link">GitHub link</option>
                      <option value="screenshot">Screenshot</option>
                      <option value="photo">Photo</option>
                    </select>
                  </div>
                  <div className="field-stack">
                    <label>{proofType === "github_link" ? "Link" : proofType === "note" ? "Short note" : "File"}</label>
                    {proofType === "github_link" ? (
                      <input type="url" value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} placeholder="https://github.com/..." />
                    ) : proofType === "note" ? (
                      <input type="text" value={proofText} onChange={(event) => setProofText(event.target.value)} placeholder="What real thing exists because of today?" />
                    ) : (
                      <input type="file" accept="image/*" onChange={(event) => setProofFile(event.target.files?.[0] || null)} />
                    )}
                  </div>
                </div>
                <div className="form-actions">
                  <button className="primary-btn" type="submit">
                    Add proof
                  </button>
                </div>
              </form>
              <div className="proof-list">
                {proofs.length === 0 ? (
                  <div className="proof-item">
                    <strong>No proof yet</strong>
                    <p>No zero days. Leave evidence.</p>
                  </div>
                ) : (
                  proofs.map((proof) => (
                    <div key={proof.id} className="proof-item">
                      <strong>{proof.proof_type.replace("_", " ")}</strong>
                      <p>{proof.text_content || proof.external_url || proof.storage_path}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        <aside className="side-stack">
          <section className="panel tone-cream">
            <div className="section-label">Today’s grounding</div>
            <h2 className="section-title">{guidance.title}</h2>
            <div className="guide-grid">
              <div className="soft-card">
                <div className="sub-label">Wear</div>
                <div>{guidance.colorToWear}</div>
              </div>
              <div className="soft-card">
                <div className="sub-label">Chant</div>
                <div>{guidance.mantra}</div>
              </div>
              <div className="soft-card">
                <div className="sub-label">Pray to</div>
                <div>{guidance.deityOrPrayer}</div>
              </div>
              <div className="soft-card">
                <div className="sub-label">Food</div>
                <div>{guidance.avoidNonVeg ? "Avoid non-veg" : "No non-veg restriction"}</div>
              </div>
            </div>
            <div className="proof-list">
              <div className="proof-item">
                <strong>Focus</strong>
                <p>{guidance.focusNotes.join(" • ")}</p>
              </div>
              <div className="proof-item">
                <strong>Avoid</strong>
                <p>{guidance.avoidNotes.join(" • ")}</p>
              </div>
              {guidance.offeringNotes?.length ? (
                <div className="proof-item">
                  <strong>Offerings</strong>
                  <p>{guidance.offeringNotes.join(" • ")}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="panel tone-neutral">
            <div className="section-label">Status</div>
            <div className="score-band">
              <div className="metric-card">
                <div className="sub-label">Sleep</div>
                <div className="metric-value">{todayState?.sleepQualified ? "Qualified" : "Open"}</div>
                <div className="stat-copy">Sleep by 11:30 PM for full-day success.</div>
              </div>
              <div className="metric-card">
                <div className="sub-label">Drift</div>
                <div className="metric-value">{driftCount}</div>
                <div className="stat-copy">Triggers logged today.</div>
              </div>
              <div className="metric-card">
                <div className="sub-label">Proof</div>
                <div className="metric-value">{proofCount}</div>
                <div className="stat-copy">Real evidence submitted.</div>
              </div>
              <div className="metric-card">
                <div className="sub-label">No zero day</div>
                <div className="metric-value">{todayState?.noZero ? "Yes" : "Not yet"}</div>
                <div className="stat-copy">One action still saves the day.</div>
              </div>
              <div className="metric-card">
                <div className="sub-label">Weekly grace</div>
                <div className="metric-value">{streak?.weekly_grace_available ? "Available" : "Used"}</div>
                <div className="stat-copy">One full-streak miss can be absorbed each week.</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
