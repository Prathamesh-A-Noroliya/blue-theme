import { useMemo, type ElementType } from "react";
import { Link } from "wouter";
import {
  FileText,
  Scan,
  Map,
  Radio,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Bell,
  Shield,
} from "lucide-react";
import {
  useGetDashboardSummary,
  useGetRecentActivity,
  useGetAiInsights,
  useListNotifications,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

type DashboardSummary = {
  totalComplaints?: number;
  activeComplaints?: number;
  roadsMonitored?: number;
  sensorAnomalies?: number;
  avgHealthScore?: number;
};

type ActivityItem = {
  id: string | number;
  message: string;
  location?: string;
  timestamp?: string;
  severity?: string;
  type?: string;
};

type NotificationItem = {
  id: string | number;
  title: string;
  message?: string;
  read?: boolean;
  severity?: string;
};

type InsightItem = {
  id: string | number;
  title: string;
  description?: string;
  severity?: string;
  confidence?: number;
};

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }

  if (
    value &&
    typeof value === "object" &&
    "items" in value &&
    Array.isArray((value as { items?: unknown }).items)
  ) {
    return (value as { items: T[] }).items;
  }

  if (
    value &&
    typeof value === "object" &&
    "results" in value &&
    Array.isArray((value as { results?: unknown }).results)
  ) {
    return (value as { results: T[] }).results;
  }

  return [];
}

function getSeverityColor(severity?: string) {
  switch (String(severity || "").toLowerCase()) {
    case "critical":
      return "#DC2626";
    case "high":
      return "#F59E0B";
    case "medium":
      return "#0EA5A4";
    case "low":
      return "#16A34A";
    case "info":
      return "#4dabf7";
    default:
      return "#64748B";
  }
}

