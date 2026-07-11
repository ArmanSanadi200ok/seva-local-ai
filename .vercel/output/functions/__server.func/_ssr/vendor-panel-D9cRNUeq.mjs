import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout } from "./Layout-DzbtQ8s6.mjs";
import { Q as ToggleRight, p as IndianRupee, o as Inbox, O as Target, N as Star, l as Clock, t as LoaderCircle, K as Sparkles, v as MessageCircle, P as Phone, C as ChartColumn, i as CircleCheck, _ as X } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const INITIAL_LEADS = [{
  id: "l1",
  title: "Catering · 100 ppl · tomorrow",
  area: "Shahupuri",
  time: "2m ago",
  urgent: true,
  customer: "Rohan P.",
  budget: "₹ 12,000 – ₹ 22,000",
  status: "new",
  matchScore: 96
}, {
  id: "l2",
  title: "Tiffin · 30 boxes · office",
  area: "MIDC",
  time: "10m ago",
  urgent: false,
  customer: "Anjali D.",
  budget: "₹ 3,600 – ₹ 5,400",
  status: "viewed",
  matchScore: 88
}, {
  id: "l3",
  title: "Wedding catering · 500 ppl",
  area: "Kabnur",
  time: "1h ago",
  urgent: false,
  customer: "Mr. Patil",
  budget: "₹ 60,000 – ₹ 1,10,000",
  status: "replied",
  matchScore: 92
}, {
  id: "l4",
  title: "Birthday party catering · 40 ppl",
  area: "Rajwada",
  time: "3h ago",
  urgent: false,
  customer: "Sneha K.",
  budget: "₹ 4,800 – ₹ 8,800",
  status: "quoted",
  matchScore: 81
}];
const STATUS_STYLE = {
  new: "bg-violet/15 text-violet",
  viewed: "bg-electric/15 text-electric",
  replied: "bg-cyan/15 text-cyan",
  quoted: "bg-saffron/20 text-saffron",
  won: "bg-emerald/15 text-emerald",
  lost: "bg-muted text-muted-foreground"
};
function VendorPanel() {
  const [online, setOnline] = reactExports.useState(true);
  const [leads, setLeads] = reactExports.useState(INITIAL_LEADS);
  const [openLead, setOpenLead] = reactExports.useState(null);
  const [incoming, setIncoming] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!online) return;
    const t = setInterval(() => {
      setIncoming(true);
      setTimeout(() => {
        setLeads((ls) => [{
          id: `l${Date.now()}`,
          title: "Plumber · leaking tap · Kabnur",
          area: "Kabnur",
          time: "just now",
          urgent: true,
          customer: "New customer",
          budget: "₹ 200 – ₹ 1,500",
          status: "new",
          matchScore: 94
        }, ...ls]);
        setIncoming(false);
      }, 1400);
    }, 14e3);
    return () => clearInterval(t);
  }, [online]);
  const updateStatus = (id, status) => {
    setLeads((ls) => ls.map((l) => l.id === id ? {
      ...l,
      status
    } : l));
  };
  const conversion = Math.round(leads.filter((l) => l.status === "won").length / Math.max(leads.length, 1) * 100) || 38;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Annapurna Catering · Vendor CRM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl font-bold", children: "Good morning, Sunita ji 🙏" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOnline(!online), className: `flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition ${online ? "bg-emerald text-white shadow-glow" : "glass"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${online ? "bg-white animate-pulse" : "bg-muted-foreground"}` }),
          online ? "Accepting leads" : "Offline",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 md:grid-cols-5 gap-4", children: [{
        l: "This month earnings",
        v: "₹ 84,200",
        i: IndianRupee,
        up: "+22%"
      }, {
        l: "New leads",
        v: String(leads.filter((l) => l.status === "new").length + 43),
        i: Inbox,
        up: "+18%"
      }, {
        l: "Conversion rate",
        v: `${conversion}%`,
        i: Target,
        up: "+4%"
      }, {
        l: "Avg rating",
        v: "4.9",
        i: Star,
        up: "+0.1"
      }, {
        l: "Response time",
        v: "5 min",
        i: Clock,
        up: "-1m"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.i, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-emerald/20 text-emerald", children: s.up })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-2xl font-bold", children: s.v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.l })
      ] }, s.l)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Lead Inbox" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "AI-matched & sorted by score" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
              incoming && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-violet", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
                " incoming lead…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
                " Live"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: {
            opacity: 0,
            y: -10,
            scale: 0.98
          }, animate: {
            opacity: 1,
            y: 0,
            scale: 1
          }, exit: {
            opacity: 0,
            x: -20
          }, className: "p-4 rounded-2xl border border-border bg-background/40 flex flex-wrap items-center gap-4 hover:shadow-soft transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-grad-accent grid place-items-center text-white shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: l.title }),
                l.urgent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-medium", children: "URGENT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-violet/15 text-violet font-medium", children: [
                  l.matchScore,
                  "% match"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "📍 ",
                l.area,
                " · ",
                l.customer,
                " · ",
                l.budget,
                " · ",
                l.time
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-1 rounded-full capitalize font-medium ${STATUS_STYLE[l.status]}`, children: l.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpenLead(l), className: "h-9 w-9 rounded-lg bg-emerald text-white grid place-items-center", title: "WhatsApp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-lg bg-electric text-white grid place-items-center", title: "Call", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateStatus(l.id, "won"), className: "px-3 h-9 rounded-lg bg-grad-primary text-white text-xs", children: "Accept" })
            ] })
          ] }, l.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Conversion funnel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-muted-foreground" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: [{
              l: "Leads received",
              n: 47,
              w: 100,
              c: "bg-grad-primary"
            }, {
              l: "Replied",
              n: 38,
              w: 80,
              c: "bg-electric"
            }, {
              l: "Quoted",
              n: 24,
              w: 51,
              c: "bg-saffron"
            }, {
              l: "Won",
              n: 18,
              w: 38,
              c: "bg-emerald"
            }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.l }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: s.n })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
                width: 0
              }, animate: {
                width: `${s.w}%`
              }, transition: {
                duration: 0.8
              }, className: `h-full ${s.c}` }) })
            ] }, s.l)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Recent reviews" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children: [{
              n: "Rohan P.",
              r: 5,
              q: "Excellent food, on-time delivery."
            }, {
              n: "Anjali D.",
              r: 5,
              q: "Saved my wedding! Highly recommend."
            }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.n }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: [...Array(r.r)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-saffron text-saffron" }, i)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                '"',
                r.q,
                '"'
              ] })
            ] }, r.n)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-grad-primary p-6 text-white shadow-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: "Verified Vendor Badge" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-90 mt-1", children: "Your profile is verified. You appear in top AI matches." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: openLead && /* @__PURE__ */ jsxRuntimeExports.jsx(LeadDrawer, { lead: openLead, onClose: () => setOpenLead(null), onStatus: (s) => {
      updateStatus(openLead.id, s);
      setOpenLead(null);
    } }) })
  ] });
}
function LeadDrawer({
  lead,
  onClose,
  onStatus
}) {
  const [typing, setTyping] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([{
    from: "ai",
    t: `New AI-matched lead: ${lead.title}. Customer: ${lead.customer}. Budget ${lead.budget}.`
  }]);
  const send = (m) => {
    setMessages((ms) => [...ms, {
      from: "vendor",
      t: m
    }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((ms) => [...ms, {
        from: "ai",
        t: "Sent via WhatsApp ✓ · Customer notified"
      }]);
      setTyping(false);
    }, 900);
  };
  const replies = ["नमस्कार! आम्ही उपलब्ध आहोत.", "किती लोकांसाठी? Veg / Non-veg?", "Quote 30 min मध्ये पाठवतो", "Site visit करायचा का?"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-end md:place-items-center", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    y: 80,
    opacity: 0
  }, animate: {
    y: 0,
    opacity: 1
  }, exit: {
    y: 60,
    opacity: 0
  }, onClick: (e) => e.stopPropagation(), className: "w-full md:max-w-lg glass rounded-t-3xl md:rounded-3xl p-6 m-0 md:m-4 max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: lead.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          lead.customer,
          " · ",
          lead.area,
          " · ",
          lead.budget
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "h-8 w-8 rounded-lg glass grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex-1 overflow-y-auto space-y-2 bg-secondary/40 rounded-2xl p-3", children: [
      messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `max-w-[85%] text-sm px-3 py-2 rounded-xl ${m.from === "vendor" ? "ml-auto bg-emerald text-white" : "bg-card border border-border"}`, children: m.t }, i)),
      typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 0.15 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 0.3 })
        ] }),
        " typing…"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-violet" }),
      " AI smart replies (Marathi)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: replies.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(r), className: "text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-grad-primary hover:text-white transition", children: r }, r)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onStatus("quoted"), className: "h-10 rounded-xl bg-saffron text-white text-sm font-medium", children: "Send Quote" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onStatus("won"), className: "h-10 rounded-xl bg-emerald text-white text-sm font-medium", children: "Mark Won" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onStatus("lost"), className: "h-10 rounded-xl glass text-sm", children: "Decline" })
    ] })
  ] }) });
}
function Dot({
  delay = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground", animate: {
    opacity: [0.2, 1, 0.2]
  }, transition: {
    duration: 1,
    repeat: Infinity,
    delay
  } });
}
export {
  VendorPanel as component
};
