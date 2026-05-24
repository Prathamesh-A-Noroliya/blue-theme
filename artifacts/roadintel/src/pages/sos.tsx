import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Phone, Heart, Navigation, Clock, CheckCircle, Loader2, X, Siren } from "lucide-react";

const HOSPITALS = [
  { id: 1, name: "Sassoon General Hospital", distance: "0.9 km", phone: "020-26128000", address: "Sassoon Road, Pune", type: "Government", beds: 38, lat: 18.531, lng: 73.868 },
  { id: 2, name: "Ruby Hall Clinic", distance: "1.8 km", phone: "020-26166941", address: "40 Sassoon Road, Pune", type: "Private", beds: 22, lat: 18.528, lng: 73.87 },
  { id: 3, name: "Jehangir Hospital", distance: "2.4 km", phone: "020-26059600", address: "32 Sasoon Road, Pune", type: "Private", beds: 18, lat: 18.525, lng: 73.875 },
  { id: 4, name: "Deenanath Mangeshkar Hospital", distance: "3.1 km", phone: "020-40151000", address: "Erandwane, Pune", type: "Private", beds: 12, lat: 18.51, lng: 73.835 },
  { id: 5, name: "Bharati Hospital", distance: "4.5 km", phone: "020-24303000", address: "Katraj-Dhankawadi, Pune", type: "Government", beds: 45, lat: 18.457, lng: 73.862 },
];

type SOSStatus = "idle" | "locating" | "dispatching" | "dispatched";

