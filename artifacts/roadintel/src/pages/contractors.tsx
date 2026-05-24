import { useListContractors } from "@workspace/api-client-react";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const MOCK_CONTRACTORS = [
  { id: 1, name: "Pune Municipal Corporation Road Dept", roadsManaged: 24, totalContracts: 48, totalValue: 85000000, avgHealthScore: 62, trustScore: 74, failedRoads: 3, repeatFailures: 4, corruptionFlags: 0, status: "active", location: "Pune" },
  { id: 2, name: "Maharashtra State Road Development Corp (MSRDC)", roadsManaged: 18, totalContracts: 32, totalValue: 142000000, avgHealthScore: 58, trustScore: 68, failedRoads: 5, repeatFailures: 7, corruptionFlags: 1, status: "active", location: "Pune" },
  { id: 3, name: "National Highways Authority of India — Pune Zone", roadsManaged: 12, totalContracts: 22, totalValue: 210000000, avgHealthScore: 55, trustScore: 71, failedRoads: 4, repeatFailures: 6, corruptionFlags: 0, status: "active", location: "Pune" },
  { id: 4, name: "PWD Maharashtra — Pune Division", roadsManaged: 15, totalContracts: 28, totalValue: 68000000, avgHealthScore: 60, trustScore: 66, failedRoads: 4, repeatFailures: 5, corruptionFlags: 1, status: "flagged", location: "Pune" },
];

function TrustBar({ score }: { score: number }) {
  const color = score >= 70 ? "#16A34A" : score >= 50 ? "#F59E0B" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-6" style={{ color }}>{score}</span>
    </div>
  );
}

export default function Contractors() {
  const { data: contractors } = useListContractors();
  const list = contractors ?? MOCK_CONTRACTORS;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Contractor Accountability</h1>
        <p className="text-sm text-muted-foreground mt-1">Track contractor performance, trust scores, and corruption flags</p>
      </div>

      <div className="grid gap-4">
        {list.map((c: any) => {
          const flagged = c.status === "flagged" || c.status === "suspended";
          return (
            <div key={c.id} className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: `1px solid ${flagged ? "rgba(220,38,38,0.3)" : "hsl(var(--border))"}`, ...(flagged ? { background: "rgba(220,38,38,0.03)" } : {}) }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: flagged ? "#DC262618" : "rgba(14,165,164,0.15)", color: flagged ? "#DC2626" : "#0EA5A4" }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {c.name}
                        {c.corruptionFlags > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "#DC262618", color: "#DC2626" }}>
                            <AlertTriangle className="w-3 h-3" /> {c.corruptionFlags} flags
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{c.location} · {c.totalContracts} contracts</div>
                    </div>
                    <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-medium uppercase" style={{ background: c.status === "suspended" ? "#DC262618" : c.status === "flagged" ? "#F59E0B18" : "#16A34A18", color: c.status === "suspended" ? "#DC2626" : c.status === "flagged" ? "#F59E0B" : "#16A34A" }}>
                      {c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    {[
                      { label: "Roads Managed", value: c.roadsManaged },
                      { label: "Avg Health Score", value: `${c.avgHealthScore}/100` },
                      { label: "Failed Roads", value: c.failedRoads, danger: c.failedRoads > 3 },
                      { label: "Repeat Failures", value: c.repeatFailures, danger: c.repeatFailures > 5 },
                    ].map(({ label, value, danger }) => (
                      <div key={label}>
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="font-bold text-sm mt-0.5" style={{ color: danger ? "#DC2626" : "hsl(var(--foreground))" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
                    <TrustBar score={c.trustScore} />
                  </div>
                </div>
              </div>

              {c.corruptionFlags > 0 && (
                <div className="mt-3 p-3 rounded-xl flex gap-2" style={{ background: "#DC262608", border: "1px solid #DC262620" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                  <div className="text-xs" style={{ color: "#DC2626" }}>
                    AI Corruption Detector: {c.corruptionFlags} suspicious pattern{c.corruptionFlags > 1 ? "s" : ""} detected. Repeated failures, budget anomalies, or quality deception suspected.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
