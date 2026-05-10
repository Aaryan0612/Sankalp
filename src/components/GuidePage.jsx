import { GUIDE_SECTIONS } from "../data/appContent";
import { renderRichText } from "../lib/richText";

export default function GuidePage() {
  return (
    <div className="main-stack">
      <section className="panel hero-panel">
        <div className="eyebrow">Guide</div>
        <h1 className="hero-title">The reflection still matters. The dashboard makes it real.</h1>
        <div className="hero-copy">
          Use this page when you need wisdom, language, and grounding. Use the Today dashboard when you need action.
        </div>
      </section>
      <div className="dashboard-grid">
        {GUIDE_SECTIONS.map((section) => (
          <div key={section.title} className="guide-card">
            <div className="section-label">{section.title}</div>
            <p>{renderRichText(section.copy)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
