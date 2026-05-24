import { useState } from "react";
import { Link } from "wouter";
import { Search, ArrowUpRight, MapPin } from "lucide-react";
import { useListRoads } from "@workspace/api-client-react";
import { getRiskColor, getHealthColor } from "@/lib/utils";

function HealthBar({ score }: { score: number }) {
  const color = getHealthColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-8" style={{ color }}>{score?.toFixed(0)}</span>
    </div>
  );
}

export default function Roads() {
  const { data: roads, isLoading } = useListRoads();
  const [search, setSearch] = useState("");

  const filtered = (roads ?? MOCK_ROADS).filter((r: any) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Road DNA</h1>
          <p className="text-sm text-muted-foreground mt-1">Digital profiles for every monitored road</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search roads by name or location..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
              {["Road Name", "Type", "Location", "Health Score", "Risk Level", "Status", "Complaints", "Action"].map(h => (
                <th key={h} className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ background: "hsl(var(--muted))" }} /></td></tr>
              ))
            ) : filtered.map((road: any) => (
              <tr key={road.id} className="hover:opacity-90 transition-opacity">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{road.name}</div>
                  {road.contractorName && <div className="text-xs text-muted-foreground">{road.contractorName}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{road.roadType}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {road.location}
                  </div>
                </td>
                <td className="px-4 py-3 w-36"><HealthBar score={road.healthScore} /></td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${getRiskColor(road.riskLevel)}20`, color: getRiskColor(road.riskLevel) }}>
                    {road.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: road.status === "excellent" ? "#16A34A20" : road.status === "deteriorating" ? "#DC262620" : "hsl(var(--muted))", color: road.status === "excellent" ? "#16A34A" : road.status === "deteriorating" ? "#DC2626" : "hsl(var(--muted-foreground))" }}>
                    {road.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{road.totalComplaints ?? 0}</td>
                <td className="px-4 py-3">
                  <Link href={`/roads/${road.id}`}>
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>
                      DNA <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const MOCK_ROADS = [
  { id: 1, name: "Katraj Ghat, Pune", roadType: "State Highway", location: "Pune, MH", healthScore: 38, riskLevel: "critical", status: "deteriorating", contractorName: "PWD Maharashtra Pune Division", totalComplaints: 12 },
  { id: 2, name: "Hadapsar Junction, Pune", roadType: "Urban Road", location: "Pune, MH", healthScore: 58, riskLevel: "medium", status: "active", contractorName: "PMC Road Dept", totalComplaints: 8 },
  { id: 3, name: "NH-48 near Khopoli", roadType: "National Highway", location: "Khopoli, Raigad", healthScore: 32, riskLevel: "critical", status: "deteriorating", contractorName: "NHAI Pune Zone", totalComplaints: 15 },
  { id: 4, name: "Swargate Circle, Pune", roadType: "Urban Road", location: "Pune, MH", healthScore: 65, riskLevel: "medium", status: "active", contractorName: "PMC Central Zone", totalComplaints: 5 },
  { id: 5, name: "Nashik Phata, Pimpri", roadType: "State Highway", location: "Pimpri-Chinchwad, MH", healthScore: 48, riskLevel: "high", status: "active", contractorName: "MSRDC Pune", totalComplaints: 9 },
  { id: 6, name: "Mumbai-Pune Expressway KM 42", roadType: "Expressway", location: "Pune District, MH", healthScore: 72, riskLevel: "high", status: "active", contractorName: "MSRDC Pune", totalComplaints: 11 },
];
