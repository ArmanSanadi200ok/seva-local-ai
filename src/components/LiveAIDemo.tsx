import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Clock, IndianRupee, Tag, Users, CheckCircle2, Wand2, Send, Mic, Loader2, ShieldCheck, Star, Phone, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Parsed = {
  category: string;
  subCategory: string;
  location: string;
  urgency: string;
  budget: string;
  volume: string;
  language: string;
  vendors: { name: string; rating: number; distance: string; eta: string; verified: boolean; tag: string }[];
};

const EXAMPLES: { input: string; parsed: Parsed }[] = [
  {
    input: "Need urgent plumber near Kabnur",
    parsed: {
      category: "Plumbing",
      subCategory: "Emergency leak fix",
      location: "Kabnur, Ichalkaranji",
      urgency: "Within 60 minutes",
      budget: "₹ 300 – ₹ 800",
      volume: "1 site visit",
      language: "English",
      vendors: [
        { name: "Sanjay Pipes & Fittings", rating: 4.9, distance: "1.2 km", eta: "12 min", verified: true, tag: "Top rated" },
        { name: "Ramesh Plumbing Works", rating: 4.7, distance: "2.1 km", eta: "18 min", verified: true, tag: "Fast response" },
        { name: "Shree Sai Sanitary", rating: 4.6, distance: "2.8 km", eta: "22 min", verified: true, tag: "24×7" },
      ],
    },
  },
  {
    input: "200 school uniforms शिलाई करायचे आहेत next week",
    parsed: {
      category: "Tailoring",
      subCategory: "Bulk school uniforms",
      location: "Ichalkaranji MIDC",
      urgency: "Within 7 days",
      budget: "₹ 24,000 – ₹ 32,000",
      volume: "200 pieces",
      language: "Marathi + English",
      vendors: [
        { name: "Riyaz Tailors (Bulk)", rating: 4.8, distance: "0.9 km", eta: "Same day quote", verified: true, tag: "Bulk specialist" },
        { name: "Maa Stitching Unit", rating: 4.7, distance: "1.6 km", eta: "Same day quote", verified: true, tag: "Schools partner" },
        { name: "New Powerloom Tailors", rating: 4.6, distance: "2.4 km", eta: "Within 2 hrs", verified: true, tag: "GST billing" },
      ],
    },
  },
  {
    input: "शादी के लिए 500 लोगों का veg catering चाहिए",
    parsed: {
      category: "Catering",
      subCategory: "Wedding · Veg thali",
      location: "Shahupuri, Kolhapur",
      urgency: "Event in 12 days",
      budget: "₹ 1.4L – ₹ 2.2L",
      volume: "500 guests",
      language: "Hindi",
      vendors: [
        { name: "Annapurna Catering", rating: 4.9, distance: "3.1 km", eta: "Quote in 30 min", verified: true, tag: "Wedding pro" },
        { name: "Mauli Bhojnalay", rating: 4.8, distance: "4.2 km", eta: "Quote in 1 hr", verified: true, tag: "Trusted 8 yrs" },
        { name: "Shree Caterers Kolhapur", rating: 4.7, distance: "5.6 km", eta: "Quote in 1 hr", verified: true, tag: "FSSAI" },
      ],
    },
  },
  {
    input: "Powerloom belt तुटला, urgent technician पाहिजे",
    parsed: {
      category: "Industrial Repair",
      subCategory: "Powerloom belt replacement",
      location: "Jawahar Nagar, Ichalkaranji",
      urgency: "Within 30 minutes",
      budget: "₹ 800 – ₹ 1,500",
      volume: "1 machine",
      language: "Marathi",
      vendors: [
        { name: "Patil Powerloom Service", rating: 4.9, distance: "0.6 km", eta: "8 min", verified: true, tag: "Loom expert" },
        { name: "Kolhapur Loom Care", rating: 4.8, distance: "1.4 km", eta: "14 min", verified: true, tag: "24×7" },
        { name: "Sai Industrial Repairs", rating: 4.6, distance: "2.0 km", eta: "20 min", verified: true, tag: "Onsite" },
      ],
    },
  },
];

const STEPS = [
  "Transcribing speech & detecting language…",
  "Extracting intent, location & urgency…",
  "Matching nearby verified vendors…",
  "Ranking by rating, distance & response time…",
];

