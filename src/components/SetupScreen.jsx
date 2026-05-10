import { Database, Settings2 } from "lucide-react";

export default function SetupScreen() {
  return (
    <div className="setup-shell">
      <div className="setup-card">
        <div className="eyebrow">Deploy setup</div>
        <h1 className="hero-title">Sankalp needs Supabase before it can hold you accountable.</h1>
        <p className="setup-copy">
          Create a <span className="mark">.env</span> file from <span className="line-mark">.env.example</span>, then add your public
          Supabase URL and anon key.
        </p>
        <div className="setup-checklist">
          <div className="inline-badge">
            <Settings2 size={16} strokeWidth={2.2} />
            Add `VITE_SUPABASE_URL`
          </div>
          <div className="inline-badge">
            <Database size={16} strokeWidth={2.2} />
            Run `supabase-schema.sql`
          </div>
        </div>
        <div className="footer-note">
          After that, run the SQL in <strong>supabase-schema.sql</strong>, start the Vite app, and deploy the same project to Vercel.
        </div>
      </div>
    </div>
  );
}
