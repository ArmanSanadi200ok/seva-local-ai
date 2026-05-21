import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Star, Clock, CheckCircle2, MessageCircle, Phone, IndianRupee, Sparkles } from "lucide-react";

const SERVICES = [
  { emoji: "🧵", label: "Powerloom Repair", count: "320+ technicians", mar: "पॉवरलूम दुरुस्ती" },
  { emoji: "👔", label: "School Uniform Stitching", count: "180+ tailoring units", mar: "गणवेश शिलाई" },
  { emoji: "🍛", label: "Wedding Catering", count: "94 caterers", mar: "लग्न केटरिंग" },
  { emoji: "🔌", label: "Electrician (24×7)", count: "260+ electricians", mar: "इलेक्ट्रिशियन" },
  { emoji: "💧", label: "Water Tank Cleaning", count: "70+ teams", mar: "टाकी साफसफाई" },
  { emoji: "🪡", label: "Saree Fall & Pico", count: "410+ tailors", mar: "साडी फॉल पिको" },
  { emoji: "📦", label: "Bulk Tailoring Orders", count: "60+ units · GST", mar: "मोठ्या ऑर्डर" },
  { emoji: "🛠️", label: "Furniture Carpenter", count: "140+ pros", mar: "सुतार काम" },
  { emoji: "🚜", label: "Hyperlocal Logistics", count: "85+ tempos", mar: "टेम्पो भाडे" },
  { emoji: "🪔", label: "Pooja & Decor Setup", count: "55+ teams", mar: "पूजा सजावट" },
];

const WHATSAPP_THREAD = [
  { from: "user", text: "Powerloom belt तुटला आहे, urgent पाहिजे 🙏", time: "10:24" },
  { from: "ai", text: "समजलं! Kabnur मध्ये 3 verified technicians सापडले. पाठवू का?", time: "10:24" },
  { from: "user", text: "हो पाठवा", time: "10:25" },
  { from: "vendor", text: "नमस्कार, Patil Powerloom Service. 8 मिनिटात पोहोचतो. ₹800 charge.", time: "10:25" },
];

export function IndianEcosystem() {
  return (
    <section className="mx-auto max-w-7xl mt-28">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          🇮🇳 Built for Tier-2 & Tier-3 India
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          The <span className="text-grad-primary">real services</span> India runs on.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Not generic categories — the actual seva that powers homes, weddings, factories and shops across Maharashtra.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-5 gap-6">
        {/* Service grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-4 hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="text-3xl">{s.emoji}</div>
              <div className="mt-3 font-medium text-sm leading-tight">{s.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.mar}</div>
              <div className="mt-3 text-[11px] text-emerald flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> {s.count}
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp-style demo */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl p-1 shadow-soft" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
            <div className="rounded-[22px] overflow-hidden" style={{ background: "#0b141a" }}>
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#202c33" }}>
                <div className="h-9 w-9 rounded-full bg-grad-primary grid place-items-center text-white text-sm font-semibold">सं</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Seva AI</div>
                  <div className="text-[11px] text-emerald flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> typing in मराठी…
                  </div>
                </div>
                <Phone className="h-4 w-4 text-white/70" />
                <MessageCircle className="h-4 w-4 text-white/70" />
              </div>
              <div
                className="px-4 py-5 space-y-2.5 min-h-[360px]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                  background: "#0b141a",
                }}
              >
                {WHATSAPP_THREAD.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.25 }}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm shadow-soft ${
                        m.from === "user"
                          ? "rounded-2xl rounded-tr-sm text-white"
                          : m.from === "ai"
                          ? "rounded-2xl rounded-tl-sm text-white"
                          : "rounded-2xl rounded-tl-sm text-white"
                      }`}
                      style={{
                        background:
                          m.from === "user"
                            ? "#005c4b"
                            : m.from === "ai"
                            ? "linear-gradient(135deg, oklch(0.45 0.22 274), oklch(0.62 0.24 258))"
                            : "#202c33",
                      }}
                    >
                      {m.from === "vendor" && (
                        <div className="text-[10px] text-emerald mb-0.5 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified vendor
                        </div>
                      )}
                      <div>{m.text}</div>
                      <div className="text-[10px] opacity-70 text-right mt-0.5">{m.time} ✓✓</div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[#202c33] text-white/70 text-xs flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
              <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: "#202c33" }}>
                <div className="flex-1 px-3 py-2 rounded-full text-xs text-white/50" style={{ background: "#2a3942" }}>
                  Message
                </div>
                <div className="h-9 w-9 rounded-full grid place-items-center text-white" style={{ background: "#00a884" }}>
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-violet" /> Entire experience works inside WhatsApp — no app needed
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustGrid() {
  const items = [
    { icon: ShieldCheck, title: "Verified Local Vendors", desc: "Aadhaar, GST & in-person verification by our Ichalkaranji ground team.", k: "1,240+", l: "vendors verified" },
    { icon: Clock, title: "Lightning Response Time", desc: "Average match in 42 seconds. Urgent jobs accepted in under 3 minutes.", k: "42s", l: "avg match time" },
    { icon: MapPin, title: "AI-Powered Local Discovery", desc: "Hyperlocal ranking by distance, rating, language and category fit.", k: "4 cities", l: "live across MH" },
    { icon: Star, title: "Trusted by Real Businesses", desc: "Powerloom owners, caterers, tailors and shop owners use Seva daily.", k: "4.8★", l: "avg rating" },
    { icon: IndianRupee, title: "Zero Commission to Vendors", desc: "We don't take a cut from jobs. Vendors keep 100% of what they earn.", k: "0%", l: "commission" },
    { icon: CheckCircle2, title: "Fraud-Protected Matches", desc: "AI flags duplicate, spam and low-quality leads before they reach you.", k: "99.2%", l: "valid leads" },
  ];
  return (
    <section className="mx-auto max-w-7xl mt-28">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald" /> Trust, built into every layer
        </div>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          Why Ichalkaranji <span className="text-grad-primary">trusts Seva</span>.
        </h2>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-3xl p-6 relative overflow-hidden group hover:shadow-glow transition"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-grad-primary opacity-10 blur-2xl group-hover:opacity-30 transition" />
            <div className="flex items-start justify-between relative">
              <div className="h-11 w-11 rounded-xl bg-grad-primary grid place-items-center text-white shadow-glow">
                <it.icon className="h-5 w-5" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-grad-primary leading-none">{it.k}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{it.l}</div>
              </div>
            </div>
            <div className="mt-5 font-semibold">{it.title}</div>
            <div className="text-sm text-muted-foreground mt-1.5">{it.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
