import { useRoute } from "wouter";
import { useGetRoad } from "@workspace/api-client-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Calendar, User, Wallet, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { getHealthColor, getRiskColor, formatCurrency } from "@/lib/utils";

const HEALTH_TREND = [
  { month: "Oct", score: 82 }, { month: "Nov", score: 80 }, { month: "Dec", score: 76 },
  { month: "Jan", score: 74 }, { month: "Feb", score: 72 }, { month: "Mar", score: 70 },
  { month: "Apr", score: 68 },
];

const MOCK_ROAD = {
  id: 1, name: "Katraj Ghat, Pune", roadType: "State Highway", location: "Pune, Maharashtra",
  constructionDate: "2018-03-15", contractorName: "PWD Maharashtra Pune Division",
  allocatedBudget: 2100000, spentBudget: 2800000,
  healthScore: 38, riskLevel: "critical", status: "deteriorating",
  totalComplaints: 12, lastRepairDate: "2024-01-15", repeatFailures: 4,
  aiSummary: "Katraj Ghat shows severe wear with 12 incidents recorded Jan–Mar 2024. Sensor data indicates extreme vibration indices (7.2/10). Four repair cycles completed in 24 months under PWD Pune Division, each averaging only 6 months lifespan vs 18-month minimum standard. Budget overrun 33%. AI recommends independent quality audit and material testing before next repair cycle.",
  healthTrend: HEALTH_TREND,
  repairHistory: [
    { id: 1, description: "Surface relaying - Phase 1", cost: 520000, contractorName: "PWD Pune Division", startDate: "2023-01-10", endDate: "2023-02-05", status: "completed", citizenVerified: true, aiValidated: true },
    { id: 2, description: "Pothole patching - Phase 2", cost: 340000, contractorName: "PWD Pune Division", startDate: "2023-07-01", endDate: "2023-07-20", status: "completed", citizenVerified: false, aiValidated: true },
    { id: 3, description: "Edge repair - Phase 3", cost: 480000, contractorName: "PWD Pune Division", startDate: "2024-01-01", endDate: "2024-01-15", status: "completed", citizenVerified: true, aiValidated: false },
  ],
};

function ScoreGauge({ score, size = 80 }: { score: number; size?: number }) {
  const color = getHealthColor(score);
  const radius = (size / 2) - 8;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold text-xl" style={{ color, fontFamily: "Sora, sans-serif" }}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export default function RoadDetail() {
  const [, params] = useRoute("/roads/:id");
  const id = Number(params?.id);
  const { data: road, isLoading } = useGetRoad(id, { query: { queryKey: ["road", id], enabled: !!id } as any });
  const r: any = road ?? MOCK_ROAD;

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading Road DNA...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>{r.name}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{r.location}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{r.contractorName}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Built {r.constructionDate}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <ScoreGauge score={r.healthScore} size={90} />
            <span className="text-xs mt-1 font-medium" style={{ color: getRiskColor(r.riskLevel) }}>
              {r.riskLevel?.toUpperCase()} RISK
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Allocated Budget", value: formatCurrency(r.allocatedBudget ?? 0), icon: Wallet, color: "#0EA5A4" },
          { label: "Spent Budget", value: formatCurrency(r.spentBudget ?? 0), icon: Wallet, color: r.spentBudget > r.allocatedBudget ? "#DC2626" : "#16A34A" },
          { label: "Total Complaints", value: r.totalComplaints ?? 0, icon: AlertTriangle, color: "#F59E0B" },
          { label: "Repeat Failures", value: r.repeatFailures ?? 0, icon: AlertTriangle, color: r.repeatFailures > 2 ? "#DC2626" : "#F59E0B" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className="text-xl font-bold" style={{ fontFamily: "Sora, sans-serif", color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Trend */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Health Score Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={r.healthTrend ?? HEALTH_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#0EA5A4" strokeWidth={2} dot={{ fill: "#0EA5A4", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Summary */}
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>AI Analysis</span>
            <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Road Intelligence Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{r.aiSummary}</p>

          {r.repeatFailures > 2 && (
            <div className="mt-4 p-3 rounded-xl flex gap-2" style={{ background: "#DC262612", border: "1px solid #DC262630" }}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
              <span className="text-xs" style={{ color: "#DC2626" }}>
                Suspicious pattern: Road has failed {r.repeatFailures} times. Corruption detector flagged.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Repair History */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Repair History</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {(r.repairHistory ?? []).map((log: any) => (
            <div key={log.id} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm">{log.description}</div>
                <div className="text-xs text-muted-foreground mt-1">{log.contractorName} · {log.startDate} — {log.endDate ?? "Ongoing"}</div>
                <div className="flex gap-2 mt-2">
                  {log.citizenVerified && (
                    <span className="text-xs flex items-center gap-1" style={{ color: "#16A34A" }}>
                      <CheckCircle className="w-3 h-3" /> Citizen Verified
                    </span>
                  )}
                  {log.aiValidated && (
                    <span className="text-xs flex items-center gap-1" style={{ color: "#0EA5A4" }}>
                      <CheckCircle className="w-3 h-3" /> AI Validated
                    </span>
                  )}
                  {!log.citizenVerified && <span className="text-xs flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> Pending Verification</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>{formatCurrency(log.cost)}</div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: log.status === "completed" ? "#16A34A20" : "hsl(var(--muted))", color: log.status === "completed" ? "#16A34A" : "hsl(var(--muted-foreground))" }}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
