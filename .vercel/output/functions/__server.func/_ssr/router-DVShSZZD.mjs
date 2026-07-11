import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
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
function SplashScreen({ children }) {
  const [phase, setPhase] = reactExports.useState("enter");
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase("settled"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);
  if (phase === "done") return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  const isExit = phase === "exit";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "aria-hidden": isExit,
        className: `fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden splash-bg ${isExit ? "splash-exit" : "splash-enter"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[50vmin] w-[50vmin] rounded-full bg-primary/10 blur-3xl" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-5 px-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-14 w-14 items-center justify-center rounded-2xl bg-grad-primary shadow-glow splash-mark ${isExit ? "mark-out" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    width: "28",
                    height: "28",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2.2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "text-white",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2L2 7l10 5 10-5-10-5z" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 17l10 5 10-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 12l10 5 10-5" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex flex-col items-center gap-1.5 text-center splash-text ${isExit ? "text-out" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[1.65rem] font-bold tracking-tight md:text-3xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-grad-primary", children: "Ichalkaranji" }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Seva" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-[16rem] text-xs font-medium leading-relaxed text-muted-foreground md:max-w-none md:text-sm", children: "AI-powered local services for real India" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `mt-1 flex items-center gap-2 splash-loader ${isExit ? "loader-out" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:0ms]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:150ms]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:300ms]" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    children
  ] });
}
const appCss = "/assets/styles-C8A0oJGD.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#4f46e5" },
      { title: "Ichalkaranji Seva — AI Hyperlocal Concierge" },
      { name: "description", content: "AI-powered local services for Tier-2 & Tier-3 India." },
      { property: "og:title", content: "Ichalkaranji Seva — AI Hyperlocal Concierge" },
      { property: "og:description", content: "AI-powered local services for Tier-2 & Tier-3 India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ichalkaranji Seva — AI Hyperlocal Concierge" },
      { name: "twitter:description", content: "AI-powered local services for Tier-2 & Tier-3 India." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e19c5dfd-896e-4dd9-9223-839ee636e4a4" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/e19c5dfd-896e-4dd9-9223-839ee636e4a4" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$5.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplashScreen, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$4 = () => import("./vendors-Dfb2bu7P.mjs");
const Route$4 = createFileRoute("/vendors")({
  head: () => ({
    meta: [{
      title: "Verified Vendors — Ichalkaranji Seva"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./vendor-panel-D9cRNUeq.mjs");
const Route$3 = createFileRoute("/vendor-panel")({
  head: () => ({
    meta: [{
      title: "Vendor Panel — Ichalkaranji Seva"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard-cY10QDQh.mjs");
const Route$2 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Ichalkaranji Seva"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin-Cd9Yig-R.mjs");
const Route$1 = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BKx8Sjf4.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Ichalkaranji Seva — AI Hyperlocal Concierge for Real India"
    }, {
      name: "description",
      content: "AI-powered local services for Tier-2 & Tier-3 India. Find verified tailors, plumbers, caterers, and more in Ichalkaranji, Kolhapur, Sangli and Belgaum."
    }, {
      property: "og:title",
      content: "Ichalkaranji Seva — AI Hyperlocal Concierge"
    }, {
      property: "og:description",
      content: "Speak. Type. Get matched. AI that truly understands local India."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VendorsRoute = Route$4.update({
  id: "/vendors",
  path: "/vendors",
  getParentRoute: () => Route$5
});
const VendorPanelRoute = Route$3.update({
  id: "/vendor-panel",
  path: "/vendor-panel",
  getParentRoute: () => Route$5
});
const DashboardRoute = Route$2.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$5
});
const AdminRoute = Route$1.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$5
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  DashboardRoute,
  VendorPanelRoute,
  VendorsRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
