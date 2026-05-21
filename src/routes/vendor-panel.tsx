import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { TrendingUp, Star, MessageCircle, Phone, IndianRupee, Sparkles, ToggleRight, CheckCircle2, Clock, Inbox, Target, BarChart3, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/vendor-panel")({
  head: () => ({ meta: [{ title: "Vendor Panel — Ichalkaranji Seva" }] }),
  component: VendorPanel,
});

type LeadStatus = "new" | "viewed" | "replied" | "quoted" | "won" | "lost";
interface Lead {
  id: string;
  title: string;
  area: string;
  time: string;
  urgent: boolean;
  customer: string;
  budget: string;
  status: LeadStatus;
  matchScore: number;
}

const INITIAL_LEADS: Lead[] = [
  { id: "l1", title: "Catering · 100 ppl · tomorrow", area: "Shahupuri", time: "2m ago", urgent: true, customer: "Rohan P.", budget: "₹ 12,000 – ₹ 22,000", status: "new", matchScore: 96 },
  { id: "l2", title: "Tiffin · 30 boxes · office", area: "MIDC", time: "10m ago", urgent: false, customer: "Anjali D.", budget: "₹ 3,600 – ₹ 5,400", status: "viewed", matchScore: 88 },
  { id: "l3", title: "Wedding catering · 500 ppl", area: "Kabnur", time: "1h ago", urgent: false, customer: "Mr. Patil", budget: "₹ 60,000 – ₹ 1,10,000", status: "replied", matchScore: 92 },
  { id: "l4", title: "Birthday party catering · 40 ppl", area: "Rajwada", time: "3h ago", urgent: false, customer: "Sneha K.", budget: "₹ 4,800 – ₹ 8,800", status: "quoted", matchScore: 81 },
];

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-violet/15 text-violet",
  viewed: "bg-electric/15 text-electric",
  replied: "bg-cyan/15 text-cyan",
  quoted: "bg-saffron/20 text-saffron",
  won: "bg-emerald/15 text-emerald",
  lost: "bg-muted text-muted-foreground",
};

