import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mic, Send, Sparkles, MapPin, ShieldCheck, Zap, MessageCircle, Languages,
  Star, ArrowRight, Wrench, UtensilsCrossed, Scissors, Truck, Hammer, Cpu,
  ChevronDown, CheckCircle2, Phone, Building2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { LiveAIDemo } from "@/components/LiveAIDemo";
import { IndianEcosystem, TrustGrid } from "@/components/IndianEcosystem";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ichalkaranji Seva — AI Hyperlocal Concierge for Real India" },
      { name: "description", content: "AI-powered local services for Tier-2 & Tier-3 India. Find verified tailors, plumbers, caterers, and more in Ichalkaranji, Kolhapur, Sangli and Belgaum." },
      { property: "og:title", content: "Ichalkaranji Seva — AI Hyperlocal Concierge" },
      { property: "og:description", content: "Speak. Type. Get matched. AI that truly understands local India." },
    ],
  }),
  component: Landing,
});

const taskExamples = [
  { hi: "Need a tailor for 200 school uniforms", cat: "Tailoring", urgency: "This week", count: "200 pcs" },
  { hi: "Urgent plumber near Kabnur", cat: "Plumbing", urgency: "Within 1 hr", count: "1 visit" },
  { hi: "Veg catering for 100 people tomorrow", cat: "Catering", urgency: "Tomorrow", count: "100 ppl" },
  { hi: "Powerloom machine repair required", cat: "Industrial", urgency: "Today", count: "Inspection" },
];

const categories = [
  { icon: Scissors, label: "Tailors" },
  { icon: Wrench, label: "Plumbers" },
  { icon: UtensilsCrossed, label: "Catering" },
  { icon: Truck, label: "Logistics" },
  { icon: Hammer, label: "Repairs" },
  { icon: Cpu, label: "Powerloom" },
];

