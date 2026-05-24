import { useGetRiskMap } from "@workspace/api-client-react";
import { TrendingDown, AlertTriangle, MapPin, Clock } from "lucide-react";
import { getRiskColor } from "@/lib/utils";

const MOCK_RISK_MAP = [
  { id: 1, roadId: 3, roadName: "NH-48 near Khopoli", latitude: 18.789, longitude: 73.348, riskScore: 94, riskLevel: "critical", predictedFailureIn: "3-7 days", reason: "15 incidents recorded. Sensor S-03 shows extreme vibration (9.1/10). Predicted crack formation." },
  { id: 2, roadId: 1, roadName: "Katraj Ghat, Pune", latitude: 18.453, longitude: 73.868, riskScore: 88, riskLevel: "critical", predictedFailureIn: "5-10 days", reason: "12 incidents Jan–Mar 2024. Consistent stress pattern on ghat section." },
  { id: 3, roadId: 5, roadName: "Nashik Phata, Pimpri", latitude: 18.627, longitude: 73.802, riskScore: 72, riskLevel: "high", predictedFailureIn: "2-3 weeks", reason: "9 incidents recorded. Heavy commercial traffic causing rapid surface wear." },
  { id: 4, roadId: 6, roadName: "Mumbai-Pune Expressway KM 42", latitude: 18.591, longitude: 73.423, riskScore: 68, riskLevel: "high", predictedFailureIn: "3-4 weeks", reason: "11 incidents. Guardrail damage zone. Shoulder erosion detected by sensors." },
  { id: 5, roadId: 2, roadName: "Hadapsar Junction, Pune", latitude: 18.508, longitude: 73.925, riskScore: 42, riskLevel: "medium", predictedFailureIn: "2-3 months", reason: "8 incidents. Signal junction stress. Patchwork repairs needed." },
  { id: 6, roadId: 4, roadName: "Swargate Circle, Pune", latitude: 18.501, longitude: 73.863, riskScore: 35, riskLevel: "medium", predictedFailureIn: "3-4 months", reason: "5 incidents. Underpass waterlogging risk during monsoon." },
];

function RiskBadge({ level }: { level: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase" style={{ background: `${getRiskColor(level)}20`, color: getRiskColor(level) }}>
      {level}
    </span>
  );
}

function RiskBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: score > 80 ? "#DC2626" : score > 60 ? "#F59E0B" : score > 30 ? "#0EA5A4" : "#16A34A" }} />
      </div>
      <span className="text-xs font-mono font-bold w-8" style={{ color: score > 80 ? "#DC2626" : score > 60 ? "#F59E0B" : score > 30 ? "#0EA5A4" : "#16A34A" }}>
        {score}%
      </span>
    </div>
  );
}

export default function RiskMap() {
  const { data: riskMap } = useGetRiskMap();
  const points = riskMap ?? MOCK_RISK_MAP;

  const criticalCount = points.filter((p: any) => p.riskLevel === "critical").length;
  const highCount = points.filter((p: any) => p.riskLevel === "high").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Future Risk Map</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-predicted road failure zones and risk forecasts</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl" style={{ background: "#DC262610", border: "1px solid #DC262630" }}>
          <div className="text-3xl font-bold" style={{ color: "#DC2626", fontFamily: "Sora, sans-serif" }}>{criticalCount}</div>
          <div className="text-sm font-medium mt-1">Critical Risk Roads</div>
          <div className="text-xs text-muted-foreground">Failing within 1 week</div>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#F59E0B10", border: "1px solid #F59E0B30" }}>
          <div className="text-3xl font-bold" style={{ color: "#F59E0B", fontFamily: "Sora, sans-serif" }}>{highCount}</div>
          <div className="text-sm font-medium mt-1">High Risk Roads</div>
          <div className="text-xs text-muted-foreground">Failing within 3 weeks</div>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "rgba(14,165,164,0.1)", border: "1px solid rgba(14,165,164,0.2)" }}>
          <div className="text-3xl font-bold" style={{ color: "#0EA5A4", fontFamily: "Sora, sans-serif" }}>2</div>
          <div className="text-sm font-medium mt-1">Medium Risk Roads</div>
          <div className="text-xs text-muted-foreground">Monitor in 1-3 months</div>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: "#16A34A10", border: "1px solid #16A34A30" }}>
          <div className="text-3xl font-bold" style={{ color: "#16A34A", fontFamily: "Sora, sans-serif" }}>3</div>
          <div className="text-sm font-medium mt-1">Low Risk Roads</div>
          <div className="text-xs text-muted-foreground">Safe for 12+ months</div>
        </div>
      </div>

      {/* Map placeholder with risk markers */}
      <div className="rounded-2xl overflow-hidden relative" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", minHeight: "300px" }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(215 60% 8%) 0%, hsl(215 55% 12%) 100%)" }}>
          <div className="grid grid-cols-4 gap-6 w-full max-w-3xl px-8">
            {points.map((p: any) => (
              <div key={p.id} className="flex flex-col items-center gap-2 cursor-pointer hover:scale-110 transition-transform">
                <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: `${getRiskColor(p.riskLevel)}25`, border: `2px solid ${getRiskColor(p.riskLevel)}` }}>
                  <MapPin className="w-5 h-5" style={{ color: getRiskColor(p.riskLevel) }} />
                  {(p.riskLevel === "critical" || p.riskLevel === "high") && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: getRiskColor(p.riskLevel) }} />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium" style={{ color: getRiskColor(p.riskLevel) }}>{p.riskScore}%</div>
                  <div className="text-xs text-muted-foreground text-center max-w-[80px] truncate">{p.roadName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)" }}>
          Map visualization — bubble size indicates risk severity
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-3 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(0,0,0,0.7)" }}>
          {[["Critical", "#DC2626"], ["High", "#F59E0B"], ["Medium", "#0EA5A4"], ["Low", "#16A34A"]].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Detailed Risk Assessment</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
              {["Road", "Risk Score", "Risk Level", "Predicted Failure", "AI Reason"].map(h => (
                <th key={h} className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {[...points].sort((a: any, b: any) => b.riskScore - a.riskScore).map((p: any) => (
              <tr key={p.id} className={p.riskLevel === "critical" ? "bg-red-500/5" : p.riskLevel === "high" ? "bg-amber-500/5" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5" style={{ color: getRiskColor(p.riskLevel) }} />
                    {p.roadName}
                  </div>
                </td>
                <td className="px-4 py-3 w-36"><RiskBar score={p.riskScore} /></td>
                <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {p.predictedFailureIn}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">{p.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
