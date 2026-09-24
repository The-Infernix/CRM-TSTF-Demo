// Lead scoring formula — exactly per the Growth Engine blueprint.
import type { Lead } from "./store";

export const INDUSTRY_SCORES: Record<string, number> = {
  Hospital: 20,
  Factory: 15,
  "IT Park": 20,
  Apartment: 10,
  Mall: 15,
};

export const PAIN_SCORES: Record<string, number> = {
  High: 25,
  Medium: 15,
  Low: 5,
};

export interface ScoreFactor {
  label: string;
  value: number;
  max: number;
  reason: string;
}

export function scoreLead(lead: Partial<Lead> & { industry?: string }): string {
  let score = 0;
  score += INDUSTRY_SCORES[lead.industry || ""] || 10;
  score += lead.contactPerson ? 20 : 0;
  score += PAIN_SCORES[lead.painPoints || "Low"] || 5;
  if (lead.budgetConfirmed) score += 20;
  else if (lead.potentialRevenue && lead.potentialRevenue > 0) score += 5;
  if (score >= 60) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}

export function scoreFactors(lead: Partial<Lead> & { industry?: string }): { factors: ScoreFactor[]; total: number } {
  let total = 0;
  const factors: ScoreFactor[] = [];

  const ind = INDUSTRY_SCORES[lead.industry || ""] || 10;
  total += ind;
  factors.push({ label: "Industry", value: ind, max: 20, reason: `${lead.industry || "Other"} scores ${ind}/20` });

  const dm = lead.contactPerson ? 20 : 0;
  total += dm;
  factors.push({ label: "Decision Maker Contact", value: dm, max: 20, reason: lead.contactPerson ? "Contact available" : "No contact" });

  const pain = PAIN_SCORES[lead.painPoints || "Low"] || 5;
  total += pain;
  factors.push({ label: "Pain Points", value: pain, max: 25, reason: `${lead.painPoints || "Low"} pain level` });

  const budget = lead.budgetConfirmed ? 20 : lead.potentialRevenue && lead.potentialRevenue > 0 ? 5 : 0;
  total += budget;
  factors.push({
    label: "Budget Confirmed",
    value: budget,
    max: 20,
    reason: lead.budgetConfirmed ? "Budget confirmed" : lead.potentialRevenue ? "Budget mentioned" : "Budget unknown",
  });

  return { factors, total };
}

export const SCORE_STYLE: Record<string, string> = {
  Hot: "bg-red-400/15 text-red-300 border-red-400/40",
  Warm: "bg-amber-400/15 text-amber-300 border-amber-400/40",
  Cold: "bg-cyan-400/15 text-cyan-300 border-cyan-400/40",
};

export const STATUS_STYLE: Record<string, string> = {
  New: "bg-ink-700 text-slate-300 border-ink-500",
  Contacted: "bg-cyan-400/15 text-cyan-300 border-cyan-400/40",
  "Meeting Scheduled": "bg-amber-400/15 text-amber-300 border-amber-400/40",
  "Site Audit": "bg-purple-400/15 text-purple-300 border-purple-400/40",
  "Proposal Sent": "bg-indigo-400/15 text-indigo-300 border-indigo-400/40",
  Negotiation: "bg-orange-400/15 text-orange-300 border-orange-400/40",
  Won: "bg-lime-400/15 text-lime-300 border-lime-400/40",
  Lost: "bg-red-400/15 text-red-300 border-red-400/40",
};