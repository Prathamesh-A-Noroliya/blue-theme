import { useState, useEffect } from "react";
import { useGetSensorOverview, useGetSensorFeed, useGetSensorAnalytics, useGetSensorAlerts } from "@workspace/api-client-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Radio, Activity, AlertTriangle, TrendingUp, Zap, Play, Pause, RefreshCw } from "lucide-react";

const MOCK_OVERVIEW = {
  activeSensors: 12, roadsMonitored: 6, liveAnomalyCount: 3,
  avgVibrationScore: 5.8, currentStressLevel: "medium", criticalZones: 2,
  dataPointsToday: 2847, uptime: 99.4,
};

const MOCK_FEED = [
  { id: 1, roadId: 1, roadName: "Katraj Tunnel Entrance", timestamp: "08:01:23", vibrationIntensity: 7.2, shockSpikes: 9, roughnessIndex: 8.1, temperature: 31.2, humidity: 65, sensorStatus: "active", damageClassification: "rough road", damageProbability: 0.62 },
  { id: 2, roadId: 2, roadName: "Hadapsar Junction", timestamp: "08:02:15", vibrationIntensity: 0.0, shockSpikes: 0, roughnessIndex: 0.0, temperature: 30.0, humidity: 80, sensorStatus: "offline", damageClassification: "no data", damageProbability: 0.0 },
  { id: 3, roadId: 3, roadName: "NH-48 near Khopoli", timestamp: "08:03:44", vibrationIntensity: 9.1, shockSpikes: 14, roughnessIndex: 10.5, temperature: 32.1, humidity: 60, sensorStatus: "critical", damageClassification: "likely failure zone", damageProbability: 0.93 },
  { id: 4, roadId: 4, roadName: "Baner Road", timestamp: "08:04:02", vibrationIntensity: 4.2, shockSpikes: 3, roughnessIndex: 5.1, temperature: 28.5, humidity: 72, sensorStatus: "active", damageClassification: "rough road", damageProbability: 0.45 },
  { id: 5, roadId: 5, roadName: "Nashik Phata, Pimpri", timestamp: "08:05:17", vibrationIntensity: 6.8, shockSpikes: 7, roughnessIndex: 7.4, temperature: 29.5, humidity: 75, sensorStatus: "maintenance", damageClassification: "monitoring", damageProbability: 0.55 },
];

const MOCK_ANALYTICS = {
  vibrationTrend: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    "NH-48 Khopoli": 7 + Math.random() * 3,
    "Katraj Tunnel": 8 + Math.random() * 2,
    "Baner Road": 3 + Math.random() * 2,
    "Nashik Phata": 1.5 + Math.random(),
  })),
  anomalyByRoad: [
    { road: "NH-48 Khopoli", count: 15, severity: "critical" },
    { road: "Katraj Tunnel", count: 12, severity: "critical" },
    { road: "Nashik Phata", count: 9, severity: "high" },
    { road: "Baner Road", count: 6, severity: "medium" },
    { road: "Swargate", count: 5, severity: "medium" },
    { road: "Hadapsar", count: 0, severity: "low" },
  ],
  conditionDistribution: [
    { condition: "Smooth", percentage: 25, count: 2 },
    { condition: "Rough", percentage: 37.5, count: 3 },
    { condition: "Anomaly", percentage: 25, count: 2 },
    { condition: "Critical", percentage: 12.5, count: 1 },
  ],
  stressTrend: Array.from({ length: 30 }, (_, i) => ({
    date: `Apr ${i + 1}`,
    stress: 3.5 + Math.sin(i * 0.3) * 1.5 + (i > 20 ? (i - 20) * 0.15 : 0),
  })),
  predictedFailures7Days: 2,
  predictedFailures30Days: 5,
};

const MOCK_ALERTS = [
  { id: 1, roadId: 3, roadName: "NH-48 near Khopoli", alertType: "Critical Anomaly", message: "Repeated high vibration detected. Likely crack formation imminent.", severity: "critical", timestamp: "08:03:44", resolved: false },
  { id: 2, roadId: 1, roadName: "Katraj Tunnel Entrance", alertType: "Stress Warning", message: "Vibration trend rising for 5 days. Monitor closely.", severity: "high", timestamp: "08:01:23", resolved: false },
  { id: 3, roadId: 2, roadName: "Hadapsar Junction", alertType: "Sensor Offline", message: "Sensor S-02 has been offline for 2 hours. Maintenance dispatch required.", severity: "high", timestamp: "06:30:00", resolved: false },
  { id: 4, roadId: 5, roadName: "Nashik Phata, Pimpri", alertType: "Maintenance", message: "Scheduled calibration in progress. Data quality may vary.", severity: "medium", timestamp: "07:00:00", resolved: false },
];

