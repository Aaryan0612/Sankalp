import { KeyRound, Mail, ShieldCheck } from "lucide-react";

export default function AuthScreen({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authMessage,
  bootError,
  onSubmit,
  onGoogleAuth
}) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">Accountability</div>
        <h1 className="hero-title">Sign in to make the system real.</h1>
        <p className="auth-copy">
          Supabase keeps your streaks, proof, drift patterns, reminders, and recovery history synced across devices.
        </p>
        <div className="inline-badge">
          <ShieldCheck size={16} strokeWidth={2.2} />
          Private personal accountability
        </div>
        <form onSubmit={onSubmit}>
          <div className="field-grid">
            <div className="field-stack">
              <label>Email</label>
              <div className="input-wrap">
                <Mail size={16} strokeWidth={2.2} />
                <input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} required />
              </div>
            </div>
            <div className="field-stack">
              <label>Password</label>
              <div className="input-wrap">
                <KeyRound size={16} strokeWidth={2.2} />
                <input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} required />
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="primary-btn" type="submit">
              {authMode === "signin" ? "Sign in" : "Create account"}
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
            >
              {authMode === "signin" ? "Need an account?" : "Already have an account?"}
            </button>
          </div>
          <div className="auth-divider">
            <span>or</span>
          </div>
          <button className="ghost-btn google-btn" type="button" onClick={onGoogleAuth}>
            <span className="google-mark" aria-hidden="true">G</span>
            Continue with Google
          </button>
          {authMessage ? <div className="footer-note">{authMessage}</div> : null}
          {bootError ? <div className="footer-note danger">{bootError}</div> : null}
        </form>
      </div>
    </div>
  );
}
