import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";

const MOCK_ANALYTICS = {
  complaintsOverTime: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    filed: Math.floor(300 + Math.random() * 400),
    resolved: Math.floor(200 + Math.random() * 300),
    escalated: Math.floor(10 + Math.random() * 50),
  })),
  healthTrendAllRoads: Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    avgHealth: 78 - i * 1.2 + Math.random() * 3,
    critical: Math.floor(1 + i * 0.3),
  })),
  repairEfficiency: [
    { contractor: "NHAI Pune Zone", onTime: 85, budget: 82, quality: 71 },
    { contractor: "PMC Road Dept", onTime: 74, budget: 70, quality: 62 },
    { contractor: "MSRDC Pune", onTime: 68, budget: 65, quality: 58 },
    { contractor: "PWD Pune Division", onTime: 55, budget: 48, quality: 60 },
  ],
  issuesByCity: [
    { city: "Pune", critical: 5, high: 15, medium: 25, low: 52 },
    { city: "Pimpri-Chinchwad", critical: 2, high: 8, medium: 12, low: 35 },
    { city: "Khopoli", critical: 4, high: 6, medium: 4, low: 8 },
    { city: "Satara", critical: 1, high: 3, medium: 6, low: 18 },
    { city: "Nashik", critical: 1, high: 4, medium: 9, low: 22 },
  ],
};

export default function Analytics() {
  const data = MOCK_ANALYTICS;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive platform performance metrics</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Complaints Filed (YTD)", value: "4,328", icon: BarChart3, color: "#0EA5A4", trend: "+12.4%" },
          { label: "Resolution Rate", value: "72%", icon: TrendingUp, color: "#16A34A", trend: "+4%" },
          { label: "Avg Resolution Time", value: "18 days", icon: Activity, color: "#F59E0B", trend: "-2 days" },
          { label: "Network Health", value: "62/100", icon: TrendingDown, color: "#DC2626", trend: "-6 pts" },
        ].map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" style={{ color }} />
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>{trend}</span>
            </div>
            <div className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Complaints over time */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Complaints Filed vs Resolved (Monthly)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data.complaintsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="filed" name="Filed" stroke="#0EA5A4" fill="rgba(14,165,164,0.12)" strokeWidth={2} />
            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16A34A" fill="rgba(22,163,74,0.10)" strokeWidth={2} />
            <Area type="monotone" dataKey="escalated" name="Escalated" stroke="#DC2626" fill="rgba(220,38,38,0.08)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health trend */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Network Health Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.healthTrendAllRoads}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgHealth" name="Avg Health" stroke="#0EA5A4" strokeWidth={2} />
              <Line type="monotone" dataKey="critical" name="Critical Roads" stroke="#DC2626" strokeWidth={2} yAxisId={0} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Contractor efficiency */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Contractor Efficiency Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.repairEfficiency} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="contractor" type="category" tick={{ fontSize: 9 }} width={70} />
              <Tooltip />
              <Legend />
              <Bar dataKey="quality" name="Quality" fill="#0EA5A4" radius={[0, 3, 3, 0]} />
              <Bar dataKey="onTime" name="On-Time" fill="#16A34A" radius={[0, 3, 3, 0]} />
              <Bar dataKey="budget" name="Budget" fill="#F59E0B" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Issues by city */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Issues by City & Severity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.issuesByCity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="city" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="critical" name="Critical" stackId="a" fill="#DC2626" />
            <Bar dataKey="high" name="High" stackId="a" fill="#F59E0B" />
            <Bar dataKey="medium" name="Medium" stackId="a" fill="#0EA5A4" />
            <Bar dataKey="low" name="Low" stackId="a" fill="#16A34A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
