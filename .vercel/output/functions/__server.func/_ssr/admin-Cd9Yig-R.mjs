import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { L as Layout, g as getAccessToken, b as getMe, a as apiFetch } from "./Layout-DzbtQ8s6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as ShieldAlert, z as Search, F as Funnel, d as Building, M as MapPin, P as Phone, _ as X, f as Check, x as PowerOff, j as CirclePlay, c as Briefcase, y as RefreshCw, h as ChevronRight, J as ShieldCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function RequireAdmin({ children }) {
  const navigate = useNavigate();
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!getAccessToken()) {
      navigate({ to: "/dashboard" });
      return;
    }
    getMe().then((p) => {
      const isActuallyAdmin2 = p.role === "admin" || p.is_superuser || p.is_staff;
      if (!isActuallyAdmin2) navigate({ to: "/dashboard" });
      else setProfile(p);
    }).catch(() => navigate({ to: "/dashboard" })).finally(() => setLoading(false));
  }, [navigate]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center gap-4 text-sm text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 animate-pulse text-primary" }),
    "Verifying admin access..."
  ] });
  if (!profile) return null;
  const isActuallyAdmin = profile.role === "admin" || profile.is_superuser || profile.is_staff;
  if (!isActuallyAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
const getVendorsAdmin = async (filters = {}) => {
  const q = new URLSearchParams(filters).toString();
  return apiFetch(`/api/vendors/admin/?${q}`);
};
const approveVendor = async (id) => apiFetch(`/api/vendors/admin/${id}/approve/`, { method: "POST" });
const rejectVendor = async (id) => apiFetch(`/api/vendors/admin/${id}/reject/`, { method: "POST" });
const suspendVendor = async (id) => apiFetch(`/api/vendors/admin/${id}/suspend/`, { method: "POST" });
const reactivateVendor = async (id) => apiFetch(`/api/vendors/admin/${id}/reactivate/`, { method: "POST" });
const setVendorAvailability = async (id, status) => apiFetch(`/api/vendors/admin/${id}/set_availability/`, { method: "POST", body: JSON.stringify({ status }) });
const getTasksAdmin = async (filters = {}) => {
  const q = new URLSearchParams(filters).toString();
  return apiFetch(`/api/tasks/admin/?${q}`);
};
const getTaskDetailAdmin = async (id) => apiFetch(`/api/tasks/admin/${id}/`);
const rerunTaskMatching = async (id) => apiFetch(`/api/tasks/admin/${id}/rerun_matching/`, { method: "POST" });
const setTaskStatus = async (id, status) => apiFetch(`/api/tasks/admin/${id}/set_status/`, { method: "PATCH", body: JSON.stringify({ status }) });
function AdminDashboard() {
  const [tab, setTab] = reactExports.useState("vendors");
  const [vendors, setVendors] = reactExports.useState([]);
  const [tasks, setTasks] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [vendorFilter, setVendorFilter] = reactExports.useState("all");
  const [taskFilter, setTaskFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const [hasNext, setHasNext] = reactExports.useState(false);
  const [hasPrev, setHasPrev] = reactExports.useState(false);
  const [selectedTask, setSelectedTask] = reactExports.useState(null);
  const [taskDetailLoading, setTaskDetailLoading] = reactExports.useState(false);
  const fetchVendors = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNumber
      };
      if (vendorFilter === "pending") params.verification_status = "pending";
      if (vendorFilter === "verified") params.verification_status = "verified";
      if (vendorFilter === "rejected") params.verification_status = "rejected";
      if (vendorFilter === "suspended") params.is_active = "False";
      if (searchQuery) params.search = searchQuery;
      const data = await getVendorsAdmin(params);
      if (Array.isArray(data)) {
        setVendors(data);
        setHasNext(false);
        setHasPrev(false);
      } else {
        setVendors(data?.results || []);
        setHasNext(!!data?.next);
        setHasPrev(!!data?.previous);
      }
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };
  const fetchTasks = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNumber
      };
      if (taskFilter !== "all") params.status = taskFilter;
      if (searchQuery) params.search = searchQuery;
      const data = await getTasksAdmin(params);
      if (Array.isArray(data)) {
        setTasks(data);
        setHasNext(false);
        setHasPrev(false);
      } else {
        setTasks(data?.results || []);
        setHasNext(!!data?.next);
        setHasPrev(!!data?.previous);
      }
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    setPage(1);
  }, [tab, vendorFilter, taskFilter, searchQuery]);
  reactExports.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tab === "vendors") fetchVendors(page);
      if (tab === "tasks") fetchTasks(page);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [tab, vendorFilter, taskFilter, searchQuery, page]);
  const handleApprove = async (id) => {
    try {
      await approveVendor(id);
      toast.success("Vendor approved!");
      fetchVendors(page);
    } catch {
      toast.error("Approval failed.");
    }
  };
  const handleReject = async (id) => {
    try {
      await rejectVendor(id);
      toast.success("Vendor rejected.");
      fetchVendors(page);
    } catch {
      toast.error("Rejection failed.");
    }
  };
  const handleSuspend = async (id) => {
    try {
      await suspendVendor(id);
      toast.success("Vendor suspended.");
      fetchVendors(page);
    } catch {
      toast.error("Suspension failed.");
    }
  };
  const handleReactivate = async (id) => {
    try {
      await reactivateVendor(id);
      toast.success("Vendor reactivated.");
      fetchVendors(page);
    } catch {
      toast.error("Reactivation failed.");
    }
  };
  const handleAvailability = async (id, status) => {
    try {
      await setVendorAvailability(id, status);
      toast.success("Availability updated.");
      fetchVendors(page);
    } catch {
      toast.error("Update failed.");
    }
  };
  const handleRerun = async (id) => {
    try {
      await rerunTaskMatching(id);
      toast.success("Matching rerun completed!");
      fetchTasks(page);
    } catch {
      toast.error("Rerun failed.");
    }
  };
  const handleTaskStatus = async (id, status) => {
    try {
      await setTaskStatus(id, status);
      toast.success("Task status updated!");
      fetchTasks(page);
      if (selectedTask?.id === id) openTaskDetail(id);
    } catch {
      toast.error("Status update failed.");
    }
  };
  const openTaskDetail = async (id) => {
    try {
      setTaskDetailLoading(true);
      setSelectedTask({
        id,
        loading: true
      });
      const data = await getTaskDetailAdmin(id);
      setSelectedTask(data);
    } catch {
      toast.error("Failed to load task details");
      setSelectedTask(null);
    } finally {
      setTaskDetailLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RequireAdmin, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl pt-8 pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-12 w-12 rounded-xl bg-grad-primary grid place-items-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Operations Panel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "SuperAdmin Control Center" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-secondary p-1 rounded-lg self-start md:self-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setTab("vendors");
          setSearchQuery("");
        }, className: `px-4 py-2 rounded-md text-sm font-medium transition ${tab === "vendors" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`, children: "Vendors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setTab("tasks");
          setSearchQuery("");
        }, className: `px-4 py-2 rounded-md text-sm font-medium transition ${tab === "tasks" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`, children: "Tasks" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: tab === "vendors" ? "Search business, phone, owner..." : "Search task input...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-muted-foreground" }),
          tab === "vendors" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: vendorFilter, onChange: (e) => setVendorFilter(e.target.value), className: "bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Vendors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending Approval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "verified", children: "Verified" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "Rejected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suspended", children: "Suspended" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: taskFilter, onChange: (e) => setTaskFilter(e.target.value), className: "bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Tasks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending_parse", children: "Pending Parse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "parsed", children: "Parsed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "published", children: "Published" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: "Cancelled" })
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-muted-foreground animate-pulse", children: "Loading data..." }) : tab === "vendors" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        vendors.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No vendors found matching criteria." }),
        vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg", children: v.business_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs px-2 py-0.5 rounded-full border ${v.verification_status === "verified" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : v.verification_status === "rejected" ? "bg-red-500/20 text-red-500 border-red-500/20" : "bg-amber-500/20 text-amber-500 border-amber-500/20"}`, children: [
                v.verification_status,
                " ",
                v.is_active ? "(Available)" : "(Suspended)"
              ] }),
              v.availability_status && v.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground capitalize", children: [
                "(",
                v.availability_status,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "h-3 w-3" }),
                " ",
                v.owner_name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                " ",
                v.area || v.city
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                " ",
                v.phone_number
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Category:" }),
              " ",
              v.category_name || "None",
              " ",
              v.subcategory ? `> ${v.subcategory}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap md:flex-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none", value: v.availability_status, onChange: (e) => handleAvailability(v.id, e.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "available", children: "Available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "busy", children: "Busy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "offline", children: "Offline" })
            ] }),
            v.verification_status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleReject(v.id), className: "px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive hover:text-white transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 inline mr-1" }),
                " Reject"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleApprove(v.id), className: "px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium shadow-sm hover:bg-emerald-600 transition", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 inline mr-1" }),
                " Approve"
              ] })
            ] }),
            v.verification_status === "verified" && v.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleSuspend(v.id), className: "px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive hover:text-white transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-4 w-4 inline mr-1" }),
              " Suspend"
            ] }),
            v.verification_status === "verified" && !v.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleReactivate(v.id), className: "px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4 inline mr-1" }),
              " Reactivate"
            ] })
          ] })
        ] }, v.id))
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No tasks found matching criteria." }),
        tasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg", children: [
                "Task #",
                t.id
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full border ${t.status === "published" ? "bg-primary/20 text-primary border-primary/20" : t.status === "completed" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : "bg-secondary text-muted-foreground border-border"}`, children: t.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(t.created_at).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
              '"',
              t.raw_user_input,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                " ",
                t.customer_phone
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3 w-3" }),
                " ",
                t.category_name || "Uncategorized"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                " Matches: ",
                t.match_count
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 md:mt-0 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none", value: t.status, onChange: (e) => handleTaskStatus(t.id, e.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending_parse", children: "Pending Parse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "parsed", children: "Parsed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cancelled", children: "Cancelled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Completed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleRerun(t.id), className: "px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-white transition flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
              " Rerun Match"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openTaskDetail(t.id), className: "px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-border transition flex items-center gap-1", children: [
              "View ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ] })
          ] })
        ] }, t.id))
      ] }),
      (hasPrev || hasNext) && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: !hasPrev, className: "px-4 py-2 rounded-lg bg-secondary text-sm disabled:opacity-50", children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Page ",
          page
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => p + 1), disabled: !hasNext, className: "px-4 py-2 rounded-lg bg-secondary text-sm disabled:opacity-50", children: "Next" })
      ] }),
      selectedTask && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-border p-6 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTask(null), className: "absolute top-4 right-4 p-2 rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
        taskDetailLoading || selectedTask.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center animate-pulse", children: "Loading task details..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold flex items-center gap-2", children: [
              "Task #",
              selectedTask.id,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-medium", children: selectedTask.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: new Date(selectedTask.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/50 p-4 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Raw Request" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
              '"',
              selectedTask.raw_user_input,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedTask.category_name || "Uncategorized" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Urgency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium capitalize", children: selectedTask.urgency })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "Locale" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium uppercase", children: selectedTask.locale })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: "AI Confidence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedTask.ai_confidence ? `${(selectedTask.ai_confidence * 100).toFixed(1)}%` : "N/A" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "Structured Output" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-black/5 dark:bg-black/40 p-4 rounded-xl text-xs overflow-x-auto", children: JSON.stringify(selectedTask.structured_output, null, 2) })
          ] }),
          selectedTask.location && Object.keys(selectedTask.location).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-2", children: "Location Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-black/5 dark:bg-black/40 p-4 rounded-xl text-xs overflow-x-auto", children: JSON.stringify(selectedTask.location, null, 2) })
          ] })
        ] })
      ] }) })
    ] })
  ] }) }) });
}
export {
  AdminDashboard as component
};
