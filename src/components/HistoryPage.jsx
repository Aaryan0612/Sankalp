import { BarChart3, Flame, RotateCcw, ShieldCheck, TrendingUp } from "lucide-react";
import { DRIFT_TRIGGERS } from "../data/appContent";
import RealityScoreChart from "./RealityScoreChart";

const OUTCOME_LABELS = {
  full_success: "Full",
  saved: "Saved",
  no_zero: "No zero",
  miss: "Miss"
};

export default function HistoryPage({ streak, challenge, driftTrend, historyInsights }) {
  const timeline = historyInsights?.recentTimeline || [];

  return (
    <div className="page-grid">
      <div className="main-stack">
        <section className="panel tone-neutral">
          <div className="section-label">History</div>
          <h2 className="section-title">Evidence of discipline, not mood.</h2>
          <div className="score-band">
            <div className="metric-card">
              <div className="sub-label">Strict streak</div>
              <div className="stat-icon"><Flame size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{streak?.full_streak ?? 0}</div>
              <div className="stat-copy">Current chain of fully secured days.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Best strict streak</div>
              <div className="stat-icon"><BarChart3 size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{streak?.best_full_streak ?? 0}</div>
              <div className="stat-copy">Your best evidence run so far.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">No zero streak</div>
              <div className="stat-icon"><ShieldCheck size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{streak?.no_zero_day_streak ?? 0}</div>
              <div className="stat-copy">Continuity even when the day gets rough.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Saved days</div>
              <div className="stat-icon"><RotateCcw size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{challenge?.saved_days ?? historyInsights?.savedDays ?? 0}</div>
              <div className="stat-copy">Recovery instead of collapse.</div>
            </div>
          </div>
        </section>

        <section className="panel tone-cream">
          <div className="section-label">Compounding</div>
          <h2 className="section-title">Reality score trend</h2>
          <p className="section-copy">This line should rise as execution becomes normal and drift loses ground.</p>
          <RealityScoreChart points={timeline} />
        </section>

        <section className="panel tone-neutral">
          <div className="section-label">30-day challenge</div>
          <h2 className="section-title">Identity rebuild, one secured day at a time.</h2>
          <div className="score-band">
            <div className="metric-card">
              <div className="sub-label">Day</div>
              <div className="metric-value">{challenge?.challenge_day_number ?? 1}/30</div>
              <div className="stat-copy">Current challenge position.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Strict days</div>
              <div className="metric-value">{challenge?.strict_days_completed ?? 0}</div>
              <div className="stat-copy">Days fully secured inside the challenge.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Missed days</div>
              <div className="metric-value">{challenge?.missed_days ?? 0}</div>
              <div className="stat-copy">No denial. Just visible truth.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Status</div>
              <div className="metric-value">{challenge?.status === "completed" ? "Complete" : "Active"}</div>
              <div className="stat-copy">The challenge remains alive while you keep showing up.</div>
            </div>
          </div>
        </section>

        <section className="panel tone-sky">
          <div className="section-label">Timeline</div>
          <h2 className="section-title">See exactly what the last 30 days were.</h2>
          <div className="timeline-grid">
            {timeline.map((item) => (
              <div key={item.date} className={`timeline-chip ${item.outcome}`}>
                <strong>{item.date.slice(5)}</strong>
                <span>{OUTCOME_LABELS[item.outcome]}</span>
                <small>{item.realityScore}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="side-stack">
        <section className="panel tone-lavender">
          <div className="section-label">Comeback stats</div>
          <div className="trend-grid">
            <div className="metric-card">
              <div className="sub-label">Fastest recovery</div>
              <div className="metric-value">{historyInsights?.fastestRecoveryAfterMiss ?? "—"}</div>
              <div className="stat-copy">Days it took to bounce back after a miss.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Recovery streak</div>
              <div className="metric-value">{historyInsights?.recoveryStreak ?? 0}</div>
              <div className="stat-copy">Best run of saved/full days without a collapse.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Bounce-back rate</div>
              <div className="metric-value">{historyInsights?.bounceBackRate ?? 0}%</div>
              <div className="stat-copy">How often a miss turned into recovery.</div>
            </div>
          </div>
        </section>

        <section className="panel tone-mint">
          <div className="section-label">Drift patterns</div>
          <div className="trend-grid">
            {DRIFT_TRIGGERS.map((trigger) => (
              <div key={trigger.key} className="metric-card">
                <div className="sub-label">{trigger.label}</div>
                <div className="metric-value">{driftTrend[trigger.key] || 0}</div>
                <div className="stat-copy">Recent logs. Awareness before denial.</div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel tone-rose">
          <div className="section-label">Closure language</div>
          <div className="history-list">
            <div className="history-item">
              <strong>Day secured.</strong>
              <p>Full success. Evidence recorded.</p>
            </div>
            <div className="history-item">
              <strong>Continuity protected.</strong>
              <p>You did not let the day turn into nothing.</p>
            </div>
            <div className="history-item">
              <strong>Begin again today.</strong>
              <p>No panic. No theatre. Just return to the path.</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
