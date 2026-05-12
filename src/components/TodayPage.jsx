import { Bell, CalendarDays, Flame, Goal, ShieldAlert, Sparkles, Target, Zap } from "lucide-react";

export default function TodayPage({
  profileName,
  dayPart,
  displayDate,
  birthdayCountdown,
  bannerMessage,
  setBannerMessage,
  todayState,
  streak,
  challenge,
  proofs,
  guidance,
  requestNotifications,
  mode,
  openLog,
  tomorrowPlan
}) {
  const challengePhase =
    (challenge?.challenge_day_number || 1) <= 7
      ? "Identity shock"
      : (challenge?.challenge_day_number || 1) <= 14
        ? "Rhythm formation"
        : (challenge?.challenge_day_number || 1) <= 21
          ? "Visible self-trust"
          : "Identity compounding";

  return (
    <>
      <div className="banner-stack">
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
      </div>

      <div className="page-grid">
        <div className="main-stack">
          <section className="panel hero-panel hero-band">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">{displayDate}</div>
                <div className="mode-badge">{mode.type === "exam_survival" ? "Exam Survival Mode" : "Standard mode"}</div>
                <h1 className="hero-title">Good {dayPart}.</h1>
                <div className="hero-name">{profileName}</div>
                <div className="hero-copy">
                  Home is for orientation. Logging is where the real day gets recorded. Keep this page clear, then go enter the evidence.
                </div>
                <div className="hero-actions">
                  <button className="primary-btn" type="button" onClick={openLog}>
                    <Goal size={16} strokeWidth={2.2} />
                    Open daily log
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => setBannerMessage("I’m drifting. Put the phone away and open the log to begin one real block.")}>
                    <ShieldAlert size={16} strokeWidth={2.2} />
                    I’m drifting
                  </button>
                  <button className="ghost-btn" type="button" onClick={requestNotifications}>
                    <Bell size={16} strokeWidth={2.2} />
                    Reminders
                  </button>
                </div>
              </div>

              <div className="hero-note">
                <div className="hero-note-title">Read this before drift</div>
                <div className="hero-note-item">Execution first. Feeling follows.</div>
                <div className="hero-note-item">One solved set beats five saved resources.</div>
                <div className="hero-note-item">Protect continuity. Do not disappear.</div>
                <div className="hero-note-focus">
                  <div className="sub-label">Tomorrow anchor</div>
                  <strong>{tomorrowPlan?.planned_big_goal_text || "No anchor saved yet."}</strong>
                </div>
              </div>
            </div>

            <div className="stats-grid stats-grid-compact">
              <div className="stat-card">
                <div className="stat-label">Strict streak</div>
                <div className="stat-icon"><Flame size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{streak?.full_streak ?? 0}</div>
                <div className="stat-copy">Evidence of discipline.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Best streak</div>
                <div className="stat-icon"><Sparkles size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{streak?.best_full_streak ?? 0}</div>
                <div className="stat-copy">Your cleanest run so far.</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Today state</div>
                <div className="stat-icon"><Zap size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">
                  {todayState?.status === "saved" ? "Saved" : todayState?.status === "at_risk" ? "At risk" : todayState?.status === "broken" ? "Broken" : "Alive"}
                </div>
                <div className="stat-copy">{todayState?.closure || "Still being written."}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Birthday countdown</div>
                <div className="stat-icon"><CalendarDays size={18} strokeWidth={2.2} /></div>
                <div className="stat-value">{birthdayCountdown ?? 0}</div>
                <div className="stat-copy">Days until 6 December.</div>
              </div>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="panel tone-lavender">
              <div className="section-label">30-day challenge</div>
              <h2 className="section-title">Day {challenge?.challenge_day_number ?? 1} of 30</h2>
              <p className="section-copy">{challengePhase}. The first month is about rebuilding self-trust through visible work.</p>
              <div className="score-band score-band-compact">
                <div className="metric-card">
                  <div className="sub-label">Strict</div>
                  <div className="metric-value">{challenge?.strict_days_completed ?? 0}</div>
                </div>
                <div className="metric-card">
                  <div className="sub-label">Saved</div>
                  <div className="metric-value">{challenge?.saved_days ?? 0}</div>
                </div>
                <div className="metric-card">
                  <div className="sub-label">Missed</div>
                  <div className="metric-value">{challenge?.missed_days ?? 0}</div>
                </div>
              </div>
            </section>

            <section className="panel tone-yellow">
              <div className="section-label">Today’s call to action</div>
              <h2 className="section-title">The real page is the log.</h2>
              <p className="section-copy">Do not live on the dashboard. Open the daily log, choose the primary focus, begin aptitude, and leave proof before the day closes.</p>
              <div className="form-actions">
                <button className="primary-btn" type="button" onClick={openLog}>
                  <Target size={16} strokeWidth={2.2} />
                  Go to daily log
                </button>
              </div>
              <div className="metric-status">Proofs recorded today: {proofs.length}</div>
            </section>
          </div>
        </div>

        <aside className="side-stack">
          <section className="panel tone-cream">
            <div className="section-label">Today's grounding</div>
            <h2 className="section-title">{guidance.title}</h2>
            <div className="grounding-list">
              <div className="grounding-row">
                <strong className="grounding-label">Wear</strong>
                <span className="grounding-value">{guidance.colorToWear}</span>
              </div>
              <div className="grounding-row">
                <strong className="grounding-label">Chant</strong>
                <span className="grounding-value">{guidance.mantra}</span>
              </div>
              <div className="grounding-row">
                <strong className="grounding-label">Pray to</strong>
                <span className="grounding-value">{guidance.deityOrPrayer}</span>
              </div>
              <div className="grounding-row">
                <strong className="grounding-label">Fast</strong>
                <span className="grounding-value">{guidance.fastingRecommended ? "Recommended" : "Optional / no"}</span>
              </div>
              <div className="grounding-row">
                <strong className="grounding-label">Food</strong>
                <span className="grounding-value">{guidance.avoidNonVeg ? "Avoid non-veg" : "No non-veg restriction"}</span>
              </div>
              <div className="grounding-row grounding-row-wide">
                <strong className="grounding-label">Focus</strong>
                <span className="grounding-value">{guidance.focusNotes.join(" • ")}</span>
              </div>
              <div className="grounding-row grounding-row-wide">
                <strong className="grounding-label">Avoid</strong>
                <span className="grounding-value">{guidance.avoidNotes.join(" • ")}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