const CONDITION_COLORS = ["#16A34A", "#0EA5A4", "#F59E0B", "#DC2626"];
const SEVERITY_COLOR: Record<string, string> = { critical: "#DC2626", high: "#F59E0B", medium: "#0EA5A4", low: "#16A34A" };

function StatCard({ label, value, sub, icon: Icon, color }: any) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {sub && <span className="text-xs px-1.5 py-0.5 rounded-full pulse-glow" style={{ background: `${color}20`, color }}>LIVE</span>}
      </div>
      <div className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default function Sensors() {
  const { data: overview } = useGetSensorOverview();
  const { data: feedData } = useGetSensorFeed();
  const { data: analyticsData } = useGetSensorAnalytics();
  const { data: alertsData } = useGetSensorAlerts();
  const [simRunning, setSimRunning] = useState(false);
  const [segment, setSegment] = useState("all");
  const [traffic, setTraffic] = useState(50);
  const [rainfall, setRainfall] = useState(0);
  const [liveVibration, setLiveVibration] = useState(MOCK_ANALYTICS.vibrationTrend);

  const ov = overview ?? MOCK_OVERVIEW;
  const feed = feedData ?? MOCK_FEED;
  const analytics = analyticsData ?? MOCK_ANALYTICS;
  const alerts = alertsData ?? MOCK_ALERTS;

  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      setLiveVibration(prev => {
        const newPoint = {
          time: new Date().toTimeString().slice(0, 5),
          "NH-48 Khopoli": 6 + Math.random() * 4 + (rainfall / 100) * 2,
          "Katraj Tunnel": 7 + Math.random() * 3 + (traffic / 100) * 2,
          "Baner Road": 3 + Math.random() * 2,
          "Nashik Phata": 1 + Math.random(),
        };
        return [...prev.slice(-20), newPoint];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [simRunning, traffic, rainfall]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>RoadSense Sensor Intelligence</h1>
            <span className="text-xs px-2 py-0.5 rounded-full pulse-glow" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>LIVE</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">IoT sensor network monitoring road health in real-time</p>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Sensors" value={ov.activeSensors} icon={Radio} color="#0EA5A4" sub="live" />
        <StatCard label="Roads Monitored" value={ov.roadsMonitored} icon={Activity} color="#16A34A" sub="live" />
        <StatCard label="Live Anomalies" value={ov.liveAnomalyCount} icon={AlertTriangle} color="#DC2626" sub="live" />
        <StatCard label="Avg Vibration" value={`${ov.avgVibrationScore}/10`} icon={TrendingUp} color="#F59E0B" sub="live" />
      </div>

      {/* Simulation Controls */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Sensor Simulation Controls</h3>
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: simRunning ? "rgba(22,163,74,0.15)" : "hsl(var(--muted))", color: simRunning ? "#16A34A" : "hsl(var(--muted-foreground))" }}>
            {simRunning ? "RUNNING" : "PAUSED"}
          </span>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex gap-2">
            <button onClick={() => setSimRunning(!simRunning)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: simRunning ? "#DC262620" : "rgba(14,165,164,0.15)", color: simRunning ? "#DC2626" : "#0EA5A4" }}>
              {simRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
            </button>
            <button onClick={() => { setSimRunning(false); setTraffic(50); setRainfall(0); }} className="px-3 py-2 rounded-xl text-sm" style={{ background: "hsl(var(--muted))" }}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Road Segment</label>
            <select value={segment} onChange={e => setSegment(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <option value="all">All Segments</option>
              <option value="nh48">NH-48 Khopoli</option>
              <option value="katraj">Katraj Tunnel</option>
              <option value="baner">Baner Road</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Traffic Load: {traffic}%</label>
            <input type="range" min={0} max={100} value={traffic} onChange={e => setTraffic(Number(e.target.value))} className="w-full accent-teal-500" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Rainfall Effect: {rainfall}%</label>
            <input type="range" min={0} max={100} value={rainfall} onChange={e => setRainfall(Number(e.target.value))} className="w-full accent-teal-500" />
          </div>
        </div>
      </div>

      {/* Vibration Trend Chart */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Vibration Over Time</h3>
          {simRunning && <span className="text-xs px-2 py-0.5 rounded-full pulse-glow" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>LIVE UPDATE</span>}
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={liveVibration.slice(-24)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="NH-48 Khopoli" stroke="#DC2626" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Katraj Tunnel" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Baner Road" stroke="#0EA5A4" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Nashik Phata" stroke="#16A34A" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Anomalies by Road */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Anomalies by Road</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.anomalyByRoad} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="road" type="category" tick={{ fontSize: 9 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {analytics.anomalyByRoad.map((entry: any, i: number) => (
                  <Cell key={i} fill={SEVERITY_COLOR[entry.severity] ?? "#64748B"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Condition Distribution */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Road Condition Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={analytics.conditionDistribution} dataKey="percentage" nameKey="condition" cx="50%" cy="50%" innerRadius={40} outerRadius={65} label={({ condition, percentage }) => `${condition} ${percentage}%`}>
                {analytics.conditionDistribution.map((_: any, i: number) => <Cell key={i} fill={CONDITION_COLORS[i % 4]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {analytics.conditionDistribution.map((d: any, i: number) => (
              <div key={d.condition} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: CONDITION_COLORS[i % 4] }} />
                <span className="text-muted-foreground">{d.condition}: {d.count} roads</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction panel */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Predicted Failures</h3>
          <div className="p-4 rounded-xl" style={{ background: "#DC262612", border: "1px solid #DC262630" }}>
            <div className="text-xs text-muted-foreground">Next 7 Days</div>
            <div className="text-3xl font-bold mt-1" style={{ color: "#DC2626", fontFamily: "Sora, sans-serif" }}>
              {analytics.predictedFailures7Days}
            </div>
            <div className="text-xs mt-1" style={{ color: "#DC2626" }}>roads likely to fail</div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "#F59E0B12", border: "1px solid #F59E0B30" }}>
            <div className="text-xs text-muted-foreground">Next 30 Days</div>
            <div className="text-3xl font-bold mt-1" style={{ color: "#F59E0B", fontFamily: "Sora, sans-serif" }}>
              {analytics.predictedFailures30Days}
            </div>
            <div className="text-xs mt-1" style={{ color: "#F59E0B" }}>roads predicted to fail</div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: "rgba(14,165,164,0.08)", border: "1px solid rgba(14,165,164,0.2)" }}>
            <div className="text-xs text-muted-foreground">Platform Uptime</div>
            <div className="text-2xl font-bold mt-1" style={{ color: "#0EA5A4", fontFamily: "Sora, sans-serif" }}>{ov.uptime}%</div>
          </div>
        </div>
      </div>

      {/* Road Stress Trend */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Road Stress Index — 30 Day Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={analytics.stressTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
            <YAxis domain={[0, 8]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="stress" stroke="#0EA5A4" fill="rgba(14,165,164,0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Live sensor feed */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <Radio className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Live Sensor Feed</h3>
          <span className="text-xs px-2 py-0.5 rounded-full ml-2 pulse-glow" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>STREAMING</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
              {["Road", "Time", "Vibration", "Shock Spikes", "Roughness", "Temp", "Status", "Classification", "Damage %"].map(h => (
                <th key={h} className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {feed.map((r: any) => (
              <tr key={r.id} className="hover:opacity-80 transition-opacity">
                <td className="px-4 py-3 font-medium text-sm">{r.roadName}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.timestamp}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <div className="h-full rounded-full" style={{ width: `${(r.vibrationIntensity / 12) * 100}%`, background: r.vibrationIntensity > 7 ? "#DC2626" : r.vibrationIntensity > 4 ? "#F59E0B" : "#16A34A" }} />
                    </div>
                    <span className="text-xs font-mono">{r.vibrationIntensity?.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">{r.shockSpikes}</td>
                <td className="px-4 py-3 text-sm">{r.roughnessIndex?.toFixed(1)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{r.temperature?.toFixed(1)}°C</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: r.sensorStatus === "critical" ? "#DC262618" : "rgba(14,165,164,0.15)", color: r.sensorStatus === "critical" ? "#DC2626" : "#0EA5A4" }}>
                    {r.sensorStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{r.damageClassification}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold" style={{ color: r.damageProbability > 0.7 ? "#DC2626" : r.damageProbability > 0.4 ? "#F59E0B" : "#16A34A" }}>
                    {(r.damageProbability * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sensor Alerts */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <AlertTriangle className="w-4 h-4" style={{ color: "#F59E0B" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Sensor-Triggered Alerts</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {alerts.map((a: any) => (
            <div key={a.id} className="flex items-start gap-4 px-5 py-4">
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: SEVERITY_COLOR[a.severity] }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{a.roadName}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${SEVERITY_COLOR[a.severity]}20`, color: SEVERITY_COLOR[a.severity] }}>{a.alertType}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.message}</div>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{a.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
