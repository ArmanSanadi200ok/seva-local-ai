import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Layout } from "./Layout-DzbtQ8s6.mjs";
import { p as parseTaskAI, m as matchVendors, Q as QUICK_MESSAGES } from "./sevaData-Blak9Nmo.mjs";
import { K as Sparkles, z as Search, F as Funnel, a as ArrowDownUp, t as LoaderCircle, i as CircleCheck, J as ShieldCheck, N as Star, $ as Zap, l as Clock, M as MapPin, v as MessageCircle, P as Phone } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
const FILTERS = ["All", "Catering", "Plumbing", "Tailoring", "Industrial Repair", "Decor"];
const SORT_LABEL = {
  match: "AI Match",
  distance: "Nearest",
  rating: "Top rated",
  response: "Fastest"
};
function Vendors() {
  const [query, setQuery] = reactExports.useState("Veg catering 100 ppl");
  const [filter, setFilter] = reactExports.useState("All");
  const [sort, setSort] = reactExports.useState("match");
  const [loading, setLoading] = reactExports.useState(true);
  const [vendors, setVendors] = reactExports.useState([]);
  const [contactId, setContactId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const parsed = parseTaskAI(query);
      setVendors(matchVendors(parsed));
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, [query]);
  const visible = reactExports.useMemo(() => {
    let arr = vendors;
    if (filter !== "All") arr = arr.filter((v) => v.category === filter);
    const sorted = [...arr].sort((a, b) => {
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "response") return a.responseMin - b.responseMin;
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    });
    return sorted;
  }, [vendors, filter, sort]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl pt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-violet" }),
            ' AI Matched for · "',
            query,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl font-bold", children: "Verified vendors near you" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex items-center gap-2 px-3 h-11 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Describe what you need…", className: "bg-transparent outline-none text-sm w-52" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "glass h-11 px-4 rounded-xl flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }),
            " Filters"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: `px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${filter === f ? "bg-grad-primary text-white shadow-glow" : "glass hover:bg-secondary"}`, children: f }, f)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl flex items-center px-2 py-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "h-3.5 w-3.5 mx-2 text-muted-foreground" }),
          Object.keys(SORT_LABEL).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSort(k), className: `px-3 py-1.5 rounded-lg transition ${sort === k ? "bg-foreground text-background" : "hover:bg-secondary"}`, children: SORT_LABEL[k] }, k))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-xs text-muted-foreground flex items-center gap-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
        " Searching nearby verified vendors…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald" }),
        " ",
        visible.length,
        " vendors found · ranked by ",
        SORT_LABEL[sort]
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: loading ? Array.from({
        length: 6
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VendorSkeleton, {}, i)) : visible.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VendorCard, { v, best: sort === "match" && i === 0, onContact: () => setContactId(v.id) }, v.id)) })
    ] }),
    contactId && /* @__PURE__ */ jsxRuntimeExports.jsx(ContactSheet, { vendor: vendors.find((v) => v.id === contactId), onClose: () => setContactId(null) })
  ] });
}
function VendorCard({
  v,
  best,
  onContact
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: {
    opacity: 0,
    y: 8
  }, animate: {
    opacity: 1,
    y: 0
  }, className: `relative glass rounded-3xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all ${best ? "ring-2 ring-violet/40" : ""}`, children: [
    best && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -top-2.5 left-5 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-grad-primary text-white shadow-glow flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
      " AI Best Match"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-grad-primary grid place-items-center text-white text-lg font-bold", children: v.name[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: v.name }),
          v.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          v.category,
          " · ",
          v.experience,
          " · ",
          v.completedJobs,
          " jobs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 fill-saffron text-saffron" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: v.rating }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "(",
            v.reviews,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${v.available ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${v.available ? "bg-emerald animate-pulse" : "bg-muted-foreground"}` }),
        v.available ? "Available" : "Busy"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Match", value: `${v.matchScore ?? 0}%`, accent: "violet", icon: Zap }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Trust", value: `${v.trustScore}`, accent: "emerald", icon: ShieldCheck }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Responds", value: `${v.responseMin}m`, accent: "electric", icon: Clock })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      width: 0
    }, animate: {
      width: `${v.matchScore ?? 0}%`
    }, transition: {
      duration: 0.8
    }, className: "h-full bg-grad-primary" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: v.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-1 rounded-full bg-secondary", children: t }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center justify-between text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
      " ",
      v.distanceKm,
      " km · ",
      v.area
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onContact, className: "h-10 rounded-xl bg-emerald text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
        " WhatsApp"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "h-10 rounded-xl bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
        " Call"
      ] })
    ] })
  ] });
}
function Metric({
  label,
  value,
  accent,
  icon: Icon
}) {
  const cls = {
    violet: "text-violet bg-violet/10",
    emerald: "text-emerald bg-emerald/10",
    electric: "text-electric bg-electric/10"
  }[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl ${cls} px-2 py-2`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3 mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold mt-0.5", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider opacity-70", children: label })
  ] });
}
function VendorSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-secondary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 bg-secondary rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 bg-secondary rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/3 bg-secondary rounded" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 bg-secondary rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 bg-secondary rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 bg-secondary rounded-xl" })
    ] })
  ] });
}
function ContactSheet({
  vendor,
  onClose
}) {
  const [sent, setSent] = reactExports.useState(null);
  const send = (m) => {
    setSent(m);
    setTimeout(onClose, 1100);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-end md:place-items-center", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    y: 60,
    opacity: 0
  }, animate: {
    y: 0,
    opacity: 1
  }, onClick: (e) => e.stopPropagation(), className: "w-full md:max-w-md glass rounded-t-3xl md:rounded-3xl p-6 m-0 md:m-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-grad-primary text-white grid place-items-center font-bold", children: vendor.name[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold flex items-center gap-1.5", children: [
          vendor.name,
          " ",
          vendor.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          vendor.whatsapp,
          " · responds in ",
          vendor.responseMin,
          "m"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-xs uppercase tracking-widest text-muted-foreground", children: "Send a quick message" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-col gap-2", children: QUICK_MESSAGES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => send(m), className: "text-left text-sm px-4 py-3 rounded-xl bg-emerald/10 hover:bg-emerald/20 text-foreground transition flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-emerald" })
    ] }, m)) }),
    sent && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "mt-4 p-3 rounded-xl bg-emerald/15 text-emerald text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
      " Sent via WhatsApp · inquiry tracked"
    ] })
  ] }) });
}
export {
  Vendors as component
};
