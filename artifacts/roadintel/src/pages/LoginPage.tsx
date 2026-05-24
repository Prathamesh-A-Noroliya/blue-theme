import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, loginAsGuest } = useAuth();
  const [, setLocation] = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    const ok = login(email, password);
    if (ok) setLocation("/dashboard");
    else setError("Invalid credentials");
  };

  const handleGuest = () => {
    loginAsGuest();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-600">
      <div className="relative w-full max-w-md">
        <div className="p-8 rounded-2xl bg-slate-800/50 backdrop-blur border border-blue-400/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-400">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-xl" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel</div>
              <div className="text-xs text-white/60">Pune Road Safety Intelligence Platform</div>
            </div>
          </div>

          <div className="mb-6">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white/80">
              Pilot Phase — May 2026
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Sora, sans-serif" }}>Sign In</h1>
          <p className="text-sm text-white/50 mb-6">Access road intelligence and accountability tools.</p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/70">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white/70">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs text-white/40">Forgot password?</span>
              </div>
            </div>
            {error && <div className="text-xs text-red-300">{error}</div>}
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-white to-blue-100 text-blue-900 hover:from-blue-50 hover:to-blue-200 transition-colors">
              Sign In
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-xs text-white/40 bg-transparent">or</span></div>
          </div>

          <button onClick={handleGuest} className="w-full py-3 rounded-xl text-sm font-semibold border border-white/50 text-white hover:bg-white/10 transition-colors">
            Continue as Guest
          </button>

          <div className="mt-5 text-center">
            <p className="text-xs text-white/30">Demo: admin@roadintel.in / demo1234</p>
          </div>

          <p className="text-center text-sm mt-4 text-white/40">
            Don't have an account?{" "}
            <span className="cursor-pointer text-teal-300 hover:text-teal-200">Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
}
