import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Scan, Map, TrendingDown, Wallet,
  Radio, Users, BarChart3, Settings, Bell, Menu, X, ChevronRight,
  Shield, Activity, Siren, Bot, CreditCard, Globe, LogOut
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ChatbotPanel } from "@/components/chatbot-panel";

const navItems: { key: string; href: string; icon: React.ElementType; group: string; badge?: string }[] = [
  { key: "nav_dashboard", href: "/dashboard", icon: LayoutDashboard, group: "main" },
  { key: "nav_complaints", href: "/complaints", icon: FileText, group: "main" },
  { key: "nav_scan", href: "/scan", icon: Scan, group: "main" },
  { key: "nav_assistant", href: "/assistant", icon: Bot, group: "main" },
  { key: "nav_roads", href: "/roads", icon: Map, group: "intel" },
  { key: "nav_riskmap", href: "/risk-map", icon: TrendingDown, group: "intel" },
  { key: "nav_spending", href: "/spending", icon: Wallet, group: "intel" },
  { key: "nav_sensors", href: "/sensors", icon: Radio, group: "intel" },
  { key: "nav_contractors", href: "/contractors", icon: Users, group: "intel" },
  { key: "nav_analytics", href: "/analytics", icon: BarChart3, group: "intel" },
  { key: "nav_sos", href: "/sos", icon: Siren, group: "emergency" },
  { key: "nav_subscribe", href: "/subscribe", icon: CreditCard, group: "account" },
  { key: "nav_settings", href: "/settings", icon: Settings, group: "account" },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  SOS: { bg: "rgba(229,57,53,0.2)", color: "#E53935" },
};

const NOTIFICATIONS = [
  { id: 1, title: "New pothole complaint filed — FC Road, Pune", time: "2 min ago", read: false, severity: "high" },
  { id: 2, title: "Sensor S-02 went offline — Hadapsar Junction", time: "1 hr ago", read: false, severity: "critical" },
  { id: 3, title: "Risk alert issued — NH-48 near Khopoli", time: "3 hrs ago", read: false, severity: "high" },
  { id: 4, title: "Contractor report submitted — Swargate flyover repair", time: "Yesterday", read: false, severity: "info" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, lang } = useLanguage();
  const { user, isGuest, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const groupLabels: Record<string, string> = {
    main: t("group_navigation"),
    intel: t("group_intelligence"),
    emergency: t("group_emergency"),
    account: t("group_account"),
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #111827 0%, #0b111b 45%, #082f49 100%)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 text-white ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0a0f1a", borderRight: "1px solid rgba(77,171,247,0.1)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid rgba(77,171,247,0.1)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4dabf7, #82cfff)" }}>
            <Shield className="w-4 h-4 text-[#07111f]" />
          </div>
          <div>
            <div className="font-bold text-white text-sm" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel</div>
            <div className="text-xs" style={{ color: "#4dabf7" }}>{t("pilot_version")}</div>
          </div>
          <button className="ml-auto lg:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {["main", "intel", "emergency", "account"].map(gkey => (
            <div key={gkey}>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
                {groupLabels[gkey]}
              </div>
              <div className="space-y-0.5 mt-1">
                {navItems.filter(n => n.group === gkey).map(({ key, href, icon: Icon, badge }) => {
                  const active = location === href;
                  const badgeStyle = badge ? BADGE_COLORS[badge] : null;
                  return (
                    <Link key={href} href={href}>
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm"
                        style={{
                          background: active ? "rgba(77,171,247,0.12)" : "transparent",
                          color: active ? "#4dabf7" : "#94a3b8",
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "rgba(77,171,247,0.06)"; (e.currentTarget as HTMLDivElement).style.color = "#cbd5e1"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = active ? "rgba(77,171,247,0.12)" : "transparent"; (e.currentTarget as HTMLDivElement).style.color = active ? "#4dabf7" : "#94a3b8"; }}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={key === "nav_sos" ? { color: active ? "#4dabf7" : "#ef4444" } : {}} />
                        <span>{t(key)}</span>
                        {active && !badge && <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#4dabf7" }} />}
                        {badge && badgeStyle && (
                          <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: badgeStyle.bg, color: badgeStyle.color }}>{badge}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Language quick picker */}
        <div className="px-4 py-2" style={{ borderTop: "1px solid rgba(77,171,247,0.1)" }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
            <Globe className="w-3 h-3" />
            <span>{lang.toUpperCase()}</span>
            <Link href="/settings"><span className="ml-auto underline cursor-pointer hover:opacity-70" style={{ color: "#4dabf7" }}>{t("btn_view")}</span></Link>
          </div>
        </div>

        {/* Bottom info */}
        <div className="px-4 py-3 space-y-1" style={{ borderTop: "1px solid rgba(77,171,247,0.1)" }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
            <Activity className="w-3 h-3" style={{ color: "#22c55e" }} />
            <span>{t("all_systems")}</span>
          </div>
          <div className="text-xs" style={{ color: "#4dabf7" }}>{t("pilot_version")}</div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 py-3 shrink-0 text-white" style={{ background: "#0c1220", borderBottom: "1px solid rgba(77,171,247,0.1)" }}>
          <button className="lg:hidden p-2 rounded-lg text-white" style={{ background: "rgba(77,171,247,0.08)" }} onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="text-xs" style={{ color: "#64748b" }}>{t("welcome_back")}, <span style={{ color: "#94a3b8" }}>{user.name || "Demo User"}</span></div>
          </div>
          <div className="flex items-center gap-2">
            {/* SOS quick button */}
            <Link href="/sos">
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
                <Siren className="w-3.5 h-3.5" /> SOS
              </button>
            </Link>
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg transition-colors" style={{ color: "#94a3b8" }}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold" style={{ background: "#DC2626" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <h4 className="font-semibold text-sm">{t("notif_title")}</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "#0EA5A4" }}>
                        {t("notif_markread")}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">{t("notif_empty")}</div>
                    ) : (
                      notifs.map(n => (
                        <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b" style={{ borderColor: "hsl(var(--border))", opacity: n.read ? 0.6 : 1 }}>
                          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.severity === "critical" ? "#DC2626" : n.severity === "high" ? "#F59E0B" : "#0EA5A4" }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{n.title}</div>
                            <div className="text-xs text-muted-foreground">{n.time}</div>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#0EA5A4" }} />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#07111f]" style={{ background: "linear-gradient(135deg, #4dabf7, #82cfff)" }}>
              {(user.name || "D").charAt(0).toUpperCase()}
            </div>
            {/* Sign Out */}
            <button
              onClick={() => { logout(); setLocation("/login"); }}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#64748b" }}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>

        {/* Footer note */}
        <footer className="px-4 py-2 text-center text-[10px]" style={{ color: "#475569", borderTop: "1px solid rgba(77,171,247,0.1)", background: "#0c1220" }}>
          {t("footer_note")}
        </footer>
      </div>

      {/* Chatbot FAB */}
      <button onClick={() => setChatOpen(true)} className="fixed bottom-10 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center pulse-glow"
        style={{ background: "hsl(var(--sidebar-primary))" }} title="AI Assistant">
        <Bot className="w-6 h-6 text-white" />
      </button>
      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
