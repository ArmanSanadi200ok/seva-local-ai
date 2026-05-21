import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Send, Sparkles, Image as ImageIcon, MapPin, Clock, CheckCircle2,
  Bell, Search, ChevronRight, Activity, ListChecks, XCircle, Hourglass,
  ShieldCheck, MessageCircle, Phone, Loader2, Code2, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { parseTaskAI, matchVendors, INITIAL_REQUESTS, QUICK_MESSAGES, fakeDelay, type ParsedTask, type Vendor, type SevaRequest, type RequestStatus } from "@/lib/sevaData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ichalkaranji Seva" }] }),
  component: Dashboard,
});

type Stage = "idle" | "understanding" | "structuring" | "searching" | "ranking" | "done";

const STAGE_COPY: Record<Exclude<Stage, "idle" | "done">, string> = {
  understanding: "Understanding your request…",
  structuring: "AI structuring task into fields…",
  searching: "Searching nearby verified vendors…",
  ranking: "Ranking by match score, distance & trust…",
};

const suggestions = [
  "Plumber for leaking tap — Kabnur, urgent",
  "Veg catering for 100 people tomorrow",
  "Powerloom belt replacement at MIDC",
  "Tailor for 200 school uniforms",
];

function Dashboard() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [parsed, setParsed] = useState<ParsedTask | null>(null);
  const [matches, setMatches] = useState<Vendor[]>([]);
  const [requests, setRequests] = useState<SevaRequest[]>(INITIAL_REQUESTS);

  // Simulated live feed: occasionally bump request status.
  useEffect(() => {
    const i = setInterval(() => {
      setRequests((rs) => rs.map((r) =>
        r.id === "r1" && r.matchedVendors < 6 ? { ...r, matchedVendors: r.matchedVendors + 1 } : r
      ));
    }, 8000);
    return () => clearInterval(i);
  }, []);

  const submit = async () => {
    if (!text.trim() || stage !== "idle" && stage !== "done") return;
    setParsed(null);
    setMatches([]);
    setStage("understanding");
    await fakeDelay(null, 700);
    setStage("structuring");
    await fakeDelay(null, 700);
    const p = parseTaskAI(text);
    setParsed(p);
    setStage("searching");
    await fakeDelay(null, 800);
    setStage("ranking");
    const m = matchVendors(p);
    await fakeDelay(null, 500);
    setMatches(m.slice(0, 3));
    setStage("done");

    // append a new active request
    setRequests((rs) => [
      { id: `r${Date.now()}`, title: text, category: p.category, status: "active", createdAt: "just now", area: p.location, matchedVendors: m.length, urgency: p.urgency_level, inquiryStatus: "sent" },
      ...rs,
    ]);
  };

  const stats = useMemo(() => {
    const count = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
    return [
      { l: "Active", v: count("active"), i: Activity, color: "text-electric", bg: "bg-electric/15" },
      { l: "Pending Match", v: count("pending"), i: Hourglass, color: "text-violet", bg: "bg-violet/15" },
      { l: "Completed", v: count("completed"), i: ListChecks, color: "text-emerald", bg: "bg-emerald/15" },
      { l: "Cancelled", v: count("cancelled"), i: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
    ];
  }, [requests]);

  const processing = stage !== "idle" && stage !== "done";

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" /> Live · नमस्कार, Rohan
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">What seva do you need today?</h1>
          </div>
          <div className="flex gap-2">
            <button className="glass h-10 w-10 grid place-items-center rounded-xl"><Search className="h-4 w-4" /></button>
            <button className="glass h-10 w-10 grid place-items-center rounded-xl relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald" />
            </button>
            <div className="h-10 px-3 rounded-xl bg-grad-primary text-white flex items-center gap-2 text-sm">
              <div className="h-6 w-6 rounded-full bg-white/20 grid place-items-center text-xs font-bold">R</div> Rohan
            </div>
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.l} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl ${s.bg} grid place-items-center ${s.color}`}>
                <s.i className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{s.v}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Task Input */}
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-grad-primary opacity-20 blur-3xl" />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-violet" /> Seva AI Engine · v2.1
                </div>
                <div className="flex items-center gap-1 text-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> online
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 p-3 rounded-2xl border border-border bg-background/60">
                <button className="h-10 w-10 shrink-0 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring">
                  <Mic className="h-5 w-5" />
                </button>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need urgent plumber near Kabnur for leaking tap…"
                  className="flex-1 bg-transparent outline-none text-sm resize-none pt-2"
                  disabled={processing}
                />
                <div className="flex flex-col gap-2">
                  <button className="h-9 w-9 rounded-lg glass grid place-items-center"><ImageIcon className="h-4 w-4" /></button>
                  <button onClick={submit} disabled={processing || !text.trim()} className="h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center disabled:opacity-40">
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setText(s)} disabled={processing} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-secondary transition disabled:opacity-40">
                    {s}
                  </button>
                ))}
              </div>

              {/* AI pipeline */}
              <AnimatePresence>
                {processing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 glass rounded-2xl p-4 overflow-hidden">
                    <PipelineStep active stage={stage} step="understanding" />
                    <PipelineStep active={["structuring","searching","ranking"].includes(stage)} stage={stage} step="structuring" />
                    <PipelineStep active={["searching","ranking"].includes(stage)} stage={stage} step="searching" />
                    <PipelineStep active={stage === "ranking"} stage={stage} step="ranking" last />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Structured JSON output */}
              {parsed && stage === "done" && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid md:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Sparkles className="h-3 w-3 text-violet" /> Structured task</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald/15 text-emerald font-medium">{parsed.confidence}% confidence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Category" v={parsed.category} />
                      <Field label="Service" v={parsed.service_type} />
                      <Field label="Location" v={parsed.location} />
                      <Field label="Urgency" v={parsed.urgency_level} tone={parsed.urgency_level === "high" ? "danger" : "info"} />
                      <Field label="Budget" v={parsed.budget_range} />
                      <Field label="ETA" v={parsed.estimated_time} />
                    </div>
                  </div>

                  {/* JSON view */}
                  <div className="rounded-2xl p-5 bg-foreground text-background font-mono text-[11px] overflow-auto">
                    <div className="flex items-center gap-2 text-background/60 mb-2 text-[10px] uppercase tracking-widest">
                      <Code2 className="h-3 w-3" /> seva.ai/parse → 200 OK
                    </div>
{`{
  "service_type": "${parsed.service_type}",
  "category": "${parsed.category}",
  "location": "${parsed.location}",
  "urgency_level": "${parsed.urgency_level}",
  "budget_range": "${parsed.budget_range}",
  "estimated_time": "${parsed.estimated_time}",
  "language": "${parsed.language}",
  "confidence": ${parsed.confidence}
}`}
                  </div>
                </motion.div>
              )}

              {/* Matched vendors mini */}
              {matches.length > 0 && stage === "done" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium flex items-center gap-2"><Zap className="h-4 w-4 text-saffron" /> {matches.length} vendors matched · avg response {Math.round(matches.reduce((a,b)=>a+b.responseMin,0)/matches.length)} min</div>
                    <Link to="/vendors" className="text-xs px-3 py-1.5 rounded-lg bg-grad-primary text-white flex items-center gap-1">See all <ChevronRight className="h-3 w-3" /></Link>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {matches.map((v, i) => <MatchedVendor key={v.id} v={v} best={i === 0} />)}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Requests table */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your requests</h2>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> Live sync</span>
              </div>
              <div className="mt-4 space-y-2">
                {requests.slice(0, 6).map((r, i) => (
                  <motion.div key={r.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="p-3 rounded-2xl border border-border bg-background/40 flex items-center gap-3 hover:shadow-soft transition">
                    <div className={`h-10 w-10 rounded-xl ${statusBg(r.status)} grid place-items-center`}>
                      <Sparkles className={`h-4 w-4 ${statusFg(r.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">{r.title}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{r.category}</span><span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.area}</span><span>·</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusPill status={r.status} />
                      {r.inquiryStatus && <div className="text-[10px] text-muted-foreground mt-1 capitalize">{r.matchedVendors} vendors · {r.inquiryStatus}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-grad-primary grid place-items-center text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Seva AI Assistant</div>
                  <div className="text-xs text-muted-foreground">Always here, in your language</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  "Track my plumbing request",
                  "Find cheapest catering",
                  "Reschedule yesterday's task",
                ].map((s) => (
                  <button key={s} className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-secondary transition flex items-center justify-between">
                    {s} <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Trust score</div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-4xl font-bold text-grad-primary">94</div>
                <div className="text-xs text-muted-foreground pb-1.5">verified profile</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ duration: 1.2 }} className="h-full bg-grad-primary" />
              </div>
              <div className="mt-4 space-y-2 text-xs">
                {[["Aadhaar verified", true], ["Phone verified", true], ["Address verified", false]].map(([l, ok]) => (
                  <div key={l as string} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${ok ? "text-emerald" : "text-muted-foreground"}`} />
                    <span className={ok ? "" : "text-muted-foreground"}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">WhatsApp quick replies</div>
              <div className="flex flex-col gap-1.5">
                {QUICK_MESSAGES.map((m) => (
                  <button key={m} className="text-left text-xs px-3 py-2 rounded-lg bg-emerald/10 hover:bg-emerald/20 text-emerald-foreground transition flex items-center justify-between">
                    <span className="truncate">{m}</span>
                    <MessageCircle className="h-3 w-3 text-emerald shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 bg-grad-primary text-white shadow-glow">
              <ShieldCheck className="h-6 w-6" />
              <div className="mt-3 font-semibold">Verified Local Vendors only</div>
              <p className="text-sm opacity-90 mt-1">Every vendor on Seva is verified in-person across Ichalkaranji & nearby cities.</p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Field({ label, v, tone }: { label: string; v: string; tone?: "info" | "danger" }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold mt-0.5 capitalize ${tone === "danger" ? "text-destructive" : ""}`}>{v}</div>
    </div>
  );
}

function PipelineStep({ active, stage, step, last }: { active: boolean; stage: Stage; step: keyof typeof STAGE_COPY; last?: boolean }) {
  const done = stageOrder(stage) > stageOrder(step);
  return (
    <div className={`flex items-center gap-3 ${last ? "" : "pb-2"}`}>
      <div className={`h-6 w-6 rounded-full grid place-items-center text-[10px] ${done ? "bg-emerald text-white" : active ? "bg-grad-primary text-white" : "bg-secondary text-muted-foreground"}`}>
        {done ? <CheckCircle2 className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : "•"}
      </div>
      <div className={`text-xs ${done || active ? "" : "text-muted-foreground"}`}>{STAGE_COPY[step]}</div>
    </div>
  );
}
function stageOrder(s: Stage) {
  return ["idle","understanding","structuring","searching","ranking","done"].indexOf(s);
}

function MatchedVendor({ v, best }: { v: Vendor; best: boolean }) {
  return (
    <div className={`relative rounded-2xl p-3 border ${best ? "border-violet/40 bg-violet/5" : "border-border bg-background/40"}`}>
      {best && <span className="absolute -top-2 left-3 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-grad-primary text-white shadow-glow">Best match</span>}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-grad-accent text-white grid place-items-center text-sm font-bold">{v.name[0]}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{v.name}</div>
          <div className="text-[10px] text-muted-foreground">{v.distanceKm} km · {v.responseMin} min</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald/15 text-emerald">{v.matchScore}% match</span>
        <button className="h-7 w-7 rounded-lg bg-emerald text-white grid place-items-center"><MessageCircle className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, string> = {
    active: "bg-electric/15 text-electric",
    pending: "bg-violet/15 text-violet",
    completed: "bg-emerald/15 text-emerald",
    cancelled: "bg-muted text-muted-foreground",
  };
  return <span className={`text-[10px] px-2 py-1 rounded-full capitalize font-medium ${map[status]}`}>{status}</span>;
}
function statusBg(s: RequestStatus) { return s==="active"?"bg-electric/15":s==="pending"?"bg-violet/15":s==="completed"?"bg-emerald/15":"bg-muted"; }
function statusFg(s: RequestStatus) { return s==="active"?"text-electric":s==="pending"?"text-violet":s==="completed"?"text-emerald":"text-muted-foreground"; }