function getSoftSeverityBg(severity?: string) {
  switch (String(severity || "").toLowerCase()) {
    case "critical":
      return "#DC262618";
    case "high":
      return "#F59E0B18";
    case "medium":
      return "#0EA5A418";
    case "low":
      return "#16A34A18";
    case "info":
      return "#4dabf718";
    default:
      return "#64748B18";
  }
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: ElementType;
  sub?: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(17,22,31,0.92)",
        border: "1px solid rgba(148,163,184,0.12)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(77,171,247,0.12)" }}
        >
          <Icon className="w-5 h-5" style={{ color: "#4dabf7" }} />
        </div>
      </div>

      <div
        className="text-2xl font-bold mb-0.5"
        style={{ color: "#f8fafc", fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>

      <div className="text-sm font-medium" style={{ color: "#94a3b8" }}>
        {label}
      </div>

      {sub ? (
        <div className="text-xs mt-1" style={{ color: "#64748b" }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

const MONTHLY_COMPLAINTS = [
  { month: "Jan", count: 42 },
  { month: "Feb", count: 38 },
  { month: "Mar", count: 55 },
  { month: "Apr", count: 49 },
  { month: "May", count: 61 },
  { month: "Jun", count: 47 },
];

const QUICK_ACTIONS = [
  {
    labelKey: "nav_complaints",
    fallbackLabel: "Complaints",
    href: "/complaints",
    icon: FileText,
    color: "#0EA5A4",
  },
  {
    labelKey: "nav_scan",
    fallbackLabel: "Road Scan",
    href: "/scan",
    icon: Scan,
    color: "#F59E0B",
  },
  {
    labelKey: "nav_roads",
    fallbackLabel: "Roads",
    href: "/roads",
    icon: Map,
    color: "#16A34A",
  },
  {
    labelKey: "nav_sensors",
    fallbackLabel: "Monitoring",
    href: "/sensors",
    icon: Radio,
    color: "#0EA5A4",
  },
  {
    labelKey: "nav_riskmap",
    fallbackLabel: "Risk Map",
    href: "/risk-map",
    icon: TrendingDown,
    color: "#DC2626",
  },
  {
    labelKey: "nav_spending",
    fallbackLabel: "Spending",
    href: "/spending",
    icon: Wallet,
    color: "#F59E0B",
  },
];

const PUNE_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    message: "Critical pothole cluster reported on FC Road near Goodluck Chowk",
    location: "Pune",
    timestamp: "2 min ago",
    severity: "critical",
    type: "complaint",
  },
  {
    id: 2,
    message: "Road quality monitoring input missing at Hadapsar Junction",
    location: "Pune",
    timestamp: "1 hr ago",
    severity: "high",
    type: "monitoring",
  },
  {
    id: 3,
    message: "Risk alert: NH-48 near Khopoli shows repeated surface distress",
    location: "Khopoli",
    timestamp: "3 hrs ago",
    severity: "critical",
    type: "inspection",
  },
  {
    id: 4,
    message: "New complaint: Broken divider on Baner Road",
    location: "Pune",
    timestamp: "4 hrs ago",
    severity: "high",
    type: "complaint",
  },
  {
    id: 5,
    message: "Contractor report: Swargate flyover repair phase 2 completed",
    location: "Pune",
    timestamp: "6 hrs ago",
    severity: "info",
    type: "repair",
  },
  {
    id: 6,
    message: "Waterlogging alert: Swargate underpass during rainfall",
    location: "Pune",
    timestamp: "8 hrs ago",
    severity: "medium",
    type: "complaint",
  },
];

const PUNE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New pothole complaint filed",
    message: "FC Road near Goodluck Chowk — routed to PMC Road Department",
    read: false,
    severity: "high",
  },
  {
    id: 2,
    title: "Authority routing completed",
    message: "NH road complaint assigned to NHAI Regional Office",
    read: false,
    severity: "critical",
  },
  {
    id: 3,
    title: "Risk alert issued",
    message: "NH-48 near Khopoli — repeated failure risk detected",
    read: false,
    severity: "high",
  },
  {
    id: 4,
    title: "Contractor report submitted",
    message: "Swargate flyover repair — PMC contractor status updated",
    read: true,
    severity: "info",
  },
];

const PUNE_INSIGHTS: InsightItem[] = [
  {
    id: 1,
    title: "High repeat failure risk on Katraj Ghat",
    description:
      "12 road-quality incidents recorded recently. Repair audit recommended.",
    severity: "critical",
    confidence: 0.91,
  },
  {
    id: 2,
    title: "Budget anomaly: Swargate flyover repair",
    description:
      "Reported repair cost is 23% above allocated budget. Contractor audit recommended.",
    severity: "high",
    confidence: 0.84,
  },
  {
    id: 3,
    title: "Complaint routing improvement",
    description:
      "City-road complaints are now mapped to PMC Road Department based on location and road type.",
    severity: "medium",
    confidence: 0.88,
  },
];

export default function Dashboard() {
  const { t } = useLanguage();

  const { data: summaryData } = useGetDashboardSummary();
  const { data: activityData } = useGetRecentActivity();
  const { data: insightsData } = useGetAiInsights();
  const { data: notificationsData } = useListNotifications();

  const summary = (summaryData || {}) as DashboardSummary;

  const activity = useMemo<ActivityItem[]>(() => {
    const safeActivity = toArray<ActivityItem>(activityData);
    return safeActivity.length > 0 ? safeActivity : PUNE_ACTIVITY;
  }, [activityData]);

  const notifications = useMemo<NotificationItem[]>(() => {
    const safeNotifications = toArray<NotificationItem>(notificationsData);
    return safeNotifications.length > 0
      ? safeNotifications
      : PUNE_NOTIFICATIONS;
  }, [notificationsData]);

  const insights = useMemo<InsightItem[]>(() => {
    const safeInsights = toArray<InsightItem>(insightsData);
    return safeInsights.length > 0 ? safeInsights : PUNE_INSIGHTS;
  }, [insightsData]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  const stats = useMemo(
    () => ({
      complaints: summary.totalComplaints ?? 847,
      activeIssues: summary.activeComplaints ?? 34,
      roadsMonitored: summary.roadsMonitored ?? 128,
      anomalies: summary.sensorAnomalies ?? 7,
      avgHealth:
        typeof summary.avgHealthScore === "number"
          ? summary.avgHealthScore.toFixed(0)
          : "72",
    }),
    [summary],
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(17,22,31,0.92)",
          border: "1px solid rgba(77,171,247,0.15)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: "#4dabf7" }} />
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(77,171,247,0.12)",
                  color: "#4dabf7",
                }}
              >
                {t("pilot_label") || "Pune Pilot"}
              </span>
            </div>

            <h1
              className="text-2xl font-bold"
              style={{ color: "#f8fafc", fontFamily: "Sora, sans-serif" }}
            >
              RoadWatch Dashboard — Public Road Accountability Platform
            </h1>

            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              Pune Metropolitan Zone | Road Quality, Budget Transparency,
              Contractor Accountability
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label={t("dashboard_complaints") || "Total Complaints"}
          value={stats.complaints}
          icon={FileText}
          sub={t("pilot_label") || "Pune Pilot"}
        />

        <StatCard
          label="Active Issues"
          value={stats.activeIssues}
          icon={AlertTriangle}
        />

        <StatCard
          label="Roads Monitored"
          value={stats.roadsMonitored}
          icon={Map}
        />

        <StatCard
          label={t("dashboard_sensors") || "Monitoring Alerts"}
          value={`${stats.anomalies} today`}
          icon={Radio}
        />

        <StatCard
          label="Avg Road Quality"
          value={`${stats.avgHealth}/100`}
          icon={Activity}
        />
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold text-sm"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Monthly Complaints Trend — Pune Pilot Zone
          </h3>

          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}
          >
            2026
          </span>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_COMPLAINTS}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="#0EA5A4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ labelKey, fallbackLabel, href, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <div
                className="p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>

                <div className="text-xs font-medium">
                  {t(labelKey) || fallbackLabel}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div
          className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
              Recent Activity
            </h3>

            <Link href="/analytics">
              <button
                type="button"
                className="text-xs flex items-center gap-1"
                style={{ color: "#0EA5A4" }}
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {activity.length > 0 ? (
              activity.slice(0, 6).map((item) => {
                const severityColor = getSeverityColor(item.severity);

                return (
                  <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ background: severityColor }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.message || "RoadWatch activity update"}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {item.location || "Pune"} · {item.timestamp || "Recently"}
                      </div>
                    </div>

                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: getSoftSeverityBg(item.severity),
                        color: severityColor,
                      }}
                    >
                      {item.severity || "info"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-6 text-sm text-muted-foreground">
                No recent activity available.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="flex items-center gap-2 px-5 py-4 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Bell className="w-4 h-4" />

              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
                Notifications
              </h3>

              {unreadNotificationCount > 0 ? (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#DC2626" }}
                >
                  {unreadNotificationCount}
                </span>
              ) : null}
            </div>

            <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notification) => {
                  const severityColor = getSeverityColor(notification.severity);

                  return (
                    <div key={notification.id} className="px-5 py-3">
                      <div
                        className={`text-xs font-medium flex items-center gap-1.5 ${
                          notification.read ? "opacity-60" : ""
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: severityColor }}
                        />
                        {notification.title || "RoadWatch notification"}
                      </div>

                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {notification.message || "No message available"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-6 text-sm text-muted-foreground">
                  No notifications available.
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
                AI Insights
              </h3>

              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(14,165,164,0.15)",
                  color: "#0EA5A4",
                }}
              >
                AI
              </span>
            </div>

            <div className="p-4 space-y-3">
              {insights.length > 0 ? (
                insights.slice(0, 3).map((insight) => {
                  const severityColor = getSeverityColor(insight.severity);

                  return (
                    <div
                      key={insight.id}
                      className="p-3 rounded-xl"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      <div className="text-xs font-semibold mb-1">
                        {insight.title || "RoadWatch insight"}
                      </div>

                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {insight.description || "No insight description available."}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: getSoftSeverityBg(insight.severity),
                            color: severityColor,
                          }}
                        >
                          {insight.severity || "info"}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {typeof insight.confidence === "number"
                            ? `${(insight.confidence * 100).toFixed(0)}% confidence`
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  No AI insights available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}