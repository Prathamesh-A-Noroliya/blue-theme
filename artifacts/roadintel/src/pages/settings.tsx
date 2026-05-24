import { useState, useEffect } from "react";
import { Bell, Globe, Shield, Eye, Download, CheckCircle, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

type Profile = { name: string; email: string; role: string };

function loadProfile(): Profile {
  if (typeof window === "undefined") return { name: "", email: "", role: "" };
  try {
    const raw = localStorage.getItem("roadintel_profile");
    return raw ? JSON.parse(raw) as Profile : { name: "", email: "", role: "" };
  } catch { return { name: "", email: "", role: "" }; }
}

function saveProfile(data: { name: string; email: string; role: string }) {
  if (typeof window !== "undefined") localStorage.setItem("roadintel_profile", JSON.stringify(data));
}

function loadTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("roadintel_theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

function applyTheme(theme: "dark" | "light") {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function Settings() {
  const { t, lang, setLang } = useLanguage();
  const { user, isGuest, logout } = useAuth();
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [savedMsg, setSavedMsg] = useState(false);
  const [theme, setThemeState] = useState<"dark" | "light">(loadTheme);
  const [notifComplaints, setNotifComplaints] = useState(true);
  const [notifSensor, setNotifSensor] = useState(true);
  const [notifBudget, setNotifBudget] = useState(true);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t: "dark" | "light") => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("roadintel_theme", t);
  };

  const handleSave = () => {
    saveProfile(profile);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className="w-12 h-6 rounded-full relative transition-colors"
        style={{ background: value ? "#0EA5A4" : "hsl(var(--muted))" }}
      >
        <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: value ? "26px" : "2px" }} />
      </button>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>{t("page_title_settings")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("page_subtitle_settings")}</p>
      </div>

      {/* Profile */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>{t("settings_profile")}</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("settings_name")}</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("settings_email")}</label>
              <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("settings_role")}</label>
            <input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Citizen, Engineer, Journalist"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "#0EA5A4" }}>{t("btn_save")}</button>
            {savedMsg && (
              <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#16A34A" }}>
                <CheckCircle className="w-3.5 h-3.5" /> {t("settings_save_success")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Complaint Updates", sub: "Notify when your complaints are updated", value: notifComplaints, onChange: setNotifComplaints },
            { label: "Sensor Alerts", sub: "Critical sensor anomalies near your location", value: notifSensor, onChange: setNotifSensor },
            { label: "Budget Alerts", sub: "Suspicious spending patterns flagged by AI", value: notifBudget, onChange: setNotifBudget },
          ].map(({ label, sub, value, onChange }) => (
            <div key={label} className="flex items-center justify-between">
              <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{sub}</div></div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>{t("settings_theme")} & {t("settings_language")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("settings_language")}</label>
            <select value={lang} onChange={e => setLang(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("settings_theme")}</label>
            <select value={theme} onChange={e => setTheme(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <LogOut className="w-4 h-4" style={{ color: "#DC2626" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>{t("btn_signout")}</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {isGuest ? t("lbl_signed_in_as") + " " + t("lbl_guest") : t("lbl_signed_in_as") + " " + (user.email || "")}
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 transition-colors"
          >
            {t("btn_signout")}
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Privacy & Data</h3>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Your data is used to improve road condition detection and provide localized alerts. No personal data is shared with contractors or authorities without consent.</div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))" }}>
              <Download className="w-4 h-4" /> Export My Data
            </button>
          </div>
        </div>
      </div>

      {/* System info */}
      <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--muted))" }}>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Platform Version: RoadIntel Pilot v1.0</div>
          <div>Pune Metropolitan Zone — Maharashtra Road Safety Initiative</div>
          <div>Demo Data — May 2026</div>
        </div>
      </div>
    </div>
  );
}
