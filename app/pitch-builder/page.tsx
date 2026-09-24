"use client";
import { useState } from "react";
import { Handshake, Sparkles, Copy, Check, RefreshCcw } from "lucide-react";

const INDUSTRIES = ["Hospital", "Factory", "IT Park", "Apartment"] as const;
const PAINS = ["Theft", "Unauthorized Access", "Poor Reporting", "Weak Supervision"] as const;

type Industry = (typeof INDUSTRIES)[number];
type Pain = (typeof PAINS)[number];

// Core selling angles per industry.
const ANGLE: Record<Industry, { problem: string; differentiator: string; stat: string }> = {
  Hospital: {
    problem: "Hospitals juggle patient safety, restricted wards and public footfall 24/7 — one weak shift can cost trust.",
    differentiator: "TSFS deploys hospital-trained guards with visitor control and emergency-response drills, not just gatekeepers.",
    stat: "Our healthcare clients report faster incident resolution with switch-over and supervisor cover every shift.",
  },
  Factory: {
    problem: "Factories bleed money through pilferage, wildcat gate entries and half-written shift logs.",
    differentiator: "We run industrial SOPs — baggage checks, vehicle registers, weighbridge discipline and tamper-proof reporting.",
    stat: "Warehouse and plant clients see shrinkage incidents logged and escalated daily, not after the audit.",
  },
  "IT Park": {
    problem: "IT parks need discreet, professional security that does not disrupt tenants while blocking tailgating and badge abuse.",
    differentiator: "TSFS guards are groomed for corporate front desks — access control, biometric lanes and visitor escort built in.",
    stat: "Our corporate deployments include weekly SOP reviews and monthly security reports the facilities team can verify.",
  },
  Apartment: {
    problem: "Apartments want friendly, reliable guards who know residents and still enforce the rules for delivery riders and visitors.",
    differentiator: "We background-check, train and supervise each guard so societies get consistency, not turnover churn.",
    stat: "Apartment communities get guard attendance logs and incident registers visible to the managing committee.",
  },
};

// Objection handlers for each pain point.
const OBJECTIONS: Record<Pain, { objection: string; handling: string; closing: string }> = {
  Theft: {
    objection: "Our current guards have been here for years — replacing them feels risky.",
    handling: "We do not force churn. TSFS takes over the existing shift team where possible, adds supervision and a reporting line so incidents stop falling through cracks.",
    closing: "Let us run a free 14-day trial on one gate — you keep accountability, we back it with a supervisor.",
  },
  "Unauthorized Access": {
    objection: "We already have locks, cards and a watchman — what will you add?",
    handling: "Physical controls only work when someone owns the process. We add verification at every entry point, random gate checks and a daily access log you can trust.",
    closing: "We will audit your entry points today and show you exactly where access is slipping — no obligation.",
  },
  "Poor Reporting": {
    objection: "Our problem is visibility, not manpower. We never know what happens at night.",
    handling: "Every TSFS shift ends with a written report — incidents, movements, anomalies — reviewed by a supervisor and shared the next morning.",
    closing: "Give us one shift to change how you see your site. We will hand you the first report by day two.",
  },
  "Weak Supervision": {
    objection: "Guards are fine; supervisors are the missing piece. Your cost will tell.",
    handling: "Supervision is priced in, not added on. One supervisor oversees each cluster and runs the random checks that keep guards honest.",
    closing: "Pricing is transparent — see the supervision line in the quote before you commit.",
  },
};

const DISCOVERY: Record<Industry, string[]> = {
  Hospital: [
    "How many shift changes happen daily and how is the handover recorded?",
    "Which wards or pick-up points are most vulnerable after visiting hours?",
    "Who currently monitors the CCTV wall during night shifts?",
  ],
  Factory: [
    "Where has shrinkage happened in the last 12 months — goods, fuel, or inventory?",
    "How are truck entries and exits verified at the weighbridge?",
    "What happens when a guard calls in absent at 6 AM?",
  ],
  "IT Park": [
    "How many badges are lost or unreturned every quarter?",
    "Do tenants expect guards to manage visitor escorts and package desks?",
    "Is there a single point of contact for security complaints?",
  ],
  Apartment: [
    "How do delivery riders, maids and contractors get cleared to enter?",
    "What is the current guard attrition rate and who relieves them?",
    "Does the managing committee receive a monthly security report?",
  ],
};

