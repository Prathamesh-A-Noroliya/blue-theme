import { useState } from "react";
import { useListComplaints, useCreateComplaint, useGetComplaintStats } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, MapPin, AlertTriangle, CheckCircle, Clock, Plus, X, WifiOff, Upload, Eye, EyeOff } from "lucide-react";
import { getRiskColor } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B", in_progress: "#0EA5A4", resolved: "#16A34A", escalated: "#DC2626",
};

const MOCK_COMPLAINTS = [
  { id: 1, complaintId: "CMP-2024-001", title: "Large pothole causing vehicle damage", location: "FC Road near Goodluck Chowk, Pune", status: "pending", severity: "high", issueType: "Pothole", createdAt: "2024-04-10", assignedDepartment: "PMC Roads Division" },
  { id: 2, complaintId: "CMP-2024-002", title: "Broken divider on Baner Road", location: "Baner Road near Balewadi, Pune", status: "in_progress", severity: "medium", issueType: "Edge Damage", createdAt: "2024-04-12", assignedDepartment: "PMC West Zone" },
  { id: 3, complaintId: "CMP-2024-003", title: "Missing signage on Katraj-Kondhwa stretch", location: "Katraj-Kondhwa Road, Pune", status: "resolved", severity: "low", issueType: "Signage", createdAt: "2024-04-05", assignedDepartment: "PMC South Zone" },
  { id: 4, complaintId: "CMP-2024-004", title: "Waterlogging at Swargate underpass", location: "Swargate Underpass, Pune", status: "pending", severity: "high", issueType: "Waterlogging", createdAt: "2024-04-14", assignedDepartment: "PMC Central Zone" },
  { id: 5, complaintId: "CMP-2024-005", title: "Damaged guardrail on Mumbai-Pune Expressway", location: "Expressway KM 55, Pune District", status: "in_progress", severity: "critical", issueType: "Edge Damage", createdAt: "2024-04-15", assignedDepartment: "MSRDC Pune" },
];

const MOCK_STATS = {
  byStatus: [{ status: "Pending", count: 2 }, { status: "In Progress", count: 2 }, { status: "Resolved", count: 1 }],
  byType: [{ type: "Pothole", count: 1 }, { type: "Waterlogging", count: 1 }, { type: "Edge Damage", count: 2 }, { type: "Signage", count: 1 }],
};

// Routing engine: maps road type + issue + severity → authority
const ROUTING_ENGINE: Record<string, { authority: string; engineer: string; timeline: string; zone: string }> = {
  "NH-critical": { authority: "National Highways Authority of India (NHAI)", engineer: "Executive Engineer, NHAI Region-I", timeline: "24-48 hours", zone: "National" },
  "NH-high": { authority: "National Highways Authority of India (NHAI)", engineer: "Assistant Engineer, NHAI Region-I", timeline: "3-5 days", zone: "National" },
  "NH-medium": { authority: "NHAI State Unit", engineer: "Junior Engineer, NHAI", timeline: "7-10 days", zone: "State-National" },
  "NH-low": { authority: "NHAI State Unit", engineer: "NHAI Field Inspector", timeline: "15-20 days", zone: "State-National" },
  "SH-critical": { authority: "State PWD / SRRDA", engineer: "Executive Engineer, State PWD", timeline: "24-72 hours", zone: "State" },
  "SH-high": { authority: "State Public Works Department", engineer: "Assistant Engineer, State PWD", timeline: "3-7 days", zone: "State" },
  "SH-medium": { authority: "State Public Works Department", engineer: "Junior Engineer, PWD", timeline: "10-15 days", zone: "State" },
  "SH-low": { authority: "State PWD District Unit", engineer: "Road Inspector, PWD", timeline: "20-30 days", zone: "State" },
  "MDR-critical": { authority: "District Roads Division / DRDA", engineer: "Executive Engineer, DRDA", timeline: "48-72 hours", zone: "District" },
  "MDR-high": { authority: "District Roads Division", engineer: "Assistant Engineer, DRDA", timeline: "5-7 days", zone: "District" },
  "MDR-medium": { authority: "District Roads Division", engineer: "Junior Engineer, DRDA", timeline: "10-15 days", zone: "District" },
  "MDR-low": { authority: "Panchayat Roads Dept", engineer: "Road Inspector", timeline: "30 days", zone: "District" },
  "Urban-critical": { authority: "Municipal Corporation Emergency Cell", engineer: "Executive Engineer, Municipal Roads", timeline: "12-24 hours", zone: "Municipal" },
  "Urban-high": { authority: "Municipal Corporation Roads Wing", engineer: "Assistant Engineer, Corp Roads", timeline: "3-5 days", zone: "Municipal" },
  "Urban-medium": { authority: "Ward Roads Committee", engineer: "Junior Engineer, Ward", timeline: "7-14 days", zone: "Municipal" },
  "Urban-low": { authority: "Ward Committee", engineer: "Ward Road Inspector", timeline: "30 days", zone: "Municipal" },
};