export default function SOSPage() {
  const [status, setStatus] = useState<SOSStatus>("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<typeof HOSPITALS[0] | null>(null);
  const [incidentId, setIncidentId] = useState("");
  const [notes, setNotes] = useState("");
  const [accidentMode, setAccidentMode] = useState(false);
  const [sosTime, setSosTime] = useState<Date | null>(null);

  const triggerSOS = async () => {
    setStatus("locating");
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: "Detected Location (GPS Active)" });
          dispatch();
        },
        () => {
          setLocation({ lat: 18.531, lng: 73.868, address: "Pune (Approximate Location)" });
          dispatch();
        },
        { timeout: 5000 }
      );
    } else {
      setLocation({ lat: 18.531, lng: 73.868, address: "Pune (Demo Location)" });
      dispatch();
    }
  };

  const dispatch = () => {
    setStatus("dispatching");
    const hosp = HOSPITALS[0];
    setSelectedHospital(hosp);
    const id = `SOS-${Date.now().toString().slice(-6)}`;
    setIncidentId(id);
    setSosTime(new Date());
    setTimeout(() => setStatus("dispatched"), 2500);
  };

  const reset = () => { setStatus("idle"); setLocation(null); setSelectedHospital(null); setIncidentId(""); setNotes(""); setSosTime(null); };

  const elapsed = sosTime ? Math.floor((Date.now() - sosTime.getTime()) / 1000) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(229,57,53,0.15)" }}>
          <Siren className="w-5 h-5" style={{ color: "#E53935" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Emergency Help / SOS</h1>
          <p className="text-sm text-muted-foreground">Road accident assistance and nearest hospital routing</p>
        </div>
      </div>

      {/* Demo disclaimer */}
      <div className="px-4 py-3 rounded-xl text-xs flex items-start gap-2" style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", color: "#F5A623" }}>
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span><strong>Prototype Mode:</strong> SOS dispatch is simulated for demo. For real emergencies, call <strong>112</strong> (India) or your local emergency number immediately.</span>
      </div>

      {/* Main SOS trigger */}
      {status === "idle" && (
        <div className="rounded-2xl p-6 text-center space-y-5" style={{ background: "hsl(var(--card))", border: "2px solid rgba(229,57,53,0.3)" }}>
          <div className="flex justify-center">
            <button
              onClick={triggerSOS}
              className="w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 font-bold text-white text-lg shadow-2xl transition-transform hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #E53935, #B71C1C)", boxShadow: "0 0 40px rgba(229,57,53,0.5)" }}
            >
              <Siren className="w-10 h-10" />
              SOS
            </button>
          </div>
          <p className="text-muted-foreground text-sm">Press SOS to activate emergency assistance</p>

          {/* Accident quick report toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <label className="text-sm font-medium">Road Accident Mode</label>
            <button
              onClick={() => setAccidentMode(!accidentMode)}
              className="w-12 h-6 rounded-full relative transition-colors"
              style={{ background: accidentMode ? "#E53935" : "hsl(var(--muted))" }}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${accidentMode ? "left-7" : "left-1"}`} />
            </button>
          </div>

          {accidentMode && (
            <div className="rounded-xl p-4 text-left space-y-3 mt-2" style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)" }}>
              <p className="text-sm font-semibold" style={{ color: "#E53935" }}>Road Accident Quick Report</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe the accident: number of vehicles involved, injuries visible, road obstruction..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Locating state */}
      {status === "locating" && (
        <div className="rounded-2xl p-10 text-center space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse" style={{ background: "rgba(14,165,164,0.15)" }}>
              <Navigation className="w-10 h-10" style={{ color: "#0EA5A4" }} />
            </div>
          </div>
          <p className="font-semibold text-lg">Detecting your location...</p>
          <p className="text-muted-foreground text-sm">Please allow location access for accurate routing</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: "#0EA5A4" }} />
        </div>
      )}

      {/* Dispatching state */}
      {status === "dispatching" && (
        <div className="rounded-2xl p-10 text-center space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse" style={{ background: "rgba(229,57,53,0.15)" }}>
              <Siren className="w-10 h-10" style={{ color: "#E53935" }} />
            </div>
          </div>
          <p className="font-semibold text-lg">Dispatching emergency alert...</p>
          <p className="text-muted-foreground text-sm">Notifying nearest hospitals and emergency center</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: "#E53935" }} />
        </div>
      )}

      {/* Dispatched state */}
      {status === "dispatched" && selectedHospital && (
        <div className="space-y-4">
          {/* Incident card */}
          <div className="rounded-2xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "2px solid rgba(22,163,74,0.4)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: "#16A34A" }} />
                <span className="font-bold text-sm" style={{ color: "#16A34A" }}>SOS Alert Dispatched</span>
              </div>
              <button onClick={reset}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl p-3" style={{ background: "hsl(var(--muted))" }}>
                <div className="text-xs text-muted-foreground mb-0.5">Incident ID</div>
                <div className="font-mono font-bold" style={{ color: "#0EA5A4" }}>{incidentId}</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "hsl(var(--muted))" }}>
                <div className="text-xs text-muted-foreground mb-0.5">Time</div>
                <div className="font-bold">{sosTime?.toLocaleTimeString()}</div>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm rounded-xl p-3" style={{ background: "hsl(var(--muted))" }}>
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#0EA5A4" }} />
                <span className="text-muted-foreground">{location.address}</span>
              </div>
            )}

            {/* Status timeline */}
            <div className="space-y-2">
              {[
                { label: "SOS triggered", done: true, time: sosTime?.toLocaleTimeString() },
                { label: "Location detected", done: true, time: sosTime?.toLocaleTimeString() },
                { label: "Alert sent to nearest hospital", done: true, time: sosTime?.toLocaleTimeString() },
                { label: "Emergency admin notified", done: true },
                { label: "Ambulance dispatched (demo)", done: false, pending: true },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? "" : step.pending ? "animate-pulse" : ""}`}
                    style={{ background: step.done ? "#16A34A" : step.pending ? "#F5A623" : "hsl(var(--muted))" }}>
                    {step.done ? <CheckCircle className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3 text-white" />}
                  </div>
                  <span className={step.done ? "" : "text-muted-foreground"}>{step.label}</span>
                  {step.time && <span className="ml-auto text-xs text-muted-foreground">{step.time}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Nearest hospital */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" style={{ color: "#E53935" }} />
              <h3 className="font-bold">Nearest Hospital — Recommended Route</h3>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{selectedHospital.name}</div>
                <div className="text-sm text-muted-foreground">{selectedHospital.address}</div>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>{selectedHospital.type}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" />{selectedHospital.distance}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Heart className="w-3 h-3" />{selectedHospital.beds} beds avail.</span>
                </div>
              </div>
              <a href={`tel:${selectedHospital.phone}`} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shrink-0"
                style={{ background: "#E53935" }}>
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* All Nearby Hospitals list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "hsl(var(--border))" }}>
          <Heart className="w-4 h-4" style={{ color: "#E53935" }} />
          <h3 className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Nearby Emergency Hospitals</h3>
        </div>
        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {HOSPITALS.map((h) => (
            <div key={h.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{h.name}</div>
                <div className="text-xs text-muted-foreground truncate">{h.address}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: h.type === "Government" ? "rgba(22,163,74,0.15)" : "rgba(124,58,237,0.15)", color: h.type === "Government" ? "#16A34A" : "#7C3AED" }}>{h.type}</span>
                  <span className="text-xs text-muted-foreground">{h.distance}</span>
                  <span className="text-xs text-muted-foreground">{h.beds} beds</span>
                </div>
              </div>
              <a href={`tel:${h.phone}`} className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 text-white"
                style={{ background: "#0EA5A4" }}>
                <Phone className="w-3 h-3" /> {h.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency contacts quick bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Police", number: "100", color: "#1E88E5" },
          { label: "Ambulance", number: "108", color: "#E53935" },
          { label: "Fire", number: "101", color: "#F5A623" },
        ].map(c => (
          <a key={c.label} href={`tel:${c.number}`}
            className="flex flex-col items-center justify-center gap-1 p-4 rounded-2xl font-bold text-white transition-transform hover:scale-105"
            style={{ background: c.color }}>
            <Phone className="w-6 h-6" />
            <span className="text-xl">{c.number}</span>
            <span className="text-xs font-normal opacity-90">{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
