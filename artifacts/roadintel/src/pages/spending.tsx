import { useGetSpendingOverview, useGetContractorSpendingBreakdown, useGetCorruptionFlags } from "@workspace/api-client-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Wallet, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const MOCK_OVERVIEW = {
  totalBudget: 50000000, totalSpent: 23000000,
  wastedOnRepeatRepairs: 4200000, suspiciousTransactions: 2,
  avgCostPerKm: 5200000, roadsUnderBudget: 3, roadsOverBudget: 2,
  yearlyTrend: [
    { year: "2021", budget: 35000000, spent: 32000000, quality: 68 },
    { year: "2022", budget: 42000000, spent: 38000000, quality: 62 },
    { year: "2023", budget: 48000000, spent: 45000000, quality: 58 },
    { year: "2024", budget: 50000000, spent: 23000000, quality: 55 },
  ],
};

const MOCK_CONTRACTOR_SPENDING = [
  { contractorId: 1, contractorName: "PMC Road Dept", totalSpent: 8500000, qualityScore: 72, efficiency: 78, flagged: false },
  { contractorId: 2, contractorName: "MSRDC Pune", totalSpent: 14200000, qualityScore: 58, efficiency: 65, flagged: false },
  { contractorId: 3, contractorName: "NHAI Pune Zone", totalSpent: 21000000, qualityScore: 71, efficiency: 82, flagged: false },
  { contractorId: 4, contractorName: "PWD Pune Division", totalSpent: 6800000, qualityScore: 60, efficiency: 58, flagged: true },
];

const MOCK_FLAGS = [
  { id: 1, type: "Budget Overrun", description: "Swargate flyover repair cost 23% above allocated budget", roadName: "Swargate Circle, Pune", contractorName: "PWD Pune Division", severity: "high", evidence: "₹5.5 Cr spent vs ₹4.5 Cr allocated. Quality audit flagged 12 material deviations.", detectedAt: "2024-04-10", status: "open" },
  { id: 2, type: "Repeated Repair", description: "Katraj Ghat repaired 4 times in 2 years — abnormal frequency", roadName: "Katraj Ghat, Pune", contractorName: "PWD Pune Division", severity: "critical", evidence: "4 repair cycles in 24 months, each averaging 6 months lifespan vs 18-month minimum standard", detectedAt: "2024-04-12", status: "open" },
  { id: 3, type: "Low Quality Score", description: "Sensor data shows substandard surface on Baner Road stretch", roadName: "Baner Road, Pune", contractorName: "MSRDC Pune", severity: "medium", evidence: "Vibration anomaly 6.2/10. Roughness index exceeds threshold by 18%.", detectedAt: "2024-04-08", status: "under review" },
];

export default function Spending() {
  const { data: overview } = useGetSpendingOverview();
  const { data: contractorSpending } = useGetContractorSpendingBreakdown();
  const { data: flags } = useGetCorruptionFlags();

  const ov = overview ?? MOCK_OVERVIEW;
  const cs = contractorSpending ?? MOCK_CONTRACTOR_SPENDING;
  const cf = flags ?? MOCK_FLAGS;

  const overrun = ((ov.totalSpent - ov.totalBudget) / ov.totalBudget) * 100;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Public Money Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Budget transparency, contractor accountability, and corruption detection</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: formatCurrency(ov.totalBudget), icon: Wallet, color: "#0EA5A4", sub: "FY 2024-25" },
          { label: "Total Spent", value: formatCurrency(ov.totalSpent), icon: TrendingDown, color: overrun > 0 ? "#DC2626" : "#16A34A", sub: `${overrun > 0 ? "+" : ""}${overrun.toFixed(1)}% vs budget` },
          { label: "Wasted (Repeat Repairs)", value: formatCurrency(ov.wastedOnRepeatRepairs), icon: AlertTriangle, color: "#DC2626", sub: "Recoverable waste" },
          { label: "Suspicious Transactions", value: ov.suspiciousTransactions, icon: AlertTriangle, color: "#F59E0B", sub: "Under investigation" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="text-xl font-bold" style={{ fontFamily: "Sora, sans-serif", color }}>{value}</div>
            <div className="text-sm font-medium mt-0.5">{label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Budget vs Quality trend */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Budget vs Quality Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ov.yearlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 10000000).toFixed(0)}Cr`} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any, name: string) => name === "quality" ? `${v}/100` : formatCurrency(v)} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="budget" name="Budget" stroke="#0EA5A4" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="spent" name="Spent" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" />
            <Line yAxisId="right" type="monotone" dataKey="quality" name="Quality Score" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">Budget spending increases while road quality score consistently declines — a key corruption indicator.</p>
      </div>

      {/* Contractor spending breakdown */}
      <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Contractor-Wise Spending & Efficiency</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={cs}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="contractorName" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: any, name: string) => name === "totalSpent" ? formatCurrency(v) : `${v}%`} />
            <Legend />
            <Bar dataKey="qualityScore" name="Quality Score" fill="#0EA5A4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="efficiency" name="Efficiency %" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Contractor table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Contractor Spending Detail</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
              {["Contractor", "Total Spent", "Quality Score", "Efficiency", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {cs.map((c: any) => (
              <tr key={c.contractorId} className={c.flagged ? "bg-red-500/5" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {c.flagged && <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "#DC2626" }} />}
                    <span className="font-medium text-sm">{c.contractorName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-sm">{formatCurrency(c.totalSpent)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <div className="h-full rounded-full" style={{ width: `${c.qualityScore}%`, background: c.qualityScore > 70 ? "#16A34A" : c.qualityScore > 50 ? "#F59E0B" : "#DC2626" }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: c.qualityScore > 70 ? "#16A34A" : c.qualityScore > 50 ? "#F59E0B" : "#DC2626" }}>{c.qualityScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{c.efficiency}%</td>
                <td className="px-4 py-3">
                  {c.flagged ? (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#DC262618", color: "#DC2626" }}>FLAGGED</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#16A34A18", color: "#16A34A" }}>Clear</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Corruption Flags */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <AlertTriangle className="w-4 h-4" style={{ color: "#DC2626" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>AI Corruption Detector</h3>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "#DC262618", color: "#DC2626" }}>{cf.length} Active Flags</span>
        </div>
        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {cf.map((flag: any) => (
            <div key={flag.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: flag.severity === "critical" ? "#DC262618" : "#F59E0B18", color: flag.severity === "critical" ? "#DC2626" : "#F59E0B" }}>
                      {flag.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{flag.detectedAt}</span>
                  </div>
                  <div className="font-medium text-sm">{flag.description}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{flag.roadName} · {flag.contractorName}</div>
                  <div className="mt-2 p-2 rounded-lg text-xs" style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                    <span className="font-semibold">Evidence: </span>{flag.evidence}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: flag.status === "open" ? "#DC262618" : "#F59E0B18", color: flag.status === "open" ? "#DC2626" : "#F59E0B" }}>
                  {flag.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