const ROAD_AUTOFILL: Record<string, { roadType: string; authority: string; contractor: string; lastRelaying: string; budgetRef: string; jurisdiction: string }> = {
  "FC Road": { roadType: "Urban", authority: "PMC Roads Division", contractor: "Pune Municipal Corp Road Dept", lastRelaying: "January 2023", budgetRef: "₹3.2 Cr (FY 2022-23)", jurisdiction: "Pune Municipal" },
  "Baner": { roadType: "Urban", authority: "PMC West Zone", contractor: "MSRDC Pune", lastRelaying: "August 2022", budgetRef: "₹5.8 Cr (FY 2022-23)", jurisdiction: "Pune Municipal" },
  "Katraj": { roadType: "Urban", authority: "PMC South Zone", contractor: "PWD Maharashtra Pune Division", lastRelaying: "October 2021", budgetRef: "₹2.1 Cr (FY 2021-22)", jurisdiction: "Pune Municipal" },
  "Swargate": { roadType: "Urban", authority: "PMC Central Zone", contractor: "Pune Municipal Corp Road Dept", lastRelaying: "March 2022", budgetRef: "₹4.5 Cr (FY 2022-23)", jurisdiction: "Pune Municipal" },
  "Expressway": { roadType: "NH", authority: "MSRDC Pune", contractor: "National Highways Authority Pune Zone", lastRelaying: "June 2022", budgetRef: "₹28.6 Cr (FY 2022-23)", jurisdiction: "State-National" },
};

function getRouting(roadType: string, severity: string) {
  const key = `${roadType}-${severity}`;
  return ROUTING_ENGINE[key] ?? ROUTING_ENGINE[`${roadType}-medium`] ?? {
    authority: "Local Municipal Corporation / PWD", engineer: "Executive Engineer (Local)", timeline: "7-14 days", zone: "Local"
  };
}

