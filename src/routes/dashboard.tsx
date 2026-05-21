import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Mic, Send, Sparkles, Image as ImageIcon, MapPin, Clock, CheckCircle2,
  Star, MessageCircle, Phone, ShieldCheck, ChevronRight, Bell, Search,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Ichalkaranji Seva" }] }),
  component: Dashboard,
});

const suggestions = [
  "Plumber for leaking tap — Kabnur",
  "Veg catering for 50 people on Sunday",
  "Powerloom belt replacement",
  "Marathi tutor for 8th std",
];

const tasks = [
  { t: "Tailor for 200 school uniforms", s: "Matching", c: "Tailoring", time: "2m ago", vendors: 4, color: "bg-grad-primary" },
  { t: "Plumber near Kabnur — urgent", s: "Connected", c: "Plumbing", time: "1h ago", vendors: 2, color: "bg-grad-accent" },
  { t: "Veg catering for 100 ppl tomorrow", s: "Completed", c: "Catering", time: "yesterday", vendors: 3, color: "bg-emerald" },
];

function Dashboard() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<null | { cat: string; people: string; date: string; urgency: string; city: string }>(null);
  const [processing, setProcessing] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      setParsed({ cat: "Catering", people: "100", date: "Tomorrow", urgency: "High", city: "Ichalkaranji" });
      setProcessing(false);
    }, 1200);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">नमस्कार, Rohan</div>
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

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Task Input */}
            <div className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-grad-primary opacity-20 blur-3xl" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-violet" /> Seva AI · understands मराठी, हिंदी, English
              </div>
              <div className="mt-4 flex items-start gap-3 p-3 rounded-2xl border border-border bg-background/60">
                <button className="h-10 w-10 shrink-0 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring">
                  <Mic className="h-5 w-5" />
                </button>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need veg catering for 100 people tomorrow in Ichalkaranji…"
                  className="flex-1 bg-transparent outline-none text-sm resize-none pt-2"
                />
                <div className="flex flex-col gap-2">
                  <button className="h-9 w-9 rounded-lg glass grid place-items-center"><ImageIcon className="h-4 w-4" /></button>
                  <button onClick={submit} className="h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center"><Send className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setText(s)} className="text-xs px-3 py-1.5 rounded-full glass hover:bg-secondary transition">
                    {s}
                  </button>
                ))}
              </div>

              {/* AI parsing */}
              {processing && (
                <div className="mt-5 glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-grad-primary animate-pulse" />
                  <div className="text-sm">Seva AI is understanding your task…</div>
                </div>
              )}
              {parsed && !processing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Sparkles className="h-3 w-3 text-violet" /> Structured task
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <Tag label="Category" v={parsed.cat} />
                    <Tag label="People" v={parsed.people} />
                    <Tag label="Date" v={parsed.date} />
                    <Tag label="Urgency" v={parsed.urgency} />
                    <Tag label="City" v={parsed.city} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">4 vendors matching · avg response 8 min</div>
                    <Link to="/vendors" className="text-sm px-4 py-2 rounded-lg bg-grad-primary text-white shadow-glow flex items-center gap-2">
                      See matches <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Recent tasks */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your tasks</h2>
                <Link to="/vendors" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
              </div>
              <div className="mt-4 space-y-3">
                {tasks.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl border border-border bg-background/40 flex items-center gap-4 hover:shadow-soft transition">
                    <div className={`h-10 w-10 rounded-xl ${t.color} grid place-items-center text-white`}>
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{t.t}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                        <span>{t.c}</span><span>·</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.time}</span>
                      </div>
                    </div>
                    <div className="text-xs text-right">
                      <div className={`px-2 py-1 rounded-full ${t.s === "Completed" ? "bg-emerald/20 text-emerald" : t.s === "Connected" ? "bg-electric/20 text-electric" : "bg-violet/20 text-violet"}`}>{t.s}</div>
                      <div className="text-muted-foreground mt-1">{t.vendors} vendors</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Vendor matches preview */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-xl font-semibold">Top matches near you</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  { n: "Annapurna Catering", c: "Catering · 12 yrs", r: 4.9, dist: "1.2 km" },
                  { n: "Rajesh Plumbing", c: "Plumber · 8 yrs", r: 4.7, dist: "0.8 km" },
                ].map((v) => <VendorMini key={v.n} {...v} />)}
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
                <div className="h-full w-[94%] bg-grad-primary" />
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

function Tag({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{v}</div>
    </div>
  );
}

function VendorMini({ n, c, r, dist }: { n: string; c: string; r: number; dist: string }) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-background/40 flex items-center gap-3">
      <div className="h-12 w-12 rounded-xl bg-grad-accent grid place-items-center text-white font-bold">{n[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{n}</div>
        <div className="text-xs text-muted-foreground">{c}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
          <Star className="h-3 w-3 fill-saffron text-saffron" /> {r} · <MapPin className="h-3 w-3" /> {dist}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <button className="h-8 w-8 rounded-lg bg-emerald text-white grid place-items-center"><MessageCircle className="h-4 w-4" /></button>
        <button className="h-8 w-8 rounded-lg bg-electric text-white grid place-items-center"><Phone className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
