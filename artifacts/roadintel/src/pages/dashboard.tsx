import { useMemo } from "react";
import { Link } from "wouter";
import { FileText, Scan, Map, Radio, TrendingDown, Wallet, AlertTriangle, Activity, ArrowUpRight, Bell, Shield } from "lucide-react";
import { useGetDashboardSummary, useGetRecentActivity, useGetAiInsights, useListNotifications } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import { getHealthColor, getRiskColor } from "@/lib/utils";

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="text-xs mt-1 text-muted-foreground">{sub}</div>}
    </div>
  );
}

const MONTHLY_COMPLAINTS = [
  { month: "Jan", count: 42 }, { month: "Feb", count: 38 }, { month: "Mar", count: 55 },
  { month: "Apr", count: 49 }, { month: "May", count: 61 }, { month: "Jun", count: 47 },
];

const QUICK_ACTIONS = [
  { labelKey: "nav_complaints", href: "/complaints", icon: FileText, color: "#0EA5A4" },
  { labelKey: "nav_scan", href: "/scan", icon: Scan, color: "#F59E0B" },
  { labelKey: "nav_roads", href: "/roads", icon: Map, color: "#16A34A" },
  { labelKey: "nav_sensors", href: "/sensors", icon: Radio, color: "#0EA5A4" },
  { labelKey: "nav_riskmap", href: "/risk-map", icon: TrendingDown, color: "#DC2626" },
  { labelKey: "nav_spending", href: "/spending", icon: Wallet, color: "#F59E0B" },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: summary } = useGetDashboardSummary();
  const { data: activity } = useGetRecentActivity();
  const { data: insights } = useGetAiInsights();
  const { data: notifications } = useListNotifications();

  const stats = useMemo(() => ({
    complaints: summary?.totalComplaints ?? 847,
    activeIssues: summary?.activeComplaints ?? 3,
    roadsMonitored: summary?.roadsMonitored ?? 8,
    anomalies: summary?.sensorAnomalies ?? 3,
    avgHealth: summary?.avgHealthScore?.toFixed(0) ?? 61,
  }), [summary]);

  return (
    <div className="p-6 space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-2xl" style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #0EA5A4 100%)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-white/70" />
              <span className="text-xs font-medium text-white/70">{t("pilot_label")}</span>
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel — Pune Road Safety Intelligence Platform</h1>
            <p className="text-sm mt-1 text-white/70">Pilot Phase | Pune Metropolitan Zone | Powered by real-time sensor & complaint data</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
            <Activity className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label={t("dashboard_complaints")} value={stats.complaints} icon={FileText} color="#0EA5A4" sub={t("pilot_label")} />
        <StatCard label="Active Issues" value={stats.activeIssues} icon={AlertTriangle} color="#DC2626" />
        <StatCard label="Roads Monitored" value={stats.roadsMonitored} icon={Map} color="#16A34A" />
        <StatCard label={t("dashboard_sensors")} value={`${stats.anomalies} today`} icon={Radio} color="#F59E0B" />
        <StatCard label="Avg Health Score" value={`${stats.avgHealth}/100`} icon={Activity} color="#0EA5A4" />
      </div>

      {/* Monthly complaints chart */}
      <div className="rounded-2xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>Monthly Complaints Trend — Pune Pilot Zone</h3>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>2024</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_COMPLAINTS}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="count" fill="#0EA5A4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ labelKey, href, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <div className="p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-xs font-medium">{t(labelKey)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Recent Activity</h3>
            <Link href="/analytics">
              <button className="text-xs flex items-center gap-1" style={{ color: "#0EA5A4" }}>View all <ArrowUpRight className="w-3 h-3" /></button>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {(activity ?? PUNE_ACTIVITY).slice(0, 6).map((item: any) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: item.severity === "critical" ? "#DC2626" : item.severity === "high" ? "#F59E0B" : "#0EA5A4" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.message}</div>
                  <div className="text-xs text-muted-foreground">{item.location} · {item.timestamp}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: item.severity === "critical" ? "#DC262618" : item.severity === "high" ? "#F59E0B18" : "#0EA5A418", color: item.severity === "critical" ? "#DC2626" : item.severity === "high" ? "#F59E0B" : "#0EA5A4" }}>{item.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications + AI Insights */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <Bell className="w-4 h-4" />
              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Notifications</h3>
              {(notifications?.filter(n => !n.read).length ?? 0) > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white" style={{ background: "#DC2626" }}>{notifications?.filter(n => !n.read).length}</span>
              )}
            </div>
            <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {(notifications ?? PUNE_NOTIFICATIONS).slice(0, 4).map((n: any) => (
                <div key={n.id} className="px-5 py-3">
                  <div className={`text-xs font-medium flex items-center gap-1.5 ${!n.read ? "" : "opacity-60"}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.severity === "critical" ? "#DC2626" : n.severity === "high" ? "#F59E0B" : "#0EA5A4" }} />
                    {n.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>AI Insights</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>AI</span>
            </div>
            <div className="p-4 space-y-3">
              {(insights ?? PUNE_INSIGHTS).slice(0, 3).map((i: any) => (
                <div key={i.id} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-xs font-semibold mb-1">{i.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{i.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: i.severity === "critical" ? "#DC262618" : "#F59E0B18", color: i.severity === "critical" ? "#DC2626" : "#F59E0B" }}>{i.severity}</div>
                    <div className="text-xs text-muted-foreground">{i.confidence ? `${(i.confidence * 100).toFixed(0)}% confidence` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PUNE_ACTIVITY = [
  { id: 1, message: "Critical: Pothole cluster on FC Road near Goodluck Chowk", location: "Pune", timestamp: "2 min ago", severity: "critical", type: "complaint" },
  { id: 2, message: "Sensor S-02 offline at Hadapsar Junction", location: "Pune", timestamp: "1 hr ago", severity: "high", type: "sensor" },
  { id: 3, message: "Risk alert: NH-48 near Khopoli vibration spike detected", location: "Khopoli", timestamp: "3 hrs ago", severity: "critical", type: "sensor" },
  { id: 4, message: "New complaint: Broken divider on Baner Road", location: "Pune", timestamp: "4 hrs ago", severity: "high", type: "complaint" },
  { id: 5, message: "Contractor report: Swargate flyover repair phase 2 complete", location: "Pune", timestamp: "6 hrs ago", severity: "info", type: "repair" },
  { id: 6, message: "Waterlogging alert: Swargate underpass during rains", location: "Pune", timestamp: "8 hrs ago", severity: "medium", type: "complaint" },
];

const PUNE_NOTIFICATIONS = [
  { id: 1, title: "New pothole complaint filed", message: "FC Road near Goodluck Chowk — flagged as high priority", read: false, severity: "high" },
  { id: 2, title: "Sensor S-02 went offline", message: "Hadapsar Junction sensor needs maintenance check", read: false, severity: "critical" },
  { id: 3, title: "Risk alert issued", message: "NH-48 near Khopoli — vibration anomaly detected by S-03", read: false, severity: "high" },
  { id: 4, title: "Contractor report submitted", message: "Swargate flyover repair — PMC contractor status updated", read: true, severity: "info" },
];

const PUNE_INSIGHTS = [
  { id: 1, title: "High repeat failure risk on Katraj Ghat", description: "12 incidents recorded Jan–Mar 2024. Sensor data shows consistent stress pattern.", severity: "critical", confidence: 0.91 },
  { id: 2, title: "Budget anomaly: Swargate flyover repair", description: "Repair cost 23% above allocated budget. Quality audit recommended.", severity: "high", confidence: 0.84 },
  { id: 3, title: "Predicted failure: NH-48 KM 42", description: "Vibration trend rising for 14 days. Predicted crack formation within 10 days.", severity: "critical", confidence: 0.93 },
];