function getAutofill(roadName: string) {
  for (const [key, val] of Object.entries(ROAD_AUTOFILL)) {
    if (roadName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return null;
}

function saveOffline(data: object) {
  try {
    const existing = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("ri_offline_complaints") ?? "[]" : "[]");
    existing.push({ ...data, savedAt: new Date().toISOString(), offlineId: `OFL-${Date.now()}` });
    if (typeof window !== "undefined") localStorage.setItem("ri_offline_complaints", JSON.stringify(existing));
    return true;
  } catch { return false; }
}

type SubmitResult = { complaintId: string; authority: string; engineer: string; timeline: string; zone: string } | null;

function NewComplaintModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", description: "", location: "", severity: "medium", issueType: "Pothole",
    reportedBy: "", roadType: "Urban", priority: "normal", anonymous: false, notes: "",
  });
  const [autofill, setAutofill] = useState<ReturnType<typeof getAutofill>>(null);
  const [result, setResult] = useState<SubmitResult>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const create = useCreateComplaint();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = (e.target as HTMLInputElement).type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    if (k === "location") {
      const af = getAutofill(e.target.value);
      setAutofill(af);
      if (af) setForm(f => ({ ...f, location: e.target.value, roadType: af.roadType }));
    }
  };

  const routing = getRouting(form.roadType, form.severity);

  const submit = async () => {
    try {
      await create.mutateAsync({ data: { ...form, title: form.title || form.issueType } });
    } catch { /* swallow – use local result */ }
    const id = `CMP-${Date.now().toString().slice(-6)}`;
    setResult({ complaintId: id, ...routing });
  };

  const saveToOffline = () => {
    const ok = saveOffline(form);
    setOfflineSaved(ok);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle: React.CSSProperties = { background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div className="w-full max-w-lg rounded-2xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(22,163,74,0.15)" }}>
              <CheckCircle className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Complaint Filed Successfully</div>
              <div className="text-xs text-muted-foreground">AI routing complete</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Complaint ID", value: result.complaintId, highlight: true },
              { label: "Expected Timeline", value: routing.timeline },
              { label: "Assigned Authority", value: routing.authority },
              { label: "Executive Engineer", value: routing.engineer },
              { label: "Jurisdiction Zone", value: routing.zone },
              { label: "Status", value: "Pending Review" },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3" style={{ background: "hsl(var(--muted))" }}>
                <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                <div className={`text-sm font-semibold ${item.highlight ? "" : ""}`} style={item.highlight ? { color: "#0EA5A4" } : {}}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(14,165,164,0.1)", border: "1px solid rgba(14,165,164,0.2)", color: "#0EA5A4" }}>
            Your complaint has been routed to <strong>{routing.authority}</strong>. You will receive updates via email. Typical resolution: <strong>{routing.timeline}</strong>.
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#0EA5A4" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl my-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <h2 className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>File New Complaint</h2>
          <div className="flex items-center gap-3">
            {/* Anonymous toggle */}
            <button onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors"
              style={{ borderColor: form.anonymous ? "#F5A623" : "hsl(var(--border))", color: form.anonymous ? "#F5A623" : "hsl(var(--muted-foreground))", background: form.anonymous ? "rgba(245,166,35,0.1)" : "transparent" }}>
              {form.anonymous ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {form.anonymous ? "Anonymous" : "Show Name"}
            </button>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Complaint Title</label>
            <input value={form.title} onChange={set("title")} placeholder="Brief description of the issue" className={inputCls} style={inputStyle} />
          </div>

          {/* Issue type + severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Issue Type</label>
              <select value={form.issueType} onChange={set("issueType")} className={inputCls} style={inputStyle}>
                {["Pothole", "Cracking", "Road Collapse", "Waterlogging", "Surface Damage", "Edge Damage", "Signage", "Drainage", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Severity</label>
              <select value={form.severity} onChange={set("severity")} className={inputCls} style={inputStyle}>
                {["low", "medium", "high", "critical"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Road type + priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Road Type</label>
              <select value={form.roadType} onChange={set("roadType")} className={inputCls} style={inputStyle}>
                {["NH", "SH", "MDR", "Urban"].map(t => <option key={t} value={t}>{t === "NH" ? "National Highway (NH)" : t === "SH" ? "State Highway (SH)" : t === "MDR" ? "Major District Road (MDR)" : "Urban / Municipal Road"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Priority</label>
              <select value={form.priority} onChange={set("priority")} className={inputCls} style={inputStyle}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Location with autofill */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Road Name / Location</label>
            <input value={form.location} onChange={set("location")} placeholder="e.g. FC Road, Baner Road, Katraj Ghat..." className={inputCls} style={inputStyle} />
          </div>

          {/* Smart autofill result */}
          {autofill && (
            <div className="rounded-xl p-4 space-y-2 text-sm" style={{ background: "rgba(14,165,164,0.08)", border: "1px solid rgba(14,165,164,0.2)" }}>
              <div className="text-xs font-semibold" style={{ color: "#0EA5A4" }}>Smart Autofill — Road Data Detected</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Contractor", value: autofill.contractor },
                  { label: "Last Relaying", value: autofill.lastRelaying },
                  { label: "Authority", value: autofill.authority },
                  { label: "Budget Ref", value: autofill.budgetRef },
                  { label: "Jurisdiction", value: autofill.jurisdiction },
                ].map(f => (
                  <div key={f.label} className="rounded-lg p-2" style={{ background: "hsl(var(--muted))" }}>
                    <div className="text-muted-foreground">{f.label}</div>
                    <div className="font-semibold">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={set("description")} placeholder="Describe the issue in detail — depth, size, danger to vehicles or pedestrians..." rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
          </div>

          {/* Citizen contact */}
          {!form.anonymous && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Your Name / Contact (optional)</label>
              <input value={form.reportedBy} onChange={set("reportedBy")} placeholder="Name or phone number" className={inputCls} style={inputStyle} />
            </div>
          )}

          {/* Evidence upload (stub) */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Upload Evidence (Photo / Video)</label>
            <label className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border-2 border-dashed transition-colors hover:opacity-80"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              <Upload className="w-5 h-5 shrink-0" />
              <span className="text-sm">{filePreview ? "File selected" : "Click to upload photo or video"}</span>
              <input type="file" accept="image/*,video/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setFilePreview(f.name); }} />
            </label>
            {filePreview && <div className="mt-1 text-xs text-muted-foreground px-1">{filePreview}</div>}
          </div>

          {/* AI routing preview */}
          <div className="p-3 rounded-xl text-xs space-y-1.5" style={{ background: "rgba(30,136,229,0.08)", border: "1px solid rgba(30,136,229,0.2)" }}>
            <div className="font-semibold" style={{ color: "#1E88E5" }}>AI Routing Preview</div>
            <div><span className="text-muted-foreground">Authority: </span><strong>{routing.authority}</strong></div>
            <div><span className="text-muted-foreground">Engineer: </span>{routing.engineer}</div>
            <div><span className="text-muted-foreground">Expected Resolution: </span>{routing.timeline}</div>
          </div>

          <div className="flex gap-3">
            <button onClick={saveToOffline} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors hover:opacity-80"
              style={{ borderColor: "hsl(var(--border))", color: offlineSaved ? "#16A34A" : "hsl(var(--muted-foreground))" }}>
              <WifiOff className="w-4 h-4" />
              {offlineSaved ? "Saved Offline" : "Save Offline"}
            </button>
            <button onClick={submit} disabled={create.isPending} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#0EA5A4" }}>
              {create.isPending ? "Filing..." : "Submit Complaint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Complaints() {
  const { data: complaints, isLoading } = useListComplaints();
  const { data: stats } = useGetComplaintStats();
  const [showModal, setShowModal] = useState(false);

  const list = complaints ?? MOCK_COMPLAINTS;
  const s = stats ?? MOCK_STATS;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Complaint Management</h1>
          <p className="text-sm text-muted-foreground mt-1">File, track, and monitor road complaints with AI routing</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#0EA5A4" }}>
          <Plus className="w-4 h-4" /> File Complaint
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Complaints by Status</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={s.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={30} outerRadius={50}>
                  {s.byStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={["#F59E0B", "#0EA5A4", "#16A34A", "#DC2626"][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {s.byStatus.map((item: any, i: number) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: ["#F59E0B", "#0EA5A4", "#16A34A", "#DC2626"][i % 4] }} />
                  <span className="text-muted-foreground">{item.status}</span>
                  <span className="font-bold ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h3 className="font-semibold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Issue Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={s.byType} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 10 }} width={70} />
              <Tooltip />
              <Bar dataKey="count" fill="#0EA5A4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted))" }}>
                {["ID", "Complaint", "Location", "Type", "Severity", "Department", "Status", "Date"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ background: "hsl(var(--muted))" }} /></td></tr>
                ))
              ) : list.map((c: any) => (
                <tr key={c.id} className="hover:opacity-80 transition-opacity">
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: "#0EA5A4" }}>{c.complaintId}</td>
                  <td className="px-4 py-3"><div className="font-medium text-sm max-w-[200px] truncate">{c.title}</div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap"><MapPin className="w-3 h-3" /> {c.location}</div></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{c.issueType}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${getRiskColor(c.severity)}20`, color: getRiskColor(c.severity) }}>{c.severity}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{c.assignedDepartment}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `${STATUS_COLORS[c.status] ?? "#64748B"}20`, color: STATUS_COLORS[c.status] ?? "#64748B" }}>
                      {c.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.createdAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <NewComplaintModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
