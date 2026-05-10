import { DAY_RULES, GROUNDED_CONTEXT, GUIDE_ROADMAP, GUIDE_SECTIONS, INTERNAL_WARNING_SIGNS, RETURN_TO_ACTION } from "../data/appContent";
import { renderRichText } from "../lib/richText";

export default function GuidePage() {
  const priorityDays = ["monday", "tuesday", "wednesday", "saturday"];
  const secondaryDays = ["thursday", "friday", "sunday"];

  const stripWeekday = (key, title) => {
    const dayName = key.charAt(0).toUpperCase() + key.slice(1);
    return title.startsWith(dayName) ? title.slice(dayName.length).trim() : title;
  };

  const renderDayCard = (key, priority = false) => {
    const day = DAY_RULES[key];
    const heading = key.charAt(0).toUpperCase() + key.slice(1);
    const subtitle = stripWeekday(key, day.title) || "Grounding";

    return (
      <article key={key} className={`guide-day-card ${priority ? "priority" : "secondary"}`}>
        <div className="guide-day-topline">
          <div className="section-label">{heading}</div>
          {priority ? <div className="guide-priority-badge">Priority day</div> : null}
        </div>
        <h3 className="guide-day-title">{subtitle}</h3>
        <p className="guide-day-subtitle">
          {priority
            ? "Treat this as one of your anchor days. Keep the ritual simple, visible, and grounded in action."
            : "Keep the reminder light. Use it as structure, not pressure."}
        </p>

        <div className="ritual-grid">
          <div className="ritual-card">
            <div className="sub-label">Wear</div>
            <div className="ritual-value">{day.colorToWear}</div>
          </div>
          <div className="ritual-card">
            <div className="sub-label">Chant</div>
            <div className="ritual-value">{day.mantra}</div>
          </div>
          <div className="ritual-card">
            <div className="sub-label">Pray to</div>
            <div className="ritual-value">{day.deityOrPrayer}</div>
          </div>
        </div>

        <div className="guide-lists-grid">
          <div className="guide-list-card guide-day-list">
            <div><strong>Fast</strong>{day.fastingRecommended ? "Recommended" : "Optional / no"}</div>
            <div><strong>Food</strong>{day.avoidNonVeg ? "Avoid non-veg" : "No non-veg restriction"}</div>
            {day.offeringNotes?.length ? <div><strong>Offerings</strong>{day.offeringNotes.join(" • ")}</div> : null}
          </div>
          <div className="guide-list-card guide-day-list">
            <div><strong>Focus</strong>{day.focusNotes.join(" • ")}</div>
            <div><strong>Avoid</strong>{day.avoidNotes.join(" • ")}</div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="main-stack">
      <section className="panel hero-panel tone-neutral">
        <div className="eyebrow">Guide</div>
        <h1 className="guide-hero-title">The reflection still matters. The dashboard makes it real.</h1>
        <div className="hero-copy">
          Use this page when you need wisdom, language, and grounding. Use the Today dashboard when you need action.
        </div>
      </section>
      <section className="panel tone-neutral guide-sequence-panel">
        <div className="section-label">Step 1 · Truth</div>
        <h2 className="section-title">Read this when your mind starts making excuses.</h2>
        <p className="section-copy">This is the reset point: tell the truth, remember the cost of drift, notice the warning sign early, and return to disciplined action.</p>
        <div className="guide-alert-row">
          <div className="guide-alert danger-alert">
            <strong>Do not confuse feeling lost with being incapable.</strong>
            <span>Your real enemy is drift, overstimulation, fantasy, and delay.</span>
          </div>
          <div className="guide-alert emphasis-alert">
            <strong>The app is not here to comfort your excuses.</strong>
            <span>It is here to return you to clarity, work, and self-respect.</span>
          </div>
        </div>
      </section>
      <div className="dashboard-grid guide-truth-grid">
        {GUIDE_SECTIONS.map((section) => (
          <div key={section.title} className="guide-card">
            <div className="section-label">{section.title}</div>
            <p>{renderRichText(section.copy)}</p>
          </div>
        ))}
      </div>
      <section className="panel tone-lavender">
        <div className="section-label">Step 2 · Long-range memory</div>
        <h2 className="section-title">Do not forget what the next stretch of life is asking from you.</h2>
        <div className="weekly-guide-grid">
          {GUIDE_ROADMAP.map((item) => (
            <article key={item.title} className="guide-day-card secondary">
              <div className="section-label">{item.kicker}</div>
              <h3 className="guide-day-title">{item.title}</h3>
              <p className="guide-day-subtitle">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel tone-rose">
        <div className="section-label">Step 3 · Warning signs</div>
        <h2 className="section-title">Know the thoughts that mean drift has started.</h2>
        <p className="section-copy">
          When one of these lines appears in your mind, do not negotiate with it. Recognize it early, interrupt it, and return to the next real action.
        </p>
        <div className="warning-signs">
          {INTERNAL_WARNING_SIGNS.map((item) => (
            <article key={item.trigger} className="warning-row">
              <div className="warning-trigger">"{item.trigger}"</div>
              <div className="warning-response">
                <strong>{item.meaning}</strong>
                <p>{item.correction}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel tone-neutral">
        <div className="section-label">Step 4 · Grounded context</div>
        <h2 className="section-title">Use context to steady yourself, not to escape responsibility.</h2>
        <p className="section-copy">
          This part exists to explain why some patterns repeat, so you can respond with discipline instead of confusion. The remedy is still action.
        </p>
        <div className="guide-context-grid">
          {GROUNDED_CONTEXT.map((item) => (
            <article key={item.title} className="context-card">
              <h3 className="guide-day-title">{item.title}</h3>
              <p className="guide-day-subtitle">{item.context}</p>
              <div className="context-reminder">{item.reminder}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel tone-cream">
        <div className="section-label">Step 5 · Weekly grounding</div>
        <h2 className="section-title">Mantras, colors, fasting, and daily cautions.</h2>
        <div className="weekly-guide-grid">{priorityDays.map((key) => renderDayCard(key, true))}</div>
      </section>
      <section className="panel tone-neutral">
        <div className="section-label">Secondary rhythm</div>
        <h2 className="section-title">Keep the rest of the week clean and supportive.</h2>
        <div className="weekly-guide-grid">{secondaryDays.map((key) => renderDayCard(key, false))}</div>
      </section>
      <section className="panel tone-sky">
        <div className="section-label">Step 6 · Return to action</div>
        <h2 className="section-title">When you finish reading this, do one real thing immediately.</h2>
        <div className="return-action-grid">
          {RETURN_TO_ACTION.map((line) => (
            <div key={line} className="return-action-card">
              {line}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
