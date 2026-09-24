"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ScanEye, LayoutDashboard, Users, Brain, ClipboardCheck, FileText,
  Megaphone, TrendingUp, Calculator, CalendarClock, Handshake, ScrollText,
  Building2, Settings, LogOut, Menu, X, UserCheck, Radio, Signal, ShieldCheck
} from "lucide-react";
import { ROLE_NAV, ROLES, type Role } from "@/lib/store";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { key: "crm", label: "CRM", icon: Users, href: "/crm" },
  { key: "lead-intelligence", label: "Lead Intelligence", icon: Brain, href: "/lead-intelligence" },
  { key: "audit", label: "Security Audit", icon: ClipboardCheck, href: "/audit" },
  { key: "pitch-builder", label: "Pitch Builder", icon: Handshake, href: "/pitch-builder" },
  { key: "proposal", label: "Proposal Generator", icon: FileText, href: "/proposal" },
  { key: "pricing", label: "Pricing Engine", icon: Calculator, href: "/pricing" },
  { key: "follow-up", label: "Follow-Up Center", icon: CalendarClock, href: "/follow-up" },
  { key: "contracts", label: "Contract Mgmt", icon: Building2, href: "/contracts" },
  { key: "deployment", label: "Guard Deployment", icon: UserCheck, href: "/deployment" },
  { key: "client-portal", label: "Client Portal", icon: Users, href: "/client/login" },
  { key: "marketing", label: "Marketing Center", icon: Megaphone, href: "/marketing" },
  { key: "reports", label: "Reports", icon: ScrollText, href: "/reports" },
  { key: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>("ceo");
  const [userName, setUserName] = useState("Demo User");
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    const r = (localStorage.getItem("userRole") as Role) || "ceo";
    setRole(r);
    setUserName(localStorage.getItem("userName") || "Demo User");

    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-IN", { hour12: false }) + " IST"
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hidden = pathname === "/" || pathname.startsWith("/client/");
  if (hidden) return <>{children}</>;

  const allowed = new Set(ROLE_NAV[role] || []);
  const items = NAV.filter((n) => allowed.has(n.key));

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const brand = (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-ink-800 border border-cyan-400/40 flex items-center justify-center">
        <ScanEye className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="leading-tight">
        <div className="font-bold text-white tracking-wide">TSFS</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-cyan-500">SecOps Console</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen soc-bg">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink-950/95 border-b border-ink-800 text-white flex items-center justify-between px-4 py-3">
        {brand}
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-ink-950 border-r border-ink-800 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              {brand}
              <button onClick={() => setOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            {renderNav(items, pathname, role, userName, logout, () => setOpen(false))}
          </div>
        </div>
      )}

      {/* Desktop rail */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-ink-950/90 backdrop-blur border-r border-ink-800 flex-col">
        <div className="p-4 border-b border-ink-800">{brand}</div>
        <div className="px-4 pt-3 pb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-600">
          // Fleet Modules
        </div>
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto py-2">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg border-l-2 transition text-sm ${
                  active
                    ? "bg-ink-800/80 border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-500 hover:text-slate-200 hover:bg-ink-800/50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-ink-800 space-y-2">
          {/* Live status strip in rail */}
          <div className="grid grid-cols-3 gap-2 px-1">
            <StatusCell label="OPS" ok />
            <StatusCell label="COMMS" ok />
            <StatusCell label="ALERTS" />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] text-slate-500">{userName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-slate-500 hover:text-red-400 font-mono text-[10px] uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="lg:ml-60 pt-14 lg:pt-0 min-w-0">
        {/* Top status bar */}
        <header className="hidden lg:flex items-center justify-between gap-4 px-6 py-2.5 border-b border-ink-800 bg-ink-950/60 backdrop-blur sticky top-0 z-30 flex-wrap">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-lime-400">
              <Radio className="w-3.5 h-3.5" /> Console Live
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Signal className="w-3.5 h-3.5" /> TSFS GTM Net 2026
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" /> {ROLES[role]?.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-cyan-300">{now}</span>
            <span className="hidden xl:inline font-mono text-[10px] uppercase text-slate-500">
              Mission: grow → close → retain
            </span>
          </div>
        </header>
        <div className="text-slate-200 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function StatusCell({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1.5 rounded-md bg-ink-900 border border-ink-800">
      <span className={`soc-led ${ok ? "bg-lime-400" : "bg-slate-600"}`} />
      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}

function renderNav(
  items: typeof NAV,
  pathname: string,
  role: Role,
  userName: string,
  onLogout: () => void,
  onNavigate: () => void
) {
  return (
    <>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-lg border-l-2 transition text-sm ${
                active
                  ? "bg-ink-800/80 border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-200 hover:bg-ink-800/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-ink-800 pt-4 space-y-2">
        <div className="font-mono text-[10px] text-slate-500 px-1">Signed in as {userName} · {ROLES[role]?.label}</div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-slate-500 hover:text-red-400 font-mono text-[10px] uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </>
  );
}