import { BookOpen, History, LayoutDashboard, LogOut, MoonStar, Settings, SunMedium } from "lucide-react";
import { PAGE_TABS } from "../data/appContent";

export default function AppShell({
  theme,
  setTheme,
  activePage,
  setActivePage,
  signOut,
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
            <div className="brand-mark" aria-hidden="true">
              SP
            </div>
            <div className="brand-copy">
              <div className="brand-kicker">Personal Reset Document</div>
              <div className="brand-title">The Steady Path</div>
            </div>
          </div>
          <nav className="nav-strip" aria-label="Pages">
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
            <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <SunMedium size={16} strokeWidth={2.2} /> : <MoonStar size={16} strokeWidth={2.2} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button className="ghost-btn" type="button" onClick={signOut}>
              <LogOut size={16} strokeWidth={2.2} />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
