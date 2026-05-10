import { BarChart3, Flame, ShieldCheck, TrendingUp } from "lucide-react";
import { DRIFT_TRIGGERS } from "../data/appContent";

export default function HistoryPage({ recentSummary, streak, history, driftTrend }) {
  return (
    <div className="page-grid">
      <div className="main-stack">
        <section className="panel">
          <div className="section-label">History</div>
          <h2 className="section-title">Proof beats self-deception.</h2>
          <div className="score-band">
            <div className="metric-card">
              <div className="sub-label">Full days</div>
              <div className="stat-icon"><Flame size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{recentSummary.full}</div>
              <div className="stat-copy">Last 21 entries.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">No zero days</div>
              <div className="stat-icon"><ShieldCheck size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{recentSummary.noZero}</div>
              <div className="stat-copy">Identity continuity.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Saved days</div>
              <div className="stat-icon"><TrendingUp size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{recentSummary.minimum}</div>
              <div className="stat-copy">Minimum viable recoveries.</div>
            </div>
            <div className="metric-card">
              <div className="sub-label">Best streak</div>
              <div className="stat-icon"><BarChart3 size={18} strokeWidth={2.2} /></div>
              <div className="metric-value">{streak?.best_full_streak ?? 0}</div>
              <div className="stat-copy">Strict success days.</div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-label">Recent days</div>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <strong>{item.date}</strong>
                <p>
                  {item.full_day_completed
                    ? "Full success"
                    : item.minimum_viable_day_completed
                      ? "Minimum day saved"
                      : item.no_zero_day_completed
                        ? "No zero day"
                        : "Miss"}{" "}
                  • Reality score {item.reality_score}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="side-stack">
        <section className="panel">
          <div className="section-label">Drift patterns</div>
          <div className="trend-grid">
            {DRIFT_TRIGGERS.map((trigger) => (
              <div key={trigger.key} className="metric-card">
                <div className="sub-label">{trigger.label}</div>
                <div className="metric-value">{driftTrend[trigger.key] || 0}</div>
                <div className="stat-copy">Logged across the recent 7-day window.</div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