export function LiveAIDemo() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "processing" | "result">("typing");
  const [step, setStep] = useState(0);

  const ex = useMemo(() => EXAMPLES[idx], [idx]);

  // Typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(ex.input.slice(0, i));
      if (i >= ex.input.length) {
        clearInterval(t);
        setTimeout(() => setPhase("processing"), 500);
      }
    }, 35);
    return () => clearInterval(t);
  }, [phase, ex.input]);

  // Processing steps
  useEffect(() => {
    if (phase !== "processing") return;
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          clearInterval(t);
          setTimeout(() => setPhase("result"), 400);
          return s;
        }
        return s + 1;
      });
    }, 550);
    return () => clearInterval(t);
  }, [phase]);

  // Auto cycle
  useEffect(() => {
    if (phase !== "result") return;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % EXAMPLES.length);
      setPhase("typing");
    }, 6000);
    return () => clearTimeout(t);
  }, [phase]);

  const runExample = (i: number) => {
    setIdx(i);
    setPhase("typing");
  };

  return (
    <section className="mx-auto max-w-7xl mt-28 relative">
      <div className="absolute inset-x-0 -top-10 h-72 bg-grad-primary opacity-10 blur-3xl rounded-full pointer-events-none" />
      <div className="text-center max-w-2xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <Wand2 className="h-3.5 w-3.5 text-violet" />
          Live AI Demo · No signup required
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          Watch our AI <span className="text-grad-primary">understand local India</span> in real time.
        </h2>
        <p className="mt-3 text-muted-foreground">
          One sentence in Marathi, Hindi or English — instantly broken down into a structured task and matched with verified vendors nearby.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-5 gap-6 relative">
        {/* INPUT */}
        <div className="lg:col-span-2">
          <div className="glass rounded-3xl p-5 shadow-soft relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-grad-primary opacity-20 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">User says</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full glass">WhatsApp · Web · Voice</div>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4 min-h-[110px] relative">
              <div className="text-base md:text-lg leading-relaxed">
                {typed}
                {phase === "typing" && <span className="inline-block w-1.5 h-5 -mb-1 ml-0.5 bg-grad-primary animate-pulse" />}
              </div>
              {phase !== "typing" && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-emerald" /> Sent · Auto-detected: {ex.parsed.language}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 p-2 rounded-2xl border border-border bg-background/40">
              <button className="h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring">
                <Mic className="h-4 w-4" />
              </button>
              <div className="flex-1 text-xs text-muted-foreground px-2">Tap mic, or pick an example below…</div>
              <button className="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center"><Send className="h-4 w-4" /></button>
            </div>

            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Try real examples</div>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => runExample(i)}
                    className={`text-xs px-3 py-1.5 rounded-full transition border ${
                      i === idx ? "bg-grad-primary text-white border-transparent shadow-glow" : "glass border-border hover:bg-secondary"
                    }`}
                  >
                    {e.parsed.category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI OUTPUT */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-5 md:p-6 shadow-soft relative overflow-hidden min-h-[520px]">
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-grad-accent opacity-20 blur-3xl" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-grad-primary grid place-items-center shadow-glow">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Seva AI · Task Engine</div>
                  <div className="text-[11px] text-muted-foreground">Hyperlocal · Multilingual · Realtime</div>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {phase === "processing" ? (
                  <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-violet">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                  </motion.div>
                ) : phase === "result" ? (
                  <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs text-emerald">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Processing pipeline */}
            <AnimatePresence>
              {phase === "processing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-6 space-y-2.5"
                >
                  {STEPS.map((s, i) => (
                    <div key={s} className={`flex items-center gap-3 p-3 rounded-xl border ${i <= step ? "border-violet/30 bg-violet/5" : "border-border bg-background/30"}`}>
                      {i < step ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                      ) : i === step ? (
                        <Loader2 className="h-4 w-4 text-violet animate-spin shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                      )}
                      <span className={`text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {phase === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-5 relative"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    <ParsedField icon={Tag} label="Category" value={ex.parsed.category} accent />
                    <ParsedField icon={Sparkles} label="Sub-category" value={ex.parsed.subCategory} />
                    <ParsedField icon={MapPin} label="Location" value={ex.parsed.location} />
                    <ParsedField icon={Clock} label="Urgency" value={ex.parsed.urgency} />
                    <ParsedField icon={IndianRupee} label="Budget range" value={ex.parsed.budget} />
                    <ParsedField icon={Users} label="Volume" value={ex.parsed.volume} />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Top vendor matches</div>
                      <div className="text-[11px] text-emerald flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> {ex.parsed.vendors.length} live
                      </div>
                    </div>
                    <div className="space-y-2">
                      {ex.parsed.vendors.map((v, i) => (
                        <motion.div
                          key={v.name}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/50 hover:shadow-glow hover:-translate-y-0.5 transition-all"
                        >
                          <div className="h-10 w-10 rounded-xl bg-grad-accent grid place-items-center text-white font-semibold">
                            {v.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <div className="text-sm font-medium truncate">{v.name}</div>
                              {v.verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald shrink-0" />}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-saffron text-saffron" /> {v.rating}</span>
                              <span>· {v.distance}</span>
                              <span>· ETA {v.eta}</span>
                              <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-secondary text-[10px]">{v.tag}</span>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button className="h-8 w-8 rounded-lg bg-emerald text-white grid place-items-center"><MessageCircle className="h-3.5 w-3.5" /></button>
                            <button className="h-8 w-8 rounded-lg bg-electric text-white grid place-items-center"><Phone className="h-3.5 w-3.5" /></button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParsedField({ icon: Icon, label, value, accent = false }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-3 border ${accent ? "border-transparent bg-grad-primary text-white shadow-glow" : "border-border bg-background/50"}`}
    >
      <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${accent ? "opacity-90" : "text-muted-foreground"}`}>
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm font-semibold mt-1 leading-tight">{value}</div>
    </motion.div>
  );
}
