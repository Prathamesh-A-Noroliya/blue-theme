import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, loginAsGuest } = useAuth();
  const [, setLocation] = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    const ok = login(email, password);
    if (ok) setLocation("/dashboard");
    else setError("Invalid credentials. Try admin@roadintel.in / demo1234");
  };

  const handleGuest = () => {
    loginAsGuest();
    setLocation("/dashboard");
  };

  const handleDemo = () => {
    login("admin@roadintel.in", "demo1234");
    setLocation("/dashboard");
  };

  const handleForgot = () => {
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 3000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #111827 0%, #0b111b 45%, #082f49 100%)" }}
    >
      {/* subtle glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", top: "15%", left: "20%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(77,171,247,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(8,47,73,0.5) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #4dabf7, #82cfff)", boxShadow: "0 0 32px rgba(77,171,247,0.35)" }}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#07111f]" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>Welcome to RoadIntel</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Pune Road Safety Intelligence Platform</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(17,22,31,0.92)",
            border: "1px solid rgba(148,163,184,0.12)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Form */}
          <form onSubmit={handleSignIn}>
          {/* Email field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@roadintel.in"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#0d1117",
                  border: "1px solid rgba(148,163,184,0.15)",
                  color: "#f8fafc",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(77,171,247,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(148,163,184,0.15)")}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#0d1117",
                  border: "1px solid rgba(148,163,184,0.15)",
                  color: "#f8fafc",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(77,171,247,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(148,163,184,0.15)")}
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#64748b" }}>
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={handleForgot}
              className="text-xs transition-colors"
              style={{ color: forgotSent ? "#22c55e" : "#4dabf7" }}
            >
              {forgotSent ? "Reset link sent to your email" : "Forgot your password?"}
            </button>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              {error}
            </div>
          )}

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-4"
            style={{
              background: "linear-gradient(135deg, #3b9ff3, #66b9ff)",
              color: "#07111f",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(77,171,247,0.35)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Sign In to Dashboard
          </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: "1px solid rgba(148,163,184,0.12)" }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs" style={{ background: "rgba(17,22,31,0.92)", color: "#64748b" }}>OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Demo Mode + Guest Access */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDemo}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(77,171,247,0.08)",
                border: "1px solid rgba(77,171,247,0.2)",
                color: "#f8fafc",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(77,171,247,0.15)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(77,171,247,0.08)")}
            >
              Demo Mode
            </button>
            <button
              onClick={handleGuest}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(77,171,247,0.08)",
                border: "1px solid rgba(77,171,247,0.2)",
                color: "#f8fafc",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(77,171,247,0.15)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(77,171,247,0.08)")}
            >
              Guest Access
            </button>
          </div>

          <p className="text-center text-sm mt-5" style={{ color: "#64748b" }}>
            Don't have an account?{" "}
            <span className="cursor-pointer font-medium" style={{ color: "#4dabf7" }}>Create Account</span>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#475569" }}>
          RoadIntel Pilot — Maharashtra Road Safety Initiative
        </p>
      </div>
    </div>
  );
}