export default function PitchBuilderPage() {
  const [industry, setIndustry] = useState<Industry>("Hospital");
  const [pains, setPains] = useState<Pain[]>(["Unauthorized Access"]);
  const [copied, setCopied] = useState(false);

  const togglePain = (p: Pain) => {
    setPains((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const angle = ANGLE[industry];

  const pitch = `${angle.differentiator} ${angle.problem} ${angle.stat}`;

  const objectionHandling = pains.map((p) => OBJECTIONS[p]);

  const closing = payoutClosing(pains, industry);

  const copyAll = () => {
    const text = [
      `TSFS PITCH — ${industry}`,
      "",
      "DISCOVERY QUESTIONS",
      ...DISCOVERY[industry].map((q, i) => `${i + 1}. ${q}`),
      "",
      "SALES PITCH",
      pitch,
      "",
      "OBJECTION HANDLING",
      ...objectionHandling.map((o) => `Q: ${o.objection}\nA: ${o.handling}`),
      "",
      "CLOSING",
      closing,
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="soc-wrap">
      <div className="soc-page-header">
        <div className="soc-page-title">
          <div className="soc-kicker">// MODULE — Pitch Builder</div>
          <h1 className="soc-h1 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-cyan-400" />
            Pitch Builder
          </h1>
          <p className="soc-sub">Select industry + pain points to generate a ready-to-deliver sales pitch</p>
        </div>
        <div className="soc-actions">
          <button onClick={copyAll} className="soc-btn soc-btn-ghost">
            {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Full Pitch"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="soc-panel">
            <h2 className="soc-card-title mb-4">1. Select Industry</h2>
            <div className="space-y-2">
              {INDUSTRIES.map((i) => (
                <button
                  key={i}
                  onClick={() => setIndustry(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    industry === i ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 font-medium" : "border-ink-600 text-slate-300 hover:bg-ink-800"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="soc-panel">
            <h2 className="soc-card-title mb-4">2. Pain Points</h2>
            <div className="space-y-2">
              {PAINS.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePain(p)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    pains.includes(p) ? "border-amber-400/40 bg-amber-400/10 text-amber-300 font-medium" : "border-ink-600 text-slate-300 hover:bg-ink-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPains(PAINS.filter((_, i) => i === 0) as Pain[])}
              className="mt-3 text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-2 space-y-6">
          {pains.length === 0 ? (
            <div className="soc-card p-12 text-center text-slate-500">
              Select at least one pain point to generate the pitch.
            </div>
          ) : (
            <>
              {/* Discovery Questions */}
              <div className="soc-panel">
                <h3 className="soc-card-title mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Discovery Questions
                </h3>
                <ol className="space-y-2 text-sm text-slate-400 list-decimal pl-5">
                  {DISCOVERY[industry].map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>

              {/* Sales Pitch */}
              <div className="bg-ink-800 border border-cyan-400/40 rounded-xl p-6">
                <h3 className="soc-kicker mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Your Pitch
                </h3>
                <p className="text-lg leading-relaxed text-slate-100">{pitch}</p>
              </div>

              {/* Objection Handling */}
              {objectionHandling.map((o, i) => (
                <div key={i} className="soc-panel">
                  <h3 className="soc-card-title mb-3">Objection Handling — {pains[i]}</h3>
                  <div className="mb-3 p-3 bg-ink-850 border border-ink-600/60 rounded-lg text-sm text-slate-300">
                    <span className="text-slate-500 font-medium">Client says: </span>{o.objection}
                  </div>
                  <div className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-sm text-slate-200">
                    <span className="text-cyan-300 font-medium">TSFS responds: </span>{o.handling}
                  </div>
                </div>
              ))}

              {/* Closing */}
              <div className="soc-panel">
                <h3 className="soc-card-title mb-3">Closing Statement</h3>
                <p className="text-slate-300">{closing}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function payoutClosing(pains: Pain[], industry: Industry) {
  const base = `The average incumbent change-over happens because of ${pains.map((p) => p.toLowerCase()).join(", ")} — one conversation and one trial fixes that.`;
  const ask =
    industry === "Hospital"
      ? "Give TSFS a 14-day live shift at reception. Judge us on the handover report, not the sales call."
      : industry === "Factory"
      ? "Give TSFS one gate for 14 days. Judge us on the shrinkage log and the shift reports."
      : industry === "IT Park"
      ? "Run a 2-week supervised pilot on your visitor desk. Judge us on how seamless tenants find it."
      : "Run a 2-week trial at the main gate. Judge us on the visitor register and resident feedback.";
  return `${base} ${ask}`;
}