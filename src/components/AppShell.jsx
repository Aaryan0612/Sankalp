import { BookOpen, History, LayoutDashboard, MoonStar, Settings, SunMedium } from "lucide-react";
import { PAGE_TABS } from "../data/appContent";

export default function AppShell({
  theme,
  setTheme,
  activePage,
  setActivePage,
  children
}) {
  const tabIcons = {
    today: LayoutDashboard,
    history: History,
    guide: BookOpen,
    settings: Settings
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark brand-mark-devanagari" aria-hidden="true">सं</div>
            <div className="brand-copy">
              <div className="brand-kicker">Sankalp</div>
              <div className="brand-title brand-title-devanagari">संकल्प</div>
            </div>
          </div>
          <nav className="nav-strip desktop-nav-strip" aria-label="Pages">
            {PAGE_TABS.map(([key, label]) => {
              const Icon = tabIcons[key];
              return (
                <button key={key} className={`nav-pill nav-pill-icon ${activePage === key ? "active" : ""}`} onClick={() => setActivePage(key)}>
                  <Icon size={16} strokeWidth={2.2} />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="action-row">
            <button
              className="theme-icon-btn"
              type="button"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunMedium size={18} strokeWidth={2.2} /> : <MoonStar size={18} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <nav className="mobile-bottom-nav" aria-label="Mobile pages">
        <div className="mobile-bottom-nav-inner">
          {PAGE_TABS.map(([key, label]) => {
            const Icon = tabIcons[key];
            return (
              <button
                key={key}
                className={`mobile-tab ${activePage === key ? "active" : ""}`}
                onClick={() => setActivePage(key)}
              >
                <Icon size={17} strokeWidth={2.2} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
