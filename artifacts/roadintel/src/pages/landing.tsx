import { Link } from "wouter";
import { Shield, Radio, BarChart3, Map, AlertTriangle, CheckCircle, Activity, TrendingUp, Zap, Eye, Lock, Globe } from "lucide-react";

const STATS = [
  { value: "12,847", label: "Roads Monitored", icon: Map },
  { value: "94,320", label: "Complaints Filed", icon: FileText },
  { value: "₹2,840Cr", label: "Budget Tracked", icon: BarChart3 },
  { value: "847", label: "Active Sensors", icon: Radio },
];

const FEATURES = [
  { icon: Radio, title: "RoadSense Sensor Intelligence", desc: "Low-cost IoT and vehicle-mounted sensors continuously detect potholes, vibration anomalies, and road degradation in real-time.", color: "#0EA5A4" },
  { icon: Shield, title: "AI Corruption Detector", desc: "Machine learning algorithms flag suspicious repair patterns, budget overruns, and contractor performance anomalies automatically.", color: "#F59E0B" },
  { icon: Map, title: "Road DNA Profiles", desc: "Every road gets a digital identity — complete history, contractor records, repair logs, health scores, and AI-generated insights.", color: "#16A34A" },
  { icon: TrendingUp, title: "Predictive Risk Maps", desc: "AI forecasts which roads will fail in the next 7 to 30 days, enabling proactive maintenance before critical damage occurs.", color: "#DC2626" },
  { icon: Eye, title: "Proof of Work Verification", desc: "Before and after imagery with geo-tags, timestamps, citizen confirmation, and AI validation ensure repairs actually happened.", color: "#0EA5A4" },
  { icon: Lock, title: "Public Accountability", desc: "Every rupee spent is tracked. Contractor performance is scored. Citizens and authorities see the same transparent data.", color: "#F59E0B" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Report or Detect", desc: "Citizens file complaints with location and photos. Sensors auto-detect issues in real-time." },
  { step: "02", title: "AI Analysis", desc: "Our AI classifies damage severity, suggests repair priority, and routes complaints to the right authority." },
  { step: "03", title: "Track & Verify", desc: "Follow every complaint from filed to resolved. AI validates repair quality using before/after analysis." },
  { step: "04", title: "Accountability", desc: "Contractor performance, budget utilization, and corruption patterns are transparently surfaced for public review." },
];

import { FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#0EA5A4" }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#sensors" className="hover:text-white transition-colors">Sensor Intel</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Sign In
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90" style={{ background: "#0EA5A4" }}>
              Demo Access
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-24 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(14,165,164,0.15) 0%, transparent 70%)" }} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4", border: "1px solid rgba(14,165,164,0.3)" }}>
            <Activity className="w-3 h-3" />
            AI-Powered Road Intelligence Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
            Smarter Roads.<br />
            <span style={{ color: "#0EA5A4" }}>Clearer Accountability.</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            RoadIntel uses sensor intelligence, AI analysis, and public transparency tools to monitor infrastructure health, detect corruption, and hold contractors accountable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <button className="px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: "#0EA5A4" }}>
                Launch Dashboard
              </button>
            </Link>
            <Link href="/sensors">
              <button className="px-8 py-4 rounded-xl text-base font-semibold transition-all hover:opacity-80" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
                View Sensor Intel
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-16 border-y" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(14,165,164,0.15)" }}>
                <Icon className="w-5 h-5" style={{ color: "#0EA5A4" }} />
              </div>
              <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{value}</div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>The Problem With Roads Today</h2>
            <p className="text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>India spends over ₹1.5 lakh crore annually on roads. Yet accountability is fragmented.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: AlertTriangle, title: "Repeated Failures", desc: "Same roads fail 3-5 times in 2 years. No accountability system to detect the pattern.", color: "#DC2626" },
              { icon: Eye, title: "No Verification", desc: "Contractors claim repairs complete. Citizens see no proof. Public money disappears.", color: "#F59E0B" },
              { icon: Globe, title: "Fragmented Data", desc: "Road data sits in silos across departments. No unified view for citizens or authorities.", color: "#0EA5A4" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Platform Capabilities</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Every feature built to serve transparency, accountability, and intelligence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-2xl hover:scale-[1.02] transition-transform" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>How RoadIntel Works</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-3xl font-bold shrink-0" style={{ color: "#0EA5A4", fontFamily: "Sora, sans-serif" }}>{step}</div>
                <div>
                  <h3 className="font-semibold text-white mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensor Section */}
      <section id="sensors" className="px-8 py-20" style={{ background: "rgba(14,165,164,0.05)", borderTop: "1px solid rgba(14,165,164,0.15)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4", border: "1px solid rgba(14,165,164,0.3)" }}>
            <Radio className="w-3 h-3" />
            Core Innovation
          </div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>RoadSense Sensor Intelligence</h2>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            Simulated IoT network using smartphone accelerometers, vehicle-mounted vibration sensors, and GPS-tagged road monitors continuously stream road health data to our AI engine.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-left">
            {[
              { label: "Active Sensors", value: "847", sub: "Real-time monitoring" },
              { label: "Anomalies Today", value: "34", sub: "Auto-detected" },
              { label: "Avg Stress Index", value: "4.2/10", sub: "Network average" },
              { label: "Uptime", value: "99.7%", sub: "Platform availability" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(14,165,164,0.2)" }}>
                <div className="text-2xl font-bold mb-1" style={{ color: "#0EA5A4", fontFamily: "Sora, sans-serif" }}>{value}</div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</div>
              </div>
            ))}
          </div>
          <Link href="/sensors">
            <button className="mt-8 px-8 py-4 rounded-xl text-base font-semibold text-white" style={{ background: "#0EA5A4" }}>
              Explore Sensor Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>Ready to See It in Action?</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>Access the full demo instantly. No signup required.</p>
          <Link href="/dashboard">
            <button className="px-10 py-4 rounded-xl text-lg font-semibold text-white hover:opacity-90" style={{ background: "#0EA5A4" }}>
              Launch Demo Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0EA5A4" }}>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel</span>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
          AI-Powered Road Intelligence Platform — Pune Pilot Phase | May 2026
        </p>
      </footer>
    </div>
  );
}
