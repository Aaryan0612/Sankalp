import { LoaderCircle } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="setup-shell">
      <div className="setup-card">
        <div className="eyebrow">Loading</div>
        <h1 className="hero-title">Booting your accountability system.</h1>
        <div className="inline-badge">
          <LoaderCircle size={16} strokeWidth={2.2} className="spin" />
          Preparing your dashboard
        </div>
      </div>
    </div>
  );
}
