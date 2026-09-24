"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScanEye, ArrowRight, Lock, User, Radio, Cpu } from "lucide-react";

const ROLES = [
  { id: "ceo", label: "CEO" },
  { id: "bdm", label: "Business Development" },
  { id: "ops", label: "Operations" },
  { id: "marketing", label: "Marketing" },
];

export default function LoginPage() {
  const [role, setRole] = useState("ceo");
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", "Demo User");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen soc-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-800 border border-cyan-400/40 mb-5">
            <ScanEye className="w-9 h-9 text-cyan-400" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">// Restricted Access</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TSFS SECOPS CONSOLE</h1>
          <p className="text-sm text-slate-500 mt-1.5">Security Operations & Facility Management</p>
        </div>

        {/* Console card */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 shadow-2xl shadow-black/40">
          <div className="space-y-6">
            {/* Role selector */}
            <div>
              <label className="soc-label">Operator Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`soc-tab text-center leading-tight ${
                      role === r.id ? "soc-tab-active" : "soc-tab-idle"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="soc-label">Operator ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="email" defaultValue="demo@tsfs.in" className="soc-input pl-9" placeholder="demo@tsfs.in" />
              </div>
            </div>

            <div>
              <label className="soc-label">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="password" defaultValue="demo" className="soc-input pl-9" placeholder="••••••••" />
              </div>
            </div>

            <button onClick={handleLogin} className="w-full soc-btn soc-btn-primary py-3">
              Access Console <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* System readout */}
          <div className="mt-6 pt-4 border-t border-ink-800 space-y-1.5 font-mono text-[10px] text-slate-600">
            <div className="flex justify-between">
              <span>MODE :: DEMO-SANDBOX</span>
              <span className="text-lime-400 flex items-center gap-1"><Radio className="w-3 h-3" /> ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>NETWORK :: TSFS-GROWTH-01</span>
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> ENCRYPTION N/A</span>
            </div>
            <div className="text-cyan-500/70">No authentication required in demo mode</div>
          </div>
        </div>
      </div>
    </div>
  );
}