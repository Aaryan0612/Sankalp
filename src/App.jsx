import AppShell from "./components/AppShell";
import AuthScreen from "./components/AuthScreen";
import GuidePage from "./components/GuidePage";
import HistoryPage from "./components/HistoryPage";
import LoadingScreen from "./components/LoadingScreen";
import SettingsPage from "./components/SettingsPage";
import SetupScreen from "./components/SetupScreen";
import TodayPage from "./components/TodayPage";
import { useSteadyPathApp } from "./hooks/useSteadyPathApp";

export default function App() {
  const app = useSteadyPathApp();

  if (!app.hasSupabaseConfig) {
    return <SetupScreen />;
  }

  if (app.loading) {
    return <LoadingScreen />;
  }

  if (!app.session) {
    return (
      <AuthScreen
        authMode={app.authMode}
        setAuthMode={app.setAuthMode}
        authEmail={app.authEmail}
        setAuthEmail={app.setAuthEmail}
        authPassword={app.authPassword}
        setAuthPassword={app.setAuthPassword}
        authMessage={app.authMessage}
        bootError={app.bootError}
        onSubmit={app.handleAuthSubmit}
        onGoogleAuth={app.handleGoogleAuth}
      />
    );
  }

  return (
    <AppShell
      theme={app.theme}
      setTheme={app.setTheme}
      activePage={app.activePage}
      setActivePage={app.setActivePage}
    >
      {app.activePage === "today" && app.entry ? (
        <TodayPage
          profileName={app.profileName}
          dayPart={app.dayPart}
          displayDate={app.displayDate}
          saveState={app.saveState}
          bannerMessage={app.bannerMessage}
          setBannerMessage={app.setBannerMessage}
          todayState={app.todayState}
          streak={app.streak}
          entry={app.entry}
          setEntry={app.setEntry}
          persistEntry={app.persistEntry}
          selectedDrifts={app.selectedDrifts}
          handleDriftToggle={app.handleDriftToggle}
          proofType={app.proofType}
          setProofType={app.setProofType}
          proofText={app.proofText}
          setProofText={app.setProofText}
          proofUrl={app.proofUrl}
          setProofUrl={app.setProofUrl}
          proofFile={app.proofFile}
          setProofFile={app.setProofFile}
          handleProofSubmit={app.handleProofSubmit}
          proofs={app.proofs}
          guidance={app.guidance}
          requestNotifications={app.requestNotifications}
          driftCount={app.driftCount}
          proofCount={app.proofCount}
        />
      ) : null}

      {app.activePage === "history" && app.entry ? (
        <HistoryPage recentSummary={app.recentSummary} streak={app.streak} history={app.history} driftTrend={app.driftTrend} />
      ) : null}

      {app.activePage === "guide" ? <GuidePage /> : null}

      {app.activePage === "settings" ? (
        <SettingsPage
          reminders={app.reminders}
          handleReminderPrefChange={app.handleReminderPrefChange}
          profile={app.profile}
          handleProfileSave={app.handleProfileSave}
          signOut={app.signOut}
        />
      ) : null}
    </AppShell>
  );
}
