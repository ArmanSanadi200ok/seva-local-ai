import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getAccessToken, L as Layout, b as getMe, l as login, a as apiFetch } from "./Layout-DzbtQ8s6.mjs";
import { Q as QUICK_MESSAGES } from "./sevaData-Blak9Nmo.mjs";
import { A as Activity, n as Hourglass, s as ListChecks, k as CircleX, z as Search, B as Bell, K as Sparkles, w as Mic, I as Image, t as LoaderCircle, D as Send, v as MessageCircle, $ as Zap, h as ChevronRight, M as MapPin, l as Clock, P as Phone, i as CircleCheck, J as ShieldCheck, R as Radio, o as Inbox } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
const getTasks = async () => {
  const data = await apiFetch("/api/tasks/");
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};
const createTask = async (task) => {
  return apiFetch("/api/tasks/", {
    method: "POST",
    body: JSON.stringify(task)
  });
};
const normalizeLocation = (loc) => {
  if (!loc) return "Ichalkaranji";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    return String(loc.area || loc.city || loc.address || loc.name || "Ichalkaranji");
  }
  return String(loc);
};
const inferBetterCategoryFromText = (text, currentCategory, currentService) => {
  const t2 = (text || "").toLowerCase();
  if (t2.includes("plumb") || t2.includes("leak") || t2.includes("tap") || t2.includes("pipe") || t2.includes("drain") || t2.includes("bathroom")) {
    return { category: "Plumbing", service: "Plumbing / Leak repair" };
  }
  if (t2.includes("cater") || t2.includes("food") || t2.includes("tiffin") || t2.includes("lunch") || t2.includes("dinner") || t2.includes("veg")) {
    return { category: "Catering", service: "Catering / Food Services" };
  }
  if (t2.includes("tailor") || t2.includes("stitch") || t2.includes("uniform") || t2.includes("blouse") || t2.includes("alteration")) {
    return { category: "Tailoring", service: "Tailoring / Uniforms" };
  }
  if (t2.includes("machine") || t2.includes("powerloom") || t2.includes("motor") || t2.includes("industrial") || t2.includes("belt") || t2.includes("repair")) {
    return { category: "Industrial Repair", service: "Machine Repair" };
  }
  if (t2.includes("decor") || t2.includes("wedding") || t2.includes("stage")) {
    return { category: "Decor", service: "Decoration Services" };
  }
  if (currentCategory && currentCategory !== "General Seva" && currentCategory !== "General") {
    return { category: currentCategory, service: currentService || currentCategory };
  }
  return { category: "General Seva", service: "Service" };
};
const normalizeConfidence = (conf) => {
  const num = Number(conf);
  if (isNaN(num)) return 90;
  if (num > 0 && num <= 1) return Math.round(num * 100);
  return Math.round(num);
};
const mapTaskDetailToParsed = (task) => {
  const s = task?.structured_output || {};
  const rawInput = task?.raw_user_input || "";
  const inferred = inferBetterCategoryFromText(
    rawInput,
    s.category || task?.category_name,
    s.service_type || s.subcategory || task?.category_name
  );
  return {
    category: inferred.category,
    service_type: inferred.service,
    location: normalizeLocation(s.location || task?.location),
    urgency_level: s.urgency_level || task?.urgency || "medium",
    budget_range: s.budget_range || s.budget || "Not specified",
    estimated_time: s.estimated_time || s.eta || "Not specified",
    language: s.language || task?.locale || "English",
    confidence: normalizeConfidence(s.confidence ?? task?.ai_confidence ?? 90)
  };
};
const mapBackendTaskToSevaRequest = (t2) => {
  let mappedStatus = "active";
  if (t2.status === "pending_parse") mappedStatus = "pending";
  else if (t2.status === "completed") mappedStatus = "completed";
  else if (t2.status === "cancelled") mappedStatus = "cancelled";
  return {
    id: String(t2.id),
    title: t2.title || t2.raw_user_input || "Untitled",
    category: t2.category_name ?? "General Seva",
    status: mappedStatus,
    createdAt: t2.created_at ? new Date(t2.created_at).toLocaleDateString() : "just now",
    area: normalizeLocation(t2.location),
    matchedVendors: 0,
    urgency: t2.urgency || "medium"
  };
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const getTaskMatches = async (taskId) => {
  const fetchMatches = async () => {
    try {
      const data = await apiFetch(`/api/matching/tasks/${taskId}/matches/`);
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.matches)) return data.matches;
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch (err) {
      console.error("Match fetch error:", err);
      return [];
    }
  };
  let matches = await fetchMatches();
  if (matches.length > 0) return matches;
  await delay(1200);
  matches = await fetchMatches();
  if (matches.length > 0) return matches;
  await delay(1500);
  matches = await fetchMatches();
  return matches;
};
const getTaskMatchesWithRetry = async (taskId) => {
  return getTaskMatches(taskId);
};
const mapBackendMatchToVendor = (match) => {
  const v = match?.vendor || {};
  const phone = v.whatsapp_number || v.phone_number || "";
  return {
    id: String(v.id || match?.id || Date.now()),
    name: v.business_name || v.owner_name || "Unknown Vendor",
    category: v.category_name || "General",
    experience: "Verified",
    rating: Number(v.rating) || 4.5,
    reviews: 0,
    responseMin: 15,
    distanceKm: 2.5,
    available: v.availability_status === "available",
    verified: v.verification_status === "verified",
    trustScore: Number(match?.ai_score) || 80,
    matchScore: Math.round(Number(match?.total_score)) || match?.score || 0,
    tags: v.subcategory ? [v.subcategory] : [],
    area: v.area || v.city || "Ichalkaranji",
    completedJobs: 0,
    whatsapp: phone,
    phone
  };
};
class EventBus {
  events = [];
  listeners = /* @__PURE__ */ new Set();
  max = 40;
  emit(e) {
    const evt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: e.ts ?? Date.now(),
      ...e
    };
    this.events = [evt, ...this.events].slice(0, this.max);
    this.listeners.forEach((l) => l(this.events));
  }
  list() {
    return this.events;
  }
  subscribe(l) {
    this.listeners.add(l);
    l(this.events);
    return () => this.listeners.delete(l);
  }
}
const systemBus = new EventBus();
const seed = [
  { kind: "request.received", title: "New request · Plumber", detail: "Kabnur · urgent", area: "Kabnur", level: "info", latencyMs: 142 },
  { kind: "ai.parsed", title: "AI parsed task", detail: "confidence 94%", level: "success", latencyMs: 380 },
  { kind: "vendor.matched", title: "3 vendors matched", detail: "best score 96%", level: "success" },
  { kind: "whatsapp.sent", title: "WhatsApp inquiry sent", detail: "Annapurna Catering", level: "info" },
  { kind: "vendor.responded", title: "Vendor responded", detail: "Rajesh Plumbing · 4 min", level: "success" },
  { kind: "verification.passed", title: "Vendor verified", detail: "Aadhaar + GST", level: "success" }
];
let t = Date.now() - 6e4;
seed.forEach((s) => {
  t += 9e3;
  systemBus.emit({ ...s, ts: t });
});
if (typeof window !== "undefined") {
  const heartbeats = [
    () => systemBus.emit({ kind: "system.health", title: "Match engine OK", detail: `p95 ${Math.floor(180 + Math.random() * 90)}ms`, level: "info" }),
    () => systemBus.emit({ kind: "vendor.responded", title: "Vendor responded", detail: `${["Riyaz Tailors", "Powerloom Care", "Mauli Tiffin"][Math.floor(Math.random() * 3)]} · ${Math.floor(2 + Math.random() * 8)} min`, level: "success" }),
    () => systemBus.emit({ kind: "request.received", title: "New request · " + ["Tailoring", "Decor", "Tiffin", "Plumbing"][Math.floor(Math.random() * 4)], detail: ["Shahupuri", "MIDC", "Rajwada", "Main Road"][Math.floor(Math.random() * 4)], level: "info" })
  ];
  setInterval(() => heartbeats[Math.floor(Math.random() * heartbeats.length)](), 11e3);
}
const ICONS = {
  "request.received": Inbox,
  "ai.parsed": Sparkles,
  "vendor.matched": Zap,
  "vendor.responded": CircleCheck,
  "whatsapp.sent": MessageCircle,
  "quote.received": Activity,
  "verification.passed": ShieldCheck,
  "system.health": Radio
};
function ago(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1e3));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}
function LiveActivityFeed({
  compact = false
}) {
  const [events, setEvents] = reactExports.useState(
    () => systemBus.list()
  );
  const [, force] = reactExports.useState(0);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  reactExports.useEffect(() => {
    const unsub = systemBus.subscribe(setEvents);
    return () => {
      unsub();
    };
  }, []);
  reactExports.useEffect(() => {
    const i = setInterval(() => {
      force((n) => n + 1);
    }, 15e3);
    return () => clearInterval(i);
  }, []);
  const list = compact ? events.slice(0, 6) : events.slice(0, 12);
  if (!mounted) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-7 w-7 rounded-lg bg-grad-primary grid place-items-center text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold leading-none", children: "Live system feed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 uppercase tracking-widest", children: "seva.ws · realtime" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-1 rounded-full bg-emerald/15 text-emerald font-medium flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
        events.length,
        " events"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative max-h-[420px] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: list.map((e) => {
      const I = ICONS[e.kind];
      const tone = e.level === "success" ? "text-emerald bg-emerald/10" : e.level === "warn" ? "text-saffron bg-saffron/10" : "text-electric bg-electric/10";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          layout: true,
          initial: { opacity: 0, y: -8, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, height: 0 },
          transition: { duration: 0.25 },
          className: "flex items-start gap-3 py-2 border-b border-border/60 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-8 w-8 shrink-0 rounded-lg grid place-items-center ${tone}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: e.title }),
              e.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: e.detail })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground whitespace-nowrap pt-1 flex flex-col items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ago(e.ts) }),
              e.latencyMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald font-mono", children: [
                e.latencyMs,
                "ms"
              ] })
            ] })
          ]
        },
        e.id
      );
    }) }) })
  ] });
}
const STAGE_COPY = {
  understanding: "Understanding your request…",
  structuring: "AI structuring task into fields…",
  searching: "Searching nearby verified vendors…",
  ranking: "Ranking by match score, distance & trust…"
};
const suggestions = ["Plumber for leaking tap — Kabnur, urgent", "Veg catering for 100 people tomorrow", "Powerloom belt replacement at MIDC", "Tailor for 200 school uniforms"];
function Dashboard() {
  const [text, setText] = reactExports.useState("");
  const [stage, setStage] = reactExports.useState("idle");
  const [parsed, setParsed] = reactExports.useState(null);
  const [matches, setMatches] = reactExports.useState([]);
  const [requests, setRequests] = reactExports.useState([]);
  const [authError, setAuthError] = reactExports.useState("");
  const [needsLogin, setNeedsLogin] = reactExports.useState(false);
  const [profile, setProfile] = reactExports.useState(null);
  const [loginPhone, setLoginPhone] = reactExports.useState("");
  const [loginPassword, setLoginPassword] = reactExports.useState("");
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  const loadDashboardData = async () => {
    try {
      const [profData, tasksData] = await Promise.all([getMe(), getTasks()]);
      setProfile(profData);
      setRequests(tasksData.map(mapBackendTaskToSevaRequest));
      setNeedsLogin(false);
      setAuthError("");
    } catch (err) {
      if (err.message.includes("Unauthorized")) {
        setNeedsLogin(true);
      } else {
        setAuthError(err.message);
      }
    }
  };
  reactExports.useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setNeedsLogin(true);
      return;
    }
    loadDashboardData();
  }, []);
  const handleLogin = async () => {
    if (!loginPhone || !loginPassword) return;
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const data = await login(loginPhone, loginPassword);
      localStorage.setItem("seva_access_token", data.access);
      await loadDashboardData();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };
  const submit = async () => {
    if (!text.trim() || stage !== "idle" && stage !== "done") return;
    setParsed(null);
    setMatches([]);
    setAuthError("");
    setStage("understanding");
    systemBus.emit({
      kind: "request.received",
      title: "New request received",
      detail: text.slice(0, 60),
      level: "info"
    });
    try {
      setStage("structuring");
      const created = await createTask({
        raw_user_input: text
      });
      const p = mapTaskDetailToParsed(created);
      setParsed(p);
      systemBus.emit({
        kind: "ai.parsed",
        title: "AI parsed task",
        detail: `${p.category} · ${p.location} · ${p.confidence}%`,
        level: "success"
      });
      setStage("searching");
      setStage("ranking");
      let m = [];
      try {
        const matchesData = await getTaskMatchesWithRetry(created.id);
        if (Array.isArray(matchesData) && matchesData.length > 0) {
          m = matchesData.map(mapBackendMatchToVendor);
        }
      } catch (err) {
        console.error("Match fetch failed:", err);
      }
      setMatches(m.slice(0, 3));
      setStage("done");
      if (m.length > 0) {
        systemBus.emit({
          kind: "vendor.matched",
          title: `${m.length} vendors matched`,
          detail: `top ${m[0]?.name} · ${m[0]?.matchScore}%`,
          level: "success"
        });
        systemBus.emit({
          kind: "whatsapp.sent",
          title: "WhatsApp inquiry sent",
          detail: `to ${m.slice(0, 3).map((v) => v.name.split(" ")[0]).join(", ")}`,
          level: "info"
        });
      }
      setRequests((rs) => [mapBackendTaskToSevaRequest(created), ...rs]);
    } catch (err) {
      setAuthError(err?.message || "Failed to process task. Please try again.");
      setStage("idle");
    }
  };
  const stats = reactExports.useMemo(() => {
    const count = (s) => requests.filter((r) => r.status === s).length;
    return [{
      l: "Active",
      v: count("active"),
      i: Activity,
      color: "text-electric",
      bg: "bg-electric/15"
    }, {
      l: "Pending Match",
      v: count("pending"),
      i: Hourglass,
      color: "text-violet",
      bg: "bg-violet/15"
    }, {
      l: "Completed",
      v: count("completed"),
      i: ListChecks,
      color: "text-emerald",
      bg: "bg-emerald/15"
    }, {
      l: "Cancelled",
      v: count("cancelled"),
      i: CircleX,
      color: "text-muted-foreground",
      bg: "bg-muted"
    }];
  }, [requests]);
  const processing = stage !== "idle" && stage !== "done";
  const displayName = profile?.name || "Customer";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs tracking-widest text-muted-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald animate-pulse" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "uppercase", children: "Live" }),
          " · नमस्कार, ",
          displayName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl font-bold", children: "What seva do you need today?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "glass h-10 w-10 grid place-items-center rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "glass h-10 w-10 grid place-items-center rounded-xl relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-10 px-3 rounded-xl bg-grad-primary text-white flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-white/20 grid place-items-center text-xs font-bold", children: displayName[0].toUpperCase() }),
          " ",
          displayName
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-3", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-xl ${s.bg} grid place-items-center ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.i, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold leading-none", children: s.v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-1", children: s.l })
      ] })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
        needsLogin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg mb-2", children: "Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Please log in to view and create tasks." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Phone Number (+91...)", className: "bg-background/60 border border-border rounded-xl px-4 py-2 text-sm flex-1", value: loginPhone, onChange: (e) => setLoginPhone(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", placeholder: "Password", className: "bg-background/60 border border-border rounded-xl px-4 py-2 text-sm flex-1", value: loginPassword, onChange: (e) => setLoginPassword(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleLogin, disabled: isLoggingIn, className: "bg-grad-primary text-white rounded-xl px-6 py-2 text-sm font-medium shadow-glow disabled:opacity-50 min-w-[120px]", children: isLoggingIn ? "Wait..." : "Login" })
          ] })
        ] }),
        authError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20", children: authError }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-16 -right-16 h-48 w-48 rounded-full bg-grad-primary opacity-20 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-violet" }),
              " Seva AI Engine · v2.1"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-emerald", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
              " online"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start gap-3 p-3 rounded-2xl border border-border bg-background/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-10 w-10 shrink-0 rounded-xl bg-grad-primary grid place-items-center text-white animate-pulse-ring", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), rows: 2, placeholder: "e.g. Need urgent plumber near Kabnur for leaking tap…", className: "flex-1 bg-transparent outline-none text-sm resize-none pt-2", disabled: processing }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-lg glass grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: processing || !text.trim(), className: "h-9 w-9 rounded-lg bg-foreground text-background grid place-items-center disabled:opacity-40", children: processing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setText(s), disabled: processing, className: "text-xs px-3 py-1.5 rounded-full glass hover:bg-secondary transition disabled:opacity-40", children: s }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: processing && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            height: 0
          }, animate: {
            opacity: 1,
            height: "auto"
          }, exit: {
            opacity: 0,
            height: 0
          }, className: "mt-5 glass rounded-2xl p-4 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineStep, { active: true, stage, step: "understanding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineStep, { active: ["structuring", "searching", "ranking"].includes(stage), stage, step: "structuring" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineStep, { active: ["searching", "ranking"].includes(stage), stage, step: "searching" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineStep, { active: stage === "ranking", stage, step: "ranking", last: true })
          ] }) }),
          parsed && stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            y: 12
          }, animate: {
            opacity: 1,
            y: 0
          }, className: "mt-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-violet" }),
                    " Structured task"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-emerald/15 text-emerald font-medium", children: [
                    parsed.confidence,
                    "% confidence"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", v: parsed.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Service", v: parsed.service_type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", v: parsed.location }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Urgency", v: parsed.urgency_level, tone: parsed.urgency_level === "high" ? "danger" : "info" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Budget", v: parsed.budget_range }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "ETA", v: parsed.estimated_time })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl p-5 bg-primary/10 text-primary-foreground text-sm flex flex-col justify-center gap-2 border border-primary/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 text-[10px] uppercase tracking-widest text-primary/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3" }),
                  " AI Summary"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "I understood your request for ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: parsed.service_type }),
                  " near ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: parsed.location }),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Estimated urgency: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: parsed.urgency_level }),
                  ". ",
                  matches.length > 0 ? "I've found matching local vendors for you below." : "Looking for matching local vendors..."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-saffron" }),
                  matches.length > 0 ? `${matches.length} vendors matched · avg response ${Math.round(matches.reduce((a, b) => a + (b.responseMin || 15), 0) / matches.length)} min` : "Vendor Matches"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/vendors?query=${encodeURIComponent(parsed?.service_type || "")}&category=${encodeURIComponent(parsed?.category || "")}`, className: "text-xs px-3 py-1.5 rounded-lg bg-grad-primary text-white flex items-center gap-1", children: [
                  "View all vendors ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
                ] })
              ] }),
              matches.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-3", children: matches.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchedVendor, { v, best: i === 0 }, v.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-xl border border-border bg-background/40 text-center text-sm text-muted-foreground", children: "No verified vendors matched yet. Try broadening the request or view all vendors." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Your requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
              " Live sync"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: requests.slice(0, 6).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, initial: {
            opacity: 0,
            x: -10
          }, animate: {
            opacity: 1,
            x: 0
          }, transition: {
            delay: i * 0.04
          }, className: "p-3 rounded-2xl border border-border bg-background/40 flex items-center gap-3 hover:shadow-soft transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-xl ${statusBg(r.status)} grid place-items-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: `h-4 w-4 ${statusFg(r.status)}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate text-sm", children: r.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                  " ",
                  r.area
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  r.createdAt
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status }),
              r.inquiryStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground mt-1 capitalize", children: [
                r.matchedVendors,
                " vendors · ",
                r.inquiryStatus
              ] })
            ] })
          ] }, r.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveActivityFeed, { compact: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Customer Profile" }),
          profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: displayName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }) }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.area })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Please login to view your profile." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-grad-primary grid place-items-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Seva AI Assistant" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Always here, in your language" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: ["Track my plumbing request", "Find cheapest catering", "Reschedule yesterday's task"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-secondary transition flex items-center justify-between", children: [
            s,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          ] }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Trust score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-bold text-grad-primary", children: "94" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground pb-1.5", children: "verified profile" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
            width: 0
          }, animate: {
            width: "94%"
          }, transition: {
            duration: 1.2
          }, className: "h-full bg-grad-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2 text-xs", children: [["Aadhaar verified", true], ["Phone verified", true], ["Address verified", false]].map(([l, ok]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: `h-4 w-4 ${ok ? "text-emerald" : "text-muted-foreground"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: ok ? "" : "text-muted-foreground", children: l })
          ] }, l)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "WhatsApp quick replies" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: QUICK_MESSAGES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-left text-xs px-3 py-2 rounded-lg bg-emerald/10 hover:bg-emerald/20 text-emerald-foreground transition flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: m }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3 text-emerald shrink-0 ml-2" })
          ] }, m)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl p-6 bg-grad-primary text-white shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: "Verified Local Vendors only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-90 mt-1", children: "Every vendor on Seva is verified in-person across Ichalkaranji & nearby cities." })
        ] })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  v,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-semibold mt-0.5 capitalize ${tone === "danger" ? "text-destructive" : ""}`, children: v })
  ] });
}
function PipelineStep({
  active,
  stage,
  step,
  last
}) {
  const done = stageOrder(stage) > stageOrder(step);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 ${last ? "" : "pb-2"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-full grid place-items-center text-[10px] ${done ? "bg-emerald text-white" : active ? "bg-grad-primary text-white" : "bg-secondary text-muted-foreground"}`, children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : active ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : "•" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs ${done || active ? "" : "text-muted-foreground"}`, children: STAGE_COPY[step] })
  ] });
}
function stageOrder(s) {
  return ["idle", "understanding", "structuring", "searching", "ranking", "done"].indexOf(s);
}
function MatchedVendor({
  v,
  best
}) {
  const handleContact = () => {
    if (v.whatsapp) {
      window.open(`https://wa.me/${v.whatsapp}`, "_blank");
    } else if (v.phone) {
      window.open(`tel:${v.phone}`);
    }
  };
  const contactIcon = v.whatsapp ? /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }) : v.phone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }) : null;
  const contactDisabled = !v.whatsapp && !v.phone;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl p-3 border ${best ? "border-violet/40 bg-violet/5" : "border-border bg-background/40"}`, children: [
    best && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2 left-3 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-grad-primary text-white shadow-glow", children: "Best match" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-grad-accent text-white grid place-items-center text-sm font-bold", children: v.name[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: v.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          v.distanceKm,
          " km · ",
          v.responseMin,
          " min"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald/15 text-emerald", children: [
        v.matchScore,
        "% match"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleContact, disabled: contactDisabled, className: `h-7 w-7 rounded-lg grid place-items-center ${contactDisabled ? "bg-secondary text-muted-foreground" : "bg-emerald text-white"}`, children: contactIcon || /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }) })
    ] })
  ] });
}
function StatusPill({
  status
}) {
  const map = {
    active: "bg-electric/15 text-electric",
    pending: "bg-violet/15 text-violet",
    completed: "bg-emerald/15 text-emerald",
    cancelled: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-2 py-1 rounded-full capitalize font-medium ${map[status]}`, children: status });
}
function statusBg(s) {
  return s === "active" ? "bg-electric/15" : s === "pending" ? "bg-violet/15" : s === "completed" ? "bg-emerald/15" : "bg-muted";
}
function statusFg(s) {
  return s === "active" ? "text-electric" : s === "pending" ? "text-violet" : s === "completed" ? "text-emerald" : "text-muted-foreground";
}
export {
  Dashboard as component
};
