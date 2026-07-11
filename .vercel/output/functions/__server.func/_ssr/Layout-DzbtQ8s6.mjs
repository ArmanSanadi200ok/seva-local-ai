import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { K as Sparkles, _ as X, u as Menu, q as Instagram, V as Twitter, v as MessageCircle, G as Github, r as Linkedin, A as Activity } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
const login = async (phone_number, password) => {
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone_number, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    if (errorData && errorData.non_field_errors) {
      throw new Error(errorData.non_field_errors[0] || "Invalid credentials.");
    }
    throw new Error(`Login failed: ${res.statusText}`);
  }
  return res.json();
};
const getAccessToken = () => localStorage.getItem("seva_access_token");
const clearAccessToken = () => localStorage.removeItem("seva_access_token");
const API_BASE = "http://127.0.0.1:8000";
const getAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};
const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });
  if (!res.ok) {
    if (res.status === 401) {
      clearAccessToken();
      throw new Error("Unauthorized: Please login.");
    }
    let msg = `API error: ${res.statusText}`;
    try {
      const errData = await res.json();
      msg = errData.detail || errData.message || errData.non_field_errors?.[0] || msg;
    } catch (e) {
    }
    throw new Error(msg);
  }
  return res.json();
};
const mapMeToProfile = (data) => {
  let finalName = "";
  if (data?.full_name) finalName = data.full_name;
  else {
    const first = (data?.first_name || "").trim();
    const last = (data?.last_name || "").trim();
    const constructed = [first, last].filter(Boolean).join(" ");
    if (constructed) finalName = constructed;
    else if (data?.name) finalName = data.name;
    else if (data?.phone_number) finalName = `Customer ${data.phone_number.slice(-4)}`;
    else if (data?.phone) finalName = `Customer ${data.phone.slice(-4)}`;
    else finalName = "Customer";
  }
  return {
    name: finalName,
    phone: data?.phone_number || data?.phone || "",
    role: data?.role || "customer",
    area: data?.area || data?.city || "Ichalkaranji",
    is_superuser: data?.is_superuser || false,
    is_staff: data?.is_staff || false
  };
};
const getMe = async () => {
  const data = await apiFetch("/api/users/me/");
  return mapMeToProfile(data);
};
function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = reactExports.useState(false);
  const [profile, setProfile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (getAccessToken()) {
      getMe().then(setProfile).catch(() => {
      });
    }
  }, [path]);
  const isAdmin = profile?.role === "admin" || profile?.is_superuser || profile?.is_staff;
  const isVendor = profile?.role === "vendor";
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    !isVendor || isAdmin ? { to: "/vendors", label: "Vendors" } : null,
    { to: "/vendor-panel", label: "For Vendors" },
    isAdmin ? { to: "/admin", label: "Admin" } : null
  ].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl glass rounded-2xl shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-9 w-9 rounded-xl bg-grad-primary grid place-items-center shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-xl animate-pulse-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base", children: "Ichalkaranji Seva" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground tracking-wider uppercase", children: "AI Hyperlocal Concierge" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-1", children: links.map((l) => {
        const active = path.startsWith(l.to) && (l.to !== "/" || path === "/");
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            className: `px-3 py-1.5 rounded-lg text-sm transition ${active ? "bg-grad-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
            children: l.label
          },
          l.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition", children: "EN · हिं · मराठी" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "text-sm px-4 py-2 rounded-lg bg-grad-primary text-white shadow-glow hover:opacity-90 transition", children: "Open App" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md:hidden p-2", onClick: () => setOpen(!open), "aria-label": "Menu", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden border-t border-border px-3 py-3 flex flex-col gap-1", children: [
      links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.to, onClick: () => setOpen(false), className: "px-3 py-2 rounded-lg hover:bg-secondary text-sm", children: l.label }, l.to)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", onClick: () => setOpen(false), className: "mt-2 text-sm text-center px-4 py-2 rounded-lg bg-grad-primary text-white", children: "Open App" })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "mt-24 px-4 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl glass rounded-3xl p-8 md:p-12 shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-grad-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-lg", children: "Ichalkaranji Seva" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground max-w-md", children: "AI-powered hyperlocal concierge built for real India. From Ichalkaranji to Kolhapur — find verified local services in seconds." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex gap-2", children: [Instagram, Twitter, MessageCircle].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-secondary transition", href: "#", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-3", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Dashboard" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vendors", children: "Vendor Directory" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vendor-panel", children: "Become a Vendor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: "Admin" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-3", children: "Cities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ichalkaranji" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Kolhapur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Sangli" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Belgaum" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-full glass px-5 py-2.5 border border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-widest text-muted-foreground font-medium", children: "Built by" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Arman Sanadi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 h-3 w-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://github.com/armansanadi200ok",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "grid place-items-center h-7 w-7 rounded-full hover:bg-secondary transition-colors",
          "aria-label": "GitHub",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://www.linkedin.com/in/armansanadi",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "grid place-items-center h-7 w-7 rounded-full hover:bg-secondary transition-colors",
          "aria-label": "LinkedIn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "© 2026 Ichalkaranji Seva · Made for Real India 🇮🇳" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Verified Local Vendors · Built in Maharashtra" })
    ] })
  ] }) });
}
function WhatsAppFloat() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.a,
    {
      href: "https://wa.me/919999999999",
      target: "_blank",
      rel: "noopener noreferrer",
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { delay: 1, type: "spring", stiffness: 200 },
      className: "fixed bottom-5 right-5 z-50 group",
      "aria-label": "Chat on WhatsApp",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-emerald animate-pulse-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "relative flex items-center gap-2 h-14 pl-4 pr-5 rounded-full text-white shadow-glow",
            style: { background: "linear-gradient(135deg, #25D366, #128C7E)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-sm font-medium", children: "Chat on WhatsApp" })
            ]
          }
        )
      ]
    }
  );
}
function SystemStatusBar() {
  const [p95, setP95] = reactExports.useState(186);
  const [reqs, setReqs] = reactExports.useState(1247);
  reactExports.useEffect(() => {
    const i = setInterval(() => {
      setP95(160 + Math.floor(Math.random() * 80));
      setReqs((r) => r + Math.floor(1 + Math.random() * 4));
    }, 4e3);
    return () => clearInterval(i);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex fixed bottom-4 left-4 z-30 items-center gap-3 glass rounded-full pl-2 pr-4 py-1.5 text-[11px] font-mono shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/15 text-emerald", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" }),
      " all systems"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
      "match.p95 ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
        p95,
        "ms"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
      "req/24h ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: reqs.toLocaleString("en-IN") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3 text-electric" })
  ] });
}
function Layout({ children, bare = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-x-clip", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 bg-hero" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "px-4", children }),
    !bare && /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppFloat, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SystemStatusBar, {})
  ] });
}
export {
  Layout as L,
  apiFetch as a,
  getMe as b,
  getAccessToken as g,
  login as l
};