function VendorPanel() {
  const [online, setOnline] = useState(true);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [incoming, setIncoming] = useState(false);

  // Simulate incoming lead every 14s
  useEffect(() => {
    if (!online) return;
    const t = setInterval(() => {
      setIncoming(true);
      setTimeout(() => {
        setLeads((ls) => [
          { id: `l${Date.now()}`, title: "Plumber · leaking tap · Kabnur", area: "Kabnur", time: "just now", urgent: true, customer: "New customer", budget: "₹ 200 – ₹ 1,500", status: "new", matchScore: 94 },
          ...ls,
        ]);
        setIncoming(false);
      }, 1400);
    }, 14000);
    return () => clearInterval(t);
  }, [online]);

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const conversion = Math.round((leads.filter((l) => l.status === "won").length / Math.max(leads.length, 1)) * 100) || 38;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Annapurna Catering · Vendor CRM</div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">Good morning, Sunita ji 🙏</h1>
          </div>
          <button onClick={() => setOnline(!online)} className={`flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition ${online ? "bg-emerald text-white shadow-glow" : "glass"}`}>
            <span className={`h-2 w-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-muted-foreground"}`} />
            {online ? "Accepting leads" : "Offline"}
            <ToggleRight className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { l: "This month earnings", v: "₹ 84,200", i: IndianRupee, up: "+22%" },
            { l: "New leads", v: String(leads.filter(l=>l.status==="new").length + 43), i: Inbox, up: "+18%" },
            { l: "Conversion rate", v: `${conversion}%`, i: Target, up: "+4%" },
            { l: "Avg rating", v: "4.9", i: Star, up: "+0.1" },
            { l: "Response time", v: "5 min", i: Clock, up: "-1m" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white"><s.i className="h-4 w-4" /></div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald/20 text-emerald">{s.up}</span>
              </div>
              <div className="mt-3 text-2xl font-bold">{s.v}</div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Lead inbox */}
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Lead Inbox</h2>
                <div className="text-xs text-muted-foreground mt-0.5">AI-matched & sorted by score</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {incoming && (
                  <span className="flex items-center gap-1.5 text-violet">
                    <Loader2 className="h-3 w-3 animate-spin" /> incoming lead…
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-emerald"><span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> Live</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <AnimatePresence initial={false}>
                {leads.map((l) => (
                  <motion.div key={l.id} layout
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 rounded-2xl border border-border bg-background/40 flex flex-wrap items-center gap-4 hover:shadow-soft transition">
                    <div className="h-11 w-11 rounded-xl bg-grad-accent grid place-items-center text-white shrink-0"><Sparkles className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium">{l.title}</div>
                        {l.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-medium">URGENT</span>}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/15 text-violet font-medium">{l.matchScore}% match</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">📍 {l.area} · {l.customer} · {l.budget} · {l.time}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full capitalize font-medium ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setOpenLead(l)} className="h-9 w-9 rounded-lg bg-emerald text-white grid place-items-center" title="WhatsApp"><MessageCircle className="h-4 w-4" /></button>
                      <button className="h-9 w-9 rounded-lg bg-electric text-white grid place-items-center" title="Call"><Phone className="h-4 w-4" /></button>
                      <button onClick={() => updateStatus(l.id, "won")} className="px-3 h-9 rounded-lg bg-grad-primary text-white text-xs">Accept</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Funnel */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Conversion funnel</h2>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { l: "Leads received", n: 47, w: 100, c: "bg-grad-primary" },
                  { l: "Replied", n: 38, w: 80, c: "bg-electric" },
                  { l: "Quoted", n: 24, w: 51, c: "bg-saffron" },
                  { l: "Won", n: 18, w: 38, c: "bg-emerald" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{s.l}</span><span className="font-medium">{s.n}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.w}%` }} transition={{ duration: 0.8 }} className={`h-full ${s.c}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h2 className="text-lg font-semibold">Recent reviews</h2>
              <div className="mt-4 space-y-4">
                {[
                  { n: "Rohan P.", r: 5, q: "Excellent food, on-time delivery." },
                  { n: "Anjali D.", r: 5, q: "Saved my wedding! Highly recommend." },
                ].map((r) => (
                  <div key={r.n}>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{r.n}</span>
                      <div className="flex">{[...Array(r.r)].map((_, i) => <Star key={i} className="h-3 w-3 fill-saffron text-saffron" />)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">"{r.q}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-grad-primary p-6 text-white shadow-glow">
              <CheckCircle2 className="h-6 w-6" />
              <div className="mt-3 font-semibold">Verified Vendor Badge</div>
              <p className="text-sm opacity-90 mt-1">Your profile is verified. You appear in top AI matches.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead detail / smart reply drawer */}
      <AnimatePresence>
        {openLead && <LeadDrawer lead={openLead} onClose={() => setOpenLead(null)} onStatus={(s) => { updateStatus(openLead.id, s); setOpenLead(null); }} />}
      </AnimatePresence>
    </Layout>
  );
}

function LeadDrawer({ lead, onClose, onStatus }: { lead: Lead; onClose: () => void; onStatus: (s: LeadStatus) => void }) {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<{ from: "vendor" | "ai"; t: string }[]>([
    { from: "ai", t: `New AI-matched lead: ${lead.title}. Customer: ${lead.customer}. Budget ${lead.budget}.` },
  ]);
  const send = (m: string) => {
    setMessages((ms) => [...ms, { from: "vendor", t: m }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((ms) => [...ms, { from: "ai", t: "Sent via WhatsApp ✓ · Customer notified" }]);
      setTyping(false);
    }, 900);
  };
  const replies = [
    "नमस्कार! आम्ही उपलब्ध आहोत.",
    "किती लोकांसाठी? Veg / Non-veg?",
    "Quote 30 min मध्ये पाठवतो",
    "Site visit करायचा का?",
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-end md:place-items-center" onClick={onClose}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} onClick={(e)=>e.stopPropagation()}
        className="w-full md:max-w-lg glass rounded-t-3xl md:rounded-3xl p-6 m-0 md:m-4 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold">{lead.title}</div>
            <div className="text-xs text-muted-foreground">{lead.customer} · {lead.area} · {lead.budget}</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg glass grid place-items-center"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2 bg-secondary/40 rounded-2xl p-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] text-sm px-3 py-2 rounded-xl ${m.from === "vendor" ? "ml-auto bg-emerald text-white" : "bg-card border border-border"}`}>{m.t}</div>
          ))}
          {typing && <div className="text-xs text-muted-foreground flex items-center gap-1"><span className="flex gap-0.5"><Dot/><Dot delay={0.15}/><Dot delay={0.3}/></span> typing…</div>}
        </div>

        <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-violet" /> AI smart replies (Marathi)</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {replies.map((r) => (
            <button key={r} onClick={() => send(r)} className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-grad-primary hover:text-white transition">{r}</button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button onClick={() => onStatus("quoted")} className="h-10 rounded-xl bg-saffron text-white text-sm font-medium">Send Quote</button>
          <button onClick={() => onStatus("won")} className="h-10 rounded-xl bg-emerald text-white text-sm font-medium">Mark Won</button>
          <button onClick={() => onStatus("lost")} className="h-10 rounded-xl glass text-sm">Decline</button>
        </div>
      </motion.div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return <motion.span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay }} />;
}
