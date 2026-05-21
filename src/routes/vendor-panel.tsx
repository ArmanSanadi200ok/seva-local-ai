import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { TrendingUp, Star, MessageCircle, Phone, IndianRupee, Sparkles, ToggleRight, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/vendor-panel")({
  head: () => ({ meta: [{ title: "Vendor Panel — Ichalkaranji Seva" }] }),
  component: VendorPanel,
});

const leads = [
  { c: "Catering · 100 ppl · tomorrow", area: "Shahupuri", time: "2m ago", urgent: true },
  { c: "Tiffin · 30 boxes · office", area: "MIDC", time: "10m ago", urgent: false },
  { c: "Wedding catering · 500 ppl", area: "Kabnur", time: "1h ago", urgent: false },
];

function VendorPanel() {
  const [online, setOnline] = useState(true);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Annapurna Catering · Vendor</div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">Good morning, Sunita ji 🙏</h1>
          </div>
          <button onClick={() => setOnline(!online)} className={`flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition ${online ? "bg-emerald text-white shadow-glow" : "glass"}`}>
            <span className={`h-2 w-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-muted-foreground"}`} />
            {online ? "Accepting leads" : "Offline"}
            <ToggleRight className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "This month earnings", v: "₹ 84,200", i: IndianRupee, up: "+22%" },
            { l: "New leads", v: "47", i: TrendingUp, up: "+18%" },
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
          {/* Leads */}
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Incoming AI-matched leads</h2>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="mt-4 space-y-3">
              {leads.map((l, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-background/40 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-grad-accent grid place-items-center text-white"><Sparkles className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{l.c}</div>
                      {l.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">URGENT</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">📍 {l.area} · {l.time}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-9 w-9 rounded-lg bg-emerald text-white grid place-items-center"><MessageCircle className="h-4 w-4" /></button>
                    <button className="h-9 w-9 rounded-lg bg-electric text-white grid place-items-center"><Phone className="h-4 w-4" /></button>
                    <button className="px-3 h-9 rounded-lg bg-grad-primary text-white text-xs">Accept</button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI smart replies */}
            <div className="mt-6 glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-violet" /> AI Smart Replies (Marathi)
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["नमस्कार! आम्ही उपलब्ध आहोत.", "किती लोकांसाठी?", "Quote 30 min मध्ये पाठवतो"].map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-secondary cursor-pointer hover:bg-grad-primary hover:text-white transition">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews + profile */}
          <div className="space-y-6">
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
              <p className="text-sm opacity-90 mt-1">Your profile is verified. You appear in top matches.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
