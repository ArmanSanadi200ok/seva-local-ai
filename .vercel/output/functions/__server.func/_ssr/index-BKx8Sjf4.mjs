import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Layout } from "./Layout-DzbtQ8s6.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { b as ArrowRight, e as Building2, J as ShieldCheck, $ as Zap, L as Languages, v as MessageCircle, K as Sparkles, M as MapPin, w as Mic, D as Send, S as Scissors, Z as Wrench, X as UtensilsCrossed, U as Truck, H as Hammer, m as Cpu, i as CircleCheck, N as Star, P as Phone, Y as WandSparkles, t as LoaderCircle, T as Tag, l as Clock, p as IndianRupee, W as Users, g as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const EXAMPLES = [
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
        { name: "Shree Sai Sanitary", rating: 4.6, distance: "2.8 km", eta: "22 min", verified: true, tag: "24×7" }
      ]
    }
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
        { name: "New Powerloom Tailors", rating: 4.6, distance: "2.4 km", eta: "Within 2 hrs", verified: true, tag: "GST billing" }
      ]
    }
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
        { name: "Shree Caterers Kolhapur", rating: 4.7, distance: "5.6 km", eta: "Quote in 1 hr", verified: true, tag: "FSSAI" }
      ]
    }
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
        { name: "Sai Industrial Repairs", rating: 4.6, distance: "2.0 km", eta: "20 min", verified: true, tag: "Onsite" }
      ]
    }
  }
];
const STEPS = [
  "Transcribing speech & detecting language…",
  "Extracting intent, location & urgency…",
  "Matching nearby verified vendors…",
  "Ranking by rating, distance & response time…"
];
function LiveAIDemo() {
  const [idx, setIdx] = reactExports.useState(0);
  const [typed, setTyped] = reactExports.useState("");
  const [phase, setPhase] = reactExports.useState("typing");
  const [step, setStep] = reactExports.useState(0);
  const ex = reactExports.useMemo(() => EXAMPLES[idx], [idx]);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    if (phase !== "result") return;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % EXAMPLES.length);
      setPhase("typing");
    }, 6e3);
    return () => clearTimeout(t);
  }, [phase]);
  const runExample = (i) => {
    setIdx(i);
    setPhase("typing");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-28 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 -top-10 h-72 bg-grad-primary opacity-10 blur-3xl rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-3.5 w-3.5 text-violet" }),
        "Live AI Demo · No signup required"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-4xl md:text-5xl font-bold", children: [
        "Watch our AI ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "understand local India" }),
        " in real time."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "One sentence in Marathi, Hindi or English — instantly broken down into a structured task and matched with verified vendors nearby." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid lg:grid-cols-5 gap-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 shadow-soft relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-16 -right-16 h-44 w-44 rounded-full bg-grad-primary opacity-20 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "User says" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] px-2 py-0.5 rounded-full glass", children: "WhatsApp · Web · Voice" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl border border-border bg-background/60 p-4 min-h-[110px] relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base md:text-lg leading-relaxed", children: [
            typed,
            phase === "typing" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1.5 h-5 -mb-1 ml-0.5 bg-grad-primary animate-pulse" })
          ] }),
          phase !== "typing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald" }),
            " Sent · Auto-detected: ",
            ex.parsed.language
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 p-2 rounded-2xl border border-border bg-background/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-xs text-muted-foreground px-2", children: "Tap mic, or pick an example below…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-widest text-muted-foreground mb-2", children: "Try real examples" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: EXAMPLES.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => runExample(i),
              className: `text-xs px-3 py-1.5 rounded-full transition border ${i === idx ? "bg-grad-primary text-white border-transparent shadow-glow" : "glass border-border hover:bg-secondary"}`,
              children: e.parsed.category
            },
            i
          )) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 md:p-6 shadow-soft relative overflow-hidden min-h-[520px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-grad-accent opacity-20 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-grad-primary grid place-items-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Seva AI · Task Engine" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Hyperlocal · Multilingual · Realtime" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: phase === "processing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex items-center gap-1.5 text-xs text-violet",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                " Thinking…"
              ]
            },
            "p"
          ) : phase === "result" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex items-center gap-1.5 text-xs text-emerald",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                " Ready"
              ]
            },
            "r"
          ) : null })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: phase === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "mt-6 space-y-2.5",
            children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 p-3 rounded-xl border ${i <= step ? "border-violet/30 bg-violet/5" : "border-border bg-background/30"}`, children: [
              i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald shrink-0" }) : i === step ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 text-violet animate-spin shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full border border-border shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm ${i <= step ? "text-foreground" : "text-muted-foreground"}`, children: s })
            ] }, s))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: phase === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "mt-5 relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: Tag, label: "Category", value: ex.parsed.category, accent: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: Sparkles, label: "Sub-category", value: ex.parsed.subCategory }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: MapPin, label: "Location", value: ex.parsed.location }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: Clock, label: "Urgency", value: ex.parsed.urgency }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: IndianRupee, label: "Budget range", value: ex.parsed.budget }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ParsedField, { icon: Users, label: "Volume", value: ex.parsed.volume })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Top vendor matches" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-emerald flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
                    " ",
                    ex.parsed.vendors.length,
                    " live"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ex.parsed.vendors.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: i * 0.08 },
                    className: "flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/50 hover:shadow-glow hover:-translate-y-0.5 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-grad-accent grid place-items-center text-white font-semibold", children: v.name[0] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: v.name }),
                          v.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald shrink-0" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-saffron text-saffron" }),
                            " ",
                            v.rating
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "· ",
                            v.distance
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "· ETA ",
                            v.eta
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline px-1.5 py-0.5 rounded bg-secondary text-[10px]", children: v.tag })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-lg bg-emerald text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-8 w-8 rounded-lg bg-electric text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }) })
                      ] })
                    ]
                  },
                  v.name
                )) })
              ] })
            ]
          }
        ) })
      ] }) })
    ] })
  ] });
}
function ParsedField({ icon: Icon, label, value, accent = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: `rounded-2xl p-3 border ${accent ? "border-transparent bg-grad-primary text-white shadow-glow" : "border-border bg-background/50"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${accent ? "opacity-90" : "text-muted-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
          " ",
          label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mt-1 leading-tight", children: value })
      ]
    }
  );
}
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
  { emoji: "🪔", label: "Pooja & Decor Setup", count: "55+ teams", mar: "पूजा सजावट" }
];
const WHATSAPP_THREAD = [
  { from: "user", text: "Powerloom belt तुटला आहे, urgent पाहिजे 🙏", time: "10:24" },
  { from: "ai", text: "समजलं! Kabnur मध्ये 3 verified technicians सापडले. पाठवू का?", time: "10:24" },
  { from: "user", text: "हो पाठवा", time: "10:25" },
  { from: "vendor", text: "नमस्कार, Patil Powerloom Service. 8 मिनिटात पोहोचतो. ₹800 charge.", time: "10:25" }
];
function IndianEcosystem() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs", children: "🇮🇳 Built for Tier-2 & Tier-3 India" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-4xl md:text-5xl font-bold", children: [
        "The ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "real services" }),
        " India runs on."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Not generic categories — the actual seva that powers homes, weddings, factories and shops across Maharashtra." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid lg:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3", children: SERVICES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.04 },
          className: "glass rounded-2xl p-4 hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: s.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-medium text-sm leading-tight", children: s.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: s.mar }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[11px] text-emerald flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
              " ",
              s.count
            ] })
          ]
        },
        s.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl p-1 shadow-soft", style: { background: "linear-gradient(135deg, #25D366, #128C7E)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[22px] overflow-hidden", style: { background: "#0b141a" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", style: { background: "#202c33" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-grad-primary grid place-items-center text-white text-sm font-semibold", children: "सं" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-white", children: "Seva AI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-emerald flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald" }),
                " typing in मराठी…"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-white/70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-white/70" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-5 space-y-2.5 min-h-[360px]",
              style: {
                backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
                background: "#0b141a"
              },
              children: [
                WHATSAPP_THREAD.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: i * 0.25 },
                    className: `flex ${m.from === "user" ? "justify-end" : "justify-start"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `max-w-[80%] px-3 py-2 text-sm shadow-soft ${m.from === "user" ? "rounded-2xl rounded-tr-sm text-white" : m.from === "ai" ? "rounded-2xl rounded-tl-sm text-white" : "rounded-2xl rounded-tl-sm text-white"}`,
                        style: {
                          background: m.from === "user" ? "#005c4b" : m.from === "ai" ? "linear-gradient(135deg, oklch(0.45 0.22 274), oklch(0.62 0.24 258))" : "#202c33"
                        },
                        children: [
                          m.from === "vendor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-emerald mb-0.5 flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
                            " Verified vendor"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: m.text }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] opacity-70 text-right mt-0.5", children: [
                            m.time,
                            " ✓✓"
                          ] })
                        ]
                      }
                    )
                  },
                  i
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 rounded-2xl rounded-tl-sm bg-[#202c33] text-white/70 text-xs flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse", style: { animationDelay: "0.2s" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse", style: { animationDelay: "0.4s" } })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 flex items-center gap-2", style: { background: "#202c33" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 px-3 py-2 rounded-full text-xs text-white/50", style: { background: "#2a3942" }, children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full grid place-items-center text-white", style: { background: "#00a884" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-violet" }),
          " Entire experience works inside WhatsApp — no app needed"
        ] })
      ] })
    ] })
  ] });
}
function TrustGrid() {
  const items = [
    { icon: ShieldCheck, title: "Verified Local Vendors", desc: "Aadhaar, GST & in-person verification by our Ichalkaranji ground team.", k: "1,240+", l: "vendors verified" },
    { icon: Clock, title: "Lightning Response Time", desc: "Average match in 42 seconds. Urgent jobs accepted in under 3 minutes.", k: "42s", l: "avg match time" },
    { icon: MapPin, title: "AI-Powered Local Discovery", desc: "Hyperlocal ranking by distance, rating, language and category fit.", k: "4 cities", l: "live across MH" },
    { icon: Star, title: "Trusted by Real Businesses", desc: "Powerloom owners, caterers, tailors and shop owners use Seva daily.", k: "4.8★", l: "avg rating" },
    { icon: IndianRupee, title: "Zero Commission to Vendors", desc: "We don't take a cut from jobs. Vendors keep 100% of what they earn.", k: "0%", l: "commission" },
    { icon: CircleCheck, title: "Fraud-Protected Matches", desc: "AI flags duplicate, spam and low-quality leads before they reach you.", k: "99.2%", l: "valid leads" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald" }),
        " Trust, built into every layer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-4xl md:text-5xl font-bold", children: [
        "Why Ichalkaranji ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "trusts Seva" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: i * 0.05 },
        className: "glass rounded-3xl p-6 relative overflow-hidden group hover:shadow-glow transition",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-grad-primary opacity-10 blur-2xl group-hover:opacity-30 transition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-grad-primary grid place-items-center text-white shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(it.icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display font-bold text-grad-primary leading-none", children: it.k }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mt-1", children: it.l })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 font-semibold", children: it.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1.5", children: it.desc })
        ]
      },
      it.title
    )) })
  ] });
}
const API_BASE_URL = "http://127.0.0.1:8000/api";
async function createTask(taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
const taskExamples = [{
  hi: "Need a tailor for 200 school uniforms",
  cat: "Tailoring",
  urgency: "This week",
  count: "200 pcs"
}, {
  hi: "Urgent plumber near Kabnur",
  cat: "Plumbing",
  urgency: "Within 1 hr",
  count: "1 visit"
}, {
  hi: "Veg catering for 100 people tomorrow",
  cat: "Catering",
  urgency: "Tomorrow",
  count: "100 ppl"
}, {
  hi: "Powerloom machine repair required",
  cat: "Industrial",
  urgency: "Today",
  count: "Inspection"
}];
const categories = [{
  icon: Scissors,
  label: "Tailors"
}, {
  icon: Wrench,
  label: "Plumbers"
}, {
  icon: UtensilsCrossed,
  label: "Catering"
}, {
  icon: Truck,
  label: "Logistics"
}, {
  icon: Hammer,
  label: "Repairs"
}, {
  icon: Cpu,
  label: "Powerloom"
}];
function Landing() {
  const [active, setActive] = reactExports.useState(0);
  const [taskInput, setTaskInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const example = taskExamples[active];
  const handleSubmit = async () => {
    console.log("BUTTON CLICKED");
    if (!taskInput.trim()) return;
    try {
      setLoading(true);
      const response = await createTask({
        description: taskInput
      });
      console.log("AI Response:", response);
      setResult(response);
      setTaskInput("");
    } catch (error) {
      console.error(error);
      alert("Failed to process request");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-7xl pt-12 md:pt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            y: 10
          }, animate: {
            opacity: 1,
            y: 0
          }, transition: {
            duration: 0.5
          }, className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald animate-pulse" }),
            "Live in Ichalkaranji · Kolhapur · Sangli · Belgaum"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.h1, { initial: {
            opacity: 0,
            y: 20
          }, animate: {
            opacity: 1,
            y: 0
          }, transition: {
            duration: 0.6,
            delay: 0.05
          }, className: "mt-5 text-5xl md:text-7xl font-bold leading-[1.05]", children: [
            "AI-powered ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "local services" }),
            " for real India."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
            opacity: 0
          }, animate: {
            opacity: 1
          }, transition: {
            delay: 0.2
          }, className: "mt-6 text-lg text-muted-foreground max-w-xl", children: "Speak or type in हिंदी, मराठी or English. Our AI instantly understands your task and matches you with verified local vendors near you — in seconds." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-grad-primary text-white shadow-glow hover:opacity-90 transition", children: [
              "Try the AI Assistant ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/vendor-panel", className: "inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-secondary transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
              " List your business"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-6 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald" }),
              " Verified vendors"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-electric" }),
              " <60s match"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "h-4 w-4 text-violet" }),
              " 3 languages"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.95
        }, animate: {
          opacity: 1,
          scale: 1
        }, transition: {
          duration: 0.6,
          delay: 0.15
        }, className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-8 bg-grad-primary opacity-30 blur-3xl rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative glass rounded-3xl p-5 shadow-soft animate-float", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-grad-primary grid place-items-center text-white text-sm font-semibold", children: "सं" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Seva AI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-emerald flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald" }),
                  " Online · understands Marathi"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "ml-auto h-5 w-5 text-emerald" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto max-w-[85%] bg-grad-primary text-white text-sm rounded-2xl rounded-tr-md px-4 py-2.5 shadow-soft", children: example.hi }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[90%] glass rounded-2xl rounded-tl-md px-4 py-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-violet" }),
                  " AI understood your task"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", value: example.cat }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Urgency", value: example.urgency }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Volume", value: example.count })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " Ichalkaranji · 4 vendors matching"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: taskExamples.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(i), className: `h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-grad-primary" : "w-4 bg-border"}` }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 p-2 rounded-2xl border border-border bg-background/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: taskInput, onChange: (e) => setTaskInput(e.target.value), placeholder: "Type in हिंदी, मराठी or English…", className: "flex-1 bg-transparent text-sm outline-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSubmit, disabled: loading, className: "h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
            ] }),
            result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 glass rounded-2xl p-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-2", children: "AI Parsed Task" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs overflow-auto", children: JSON.stringify(result, null, 2) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -left-6 bottom-10 glass rounded-2xl px-3 py-2 text-xs shadow-soft hidden md:flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald" }),
            " 1,240+ verified vendors"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -right-4 top-10 glass rounded-2xl px-3 py-2 text-xs shadow-soft hidden md:flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-electric" }),
            " Avg match in 42s"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-16 grid grid-cols-2 md:grid-cols-4 gap-3", children: [{
        k: "1,240+",
        v: "Verified vendors"
      }, {
        k: "12,500+",
        v: "Tasks completed"
      }, {
        k: "4 cities",
        v: "Live across Maharashtra"
      }, {
        k: "4.8 ★",
        v: "Avg user rating"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display font-bold text-grad-primary", children: s.k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.v })
      ] }, s.v)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LiveAIDemo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IndianEcosystem, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustGrid, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "What people ask", title: "Every kind of seva, one assistant", sub: "From a single button to repair a powerloom, to catering for a wedding — Seva AI maps it instantly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-grad-accent grid place-items-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-medium", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "200+ vendors" })
      ] }, c.label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "How it works", title: "From thought to vendor in 60 seconds" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid md:grid-cols-3 gap-5", children: [{
        n: "01",
        icon: Mic,
        t: "Speak or type",
        d: "In Marathi, Hindi or English. Voice, photo or text — whichever feels natural."
      }, {
        n: "02",
        icon: Sparkles,
        t: "AI understands",
        d: "Our engine extracts category, urgency, location and volume into a structured task."
      }, {
        n: "03",
        icon: ShieldCheck,
        t: "Match & connect",
        d: "Top 3 verified local vendors respond. WhatsApp & call ready — no spam, no middlemen."
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -top-6 text-7xl font-display font-bold text-muted/40", children: s.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-grad-primary text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-semibold", children: s.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: s.d })
      ] }, s.n)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8 md:p-14 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 h-72 w-72 rounded-full bg-grad-primary opacity-25 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10 items-center relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Made for Real India" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-3 text-4xl font-bold", children: [
            "Talks like you do. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "मराठी, हिंदी, English." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-lg", children: "No forms. No categories to scroll. Just talk. Our multilingual AI engine, fine-tuned for Tier-2 & Tier-3 Indian speech patterns, gets you exactly the help you need." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: ["मला घरी प्लंबर हवा आहे", "200 uniforms चाहिए", "Wedding decorator near me", "powerloom belt बदलायचा"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1.5 rounded-full text-xs glass", children: p }, p)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-28 w-28 rounded-full bg-grad-primary grid place-items-center text-white shadow-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-10 w-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full animate-pulse-ring" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: "Tap to speak · we transcribe & extract intent in real time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-3 gap-2", children: ["Intent", "Location", "Time"].map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-xl bg-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mx-auto text-emerald" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] mt-1", children: x })
          ] }, x)) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "From the ground", title: "Loved by locals, trusted by businesses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid md:grid-cols-3 gap-5", children: [{
        n: "Suresh Patil",
        r: "Powerloom Owner · Ichalkaranji",
        q: "Belt तुटला रात्री 10 ला — Seva ने 20 मिनिटात technician पाठवला. Game changer."
      }, {
        n: "Anjali Deshmukh",
        r: "Bride · Kolhapur",
        q: "Got 3 verified decorators within minutes. No more chasing WhatsApp groups."
      }, {
        n: "Riyaz Tailors",
        r: "Vendor · Sangli",
        q: "Pichle mahine 18 naye orders mile. Bina kisi commission ke. Bahut accha platform hai."
      }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-saffron text-saffron" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm leading-relaxed", children: [
          '"',
          t.q,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-grad-accent grid place-items-center text-white font-semibold", children: t.n[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: t.n }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.r })
          ] })
        ] })
      ] }, t.n)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl mt-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-grad-primary p-10 md:p-14 text-white relative overflow-hidden shadow-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-bg opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid md:grid-cols-2 gap-8 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest opacity-80", children: "For local businesses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-4xl font-bold", children: "Grow your seva, leave the marketing to AI." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 opacity-90 max-w-lg", children: "Get qualified, AI-routed leads on WhatsApp. No commissions on jobs. Just verified local demand, hand-delivered." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex md:justify-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/vendor-panel", className: "px-5 py-3 rounded-xl bg-white text-primary font-medium hover:opacity-90 transition flex items-center gap-2", children: [
            "Open vendor panel ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "px-5 py-3 rounded-xl glass text-white border border-white/30 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
            " Talk to team"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "FAQ", title: "Questions, answered" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 space-y-3", children: [{
        q: "Is Seva AI free for users?",
        a: "Yes. Posting tasks and connecting with vendors is completely free for users."
      }, {
        q: "How do you verify vendors?",
        a: "We verify via Aadhaar, GST (where applicable), in-person visits in Ichalkaranji and community references."
      }, {
        q: "Which languages does the AI support?",
        a: "Marathi, Hindi and English — including code-mixed Marathi-English speech."
      }, {
        q: "Do I need to download an app?",
        a: "Not yet. The PWA works on any phone. Native apps coming Q1 2026."
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FAQItem, { ...f }, f.q)) })
    ] })
  ] });
}
function SectionHeader({
  eyebrow,
  title,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-4xl md:text-5xl font-bold", children: title }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: sub })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-secondary px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium mt-0.5", children: value })
  ] });
}
function FAQItem({
  q,
  a
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(!open), className: "w-full flex items-center justify-between p-5 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: q }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-5 w-5 transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-5 text-sm text-muted-foreground", children: a })
  ] });
}
export {
  Landing as component
};