function Landing() {
  const [active, setActive] = useState(0);
  const example = taskExamples[active];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl pt-12 md:pt-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              Live in Ichalkaranji · Kolhapur · Sangli · Belgaum
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-5xl md:text-7xl font-bold leading-[1.05]">
              AI-powered <span className="text-grad-primary">local services</span> for real India.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl">
              Speak or type in हिंदी, मराठी or English. Our AI instantly understands your task and matches you with verified local vendors near you — in seconds.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-grad-primary text-white shadow-glow hover:opacity-90 transition">
                Try the AI Assistant <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/vendor-panel" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-secondary transition">
                <Building2 className="h-4 w-4" /> List your business
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald" /> Verified vendors</div>
              <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-electric" /> &lt;60s match</div>
              <div className="flex items-center gap-1.5"><Languages className="h-4 w-4 text-violet" /> 3 languages</div>
            </div>
          </div>

          {/* Hero AI preview */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="relative">
            <div className="absolute -inset-8 bg-grad-primary opacity-30 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl p-5 shadow-soft animate-float">
              {/* WhatsApp-style header */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="h-10 w-10 rounded-full bg-grad-primary grid place-items-center text-white text-sm font-semibold">सं</div>
                <div>
                  <div className="text-sm font-semibold">Seva AI</div>
                  <div className="text-[11px] text-emerald flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Online · understands Marathi</div>
                </div>
                <MessageCircle className="ml-auto h-5 w-5 text-emerald" />
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 mt-4">
                <div className="ml-auto max-w-[85%] bg-grad-primary text-white text-sm rounded-2xl rounded-tr-md px-4 py-2.5 shadow-soft">
                  {example.hi}
                </div>
                <div className="max-w-[90%] glass rounded-2xl rounded-tl-md px-4 py-3 text-sm">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                    <Sparkles className="h-3 w-3 text-violet" /> AI understood your task
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Field label="Category" value={example.cat} />
                    <Field label="Urgency" value={example.urgency} />
                    <Field label="Volume" value={example.count} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> Ichalkaranji · 4 vendors matching
                  </div>
                </div>
                <div className="flex gap-2">
                  {taskExamples.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-grad-primary" : "w-4 bg-border"}`} />
                  ))}
                </div>
              </div>

              {/* Input row */}
              <div className="mt-4 flex items-center gap-2 p-2 rounded-2xl border border-border bg-background/60">
                <button className="h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring">
                  <Mic className="h-4 w-4" />
                </button>
                <input placeholder="Type in हिंदी, मराठी or English…" className="flex-1 bg-transparent text-sm outline-none" />
                <button className="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center"><Send className="h-4 w-4" /></button>
              </div>
            </div>

            {/* floating chip */}
            <div className="absolute -left-6 bottom-10 glass rounded-2xl px-3 py-2 text-xs shadow-soft hidden md:flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald" /> 1,240+ verified vendors
            </div>
            <div className="absolute -right-4 top-10 glass rounded-2xl px-3 py-2 text-xs shadow-soft hidden md:flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric" /> Avg match in 42s
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: "1,240+", v: "Verified vendors" },
            { k: "12,500+", v: "Tasks completed" },
            { k: "4 cities", v: "Live across Maharashtra" },
            { k: "4.8 ★", v: "Avg user rating" },
          ].map((s) => (
            <div key={s.v} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-display font-bold text-grad-primary">{s.k}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE AI DEMO — the headline interactive section */}
      <LiveAIDemo />

      {/* INDIAN HYPERLOCAL ECOSYSTEM + WhatsApp thread */}
      <IndianEcosystem />

      {/* TRUST GRID */}
      <TrustGrid />

      {/* Categories */}
      <section className="mx-auto max-w-7xl mt-24">
        <SectionHeader eyebrow="What people ask" title="Every kind of seva, one assistant" sub="From a single button to repair a powerloom, to catering for a wedding — Seva AI maps it instantly." />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <div key={c.label} className="glass rounded-2xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-grad-accent grid place-items-center text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-medium">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1">200+ vendors</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl mt-24">
        <SectionHeader eyebrow="How it works" title="From thought to vendor in 60 seconds" />
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { n: "01", icon: Mic, t: "Speak or type", d: "In Marathi, Hindi or English. Voice, photo or text — whichever feels natural." },
            { n: "02", icon: Sparkles, t: "AI understands", d: "Our engine extracts category, urgency, location and volume into a structured task." },
            { n: "03", icon: ShieldCheck, t: "Match & connect", d: "Top 3 verified local vendors respond. WhatsApp & call ready — no spam, no middlemen." },
          ].map((s) => (
            <div key={s.n} className="glass rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-7xl font-display font-bold text-muted/40">{s.n}</div>
              <div className="h-11 w-11 rounded-xl bg-grad-primary text-white grid place-items-center"><s.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual / Voice highlight */}
      <section className="mx-auto max-w-7xl mt-24">
        <div className="glass rounded-3xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-grad-primary opacity-25 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-10 items-center relative">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Made for Real India</div>
              <h2 className="mt-3 text-4xl font-bold">Talks like you do. <span className="text-grad-primary">मराठी, हिंदी, English.</span></h2>
              <p className="mt-4 text-muted-foreground max-w-lg">
                No forms. No categories to scroll. Just talk. Our multilingual AI engine, fine-tuned for Tier-2 & Tier-3 Indian speech patterns, gets you exactly the help you need.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["मला घरी प्लंबर हवा आहे", "200 uniforms चाहिए", "Wedding decorator near me", "powerloom belt बदलायचा"].map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-full text-xs glass">{p}</span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-center">
                  <div className="relative h-28 w-28 rounded-full bg-grad-primary grid place-items-center text-white shadow-glow">
                    <Mic className="h-10 w-10" />
                    <span className="absolute inset-0 rounded-full animate-pulse-ring" />
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-muted-foreground">Tap to speak · we transcribe & extract intent in real time</div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {["Intent", "Location", "Time"].map((x) => (
                    <div key={x} className="text-center p-3 rounded-xl bg-secondary">
                      <CheckCircle2 className="h-4 w-4 mx-auto text-emerald" />
                      <div className="text-[11px] mt-1">{x}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl mt-24">
        <SectionHeader eyebrow="From the ground" title="Loved by locals, trusted by businesses" />
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { n: "Suresh Patil", r: "Powerloom Owner · Ichalkaranji", q: "Belt तुटला रात्री 10 ला — Seva ने 20 मिनिटात technician पाठवला. Game changer." },
            { n: "Anjali Deshmukh", r: "Bride · Kolhapur", q: "Got 3 verified decorators within minutes. No more chasing WhatsApp groups." },
            { n: "Riyaz Tailors", r: "Vendor · Sangli", q: "Pichle mahine 18 naye orders mile. Bina kisi commission ke. Bahut accha platform hai." },
          ].map((t) => (
            <div key={t.n} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-saffron text-saffron" />)}</div>
              <p className="mt-4 text-sm leading-relaxed">"{t.q}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-grad-accent grid place-items-center text-white font-semibold">{t.n[0]}</div>
                <div>
                  <div className="text-sm font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vendor growth CTA */}
      <section className="mx-auto max-w-7xl mt-24">
        <div className="rounded-3xl bg-grad-primary p-10 md:p-14 text-white relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">For local businesses</div>
              <h2 className="mt-3 text-4xl font-bold">Grow your seva, leave the marketing to AI.</h2>
              <p className="mt-4 opacity-90 max-w-lg">Get qualified, AI-routed leads on WhatsApp. No commissions on jobs. Just verified local demand, hand-delivered.</p>
            </div>
            <div className="flex md:justify-end gap-3">
              <Link to="/vendor-panel" className="px-5 py-3 rounded-xl bg-white text-primary font-medium hover:opacity-90 transition flex items-center gap-2">
                Open vendor panel <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#" className="px-5 py-3 rounded-xl glass text-white border border-white/30 flex items-center gap-2">
                <Phone className="h-4 w-4" /> Talk to team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl mt-24">
        <SectionHeader eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-8 space-y-3">
          {[
            { q: "Is Seva AI free for users?", a: "Yes. Posting tasks and connecting with vendors is completely free for users." },
            { q: "How do you verify vendors?", a: "We verify via Aadhaar, GST (where applicable), in-person visits in Ichalkaranji and community references." },
            { q: "Which languages does the AI support?", a: "Marathi, Hindi and English — including code-mixed Marathi-English speech." },
            { q: "Do I need to download an app?", a: "Not yet. The PWA works on any phone. Native apps coming Q1 2026." },
          ].map((f) => <FAQItem key={f.q} {...f} />)}
        </div>
      </section>
    </Layout>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{eyebrow}</div>
      <h2 className="mt-3 text-4xl md:text-5xl font-bold">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-medium mt-0.5">{value}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
