import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { 
  getVendorsAdmin, approveVendor, rejectVendor, suspendVendor, reactivateVendor, setVendorAvailability, 
  getTasksAdmin, rerunTaskMatching, setTaskStatus, getTaskDetailAdmin 
} from "@/lib/api/admin";
import { 
  Check, X, ShieldAlert, MapPin, Phone, Building, Briefcase, RefreshCw, PowerOff, Filter, Search, ChevronRight, CheckCircle2, PlayCircle 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [tab, setTab] = useState<"vendors" | "tasks">("vendors");
  
  // Data lists
  const [vendors, setVendors] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [vendorFilter, setVendorFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Detail Modal
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskDetailLoading, setTaskDetailLoading] = useState(false);

  const fetchVendors = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const params: any = { page: pageNumber };
      if (vendorFilter === "pending") params.verification_status = "pending";
      if (vendorFilter === "verified") params.verification_status = "verified";
      if (vendorFilter === "rejected") params.verification_status = "rejected";
      if (vendorFilter === "suspended") params.is_active = "False";
      if (searchQuery) params.search = searchQuery;
      
      const data = await getVendorsAdmin(params);
      if (Array.isArray(data)) {
        setVendors(data);
        setHasNext(false); setHasPrev(false);
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
      const params: any = { page: pageNumber };
      if (taskFilter !== "all") params.status = taskFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await getTasksAdmin(params);
      if (Array.isArray(data)) {
        setTasks(data);
        setHasNext(false); setHasPrev(false);
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

  useEffect(() => {
    setPage(1); // Reset page on filter/tab change
  }, [tab, vendorFilter, taskFilter, searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tab === "vendors") fetchVendors(page);
      if (tab === "tasks") fetchTasks(page);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [tab, vendorFilter, taskFilter, searchQuery, page]);

  const handleApprove = async (id: number) => {
    try { await approveVendor(id); toast.success("Vendor approved!"); fetchVendors(page); } catch { toast.error("Approval failed."); }
  };
  const handleReject = async (id: number) => {
    try { await rejectVendor(id); toast.success("Vendor rejected."); fetchVendors(page); } catch { toast.error("Rejection failed."); }
  };
  const handleSuspend = async (id: number) => {
    try { await suspendVendor(id); toast.success("Vendor suspended."); fetchVendors(page); } catch { toast.error("Suspension failed."); }
  };
  const handleReactivate = async (id: number) => {
    try { await reactivateVendor(id); toast.success("Vendor reactivated."); fetchVendors(page); } catch { toast.error("Reactivation failed."); }
  };
  const handleAvailability = async (id: number, status: string) => {
    try { await setVendorAvailability(id, status); toast.success("Availability updated."); fetchVendors(page); } catch { toast.error("Update failed."); }
  };
  const handleRerun = async (id: number) => {
    try { await rerunTaskMatching(id); toast.success("Matching rerun completed!"); fetchTasks(page); } catch { toast.error("Rerun failed."); }
  };
  const handleTaskStatus = async (id: number, status: string) => {
    try { await setTaskStatus(id, status); toast.success("Task status updated!"); fetchTasks(page); if (selectedTask?.id === id) openTaskDetail(id); } catch { toast.error("Status update failed."); }
  };
  
  const openTaskDetail = async (id: number) => {
    try {
      setTaskDetailLoading(true);
      setSelectedTask({ id, loading: true });
      const data = await getTaskDetailAdmin(id);
      setSelectedTask(data);
    } catch {
      toast.error("Failed to load task details");
      setSelectedTask(null);
    } finally {
      setTaskDetailLoading(false);
    }
  };

  return (
    <RequireAdmin>
      <Layout>
        <div className="mx-auto max-w-7xl pt-8 pb-16">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl bg-grad-primary grid place-items-center shadow-glow">
                <ShieldAlert className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Operations Panel</h1>
                <p className="text-sm text-muted-foreground">SuperAdmin Control Center</p>
              </div>
            </div>
            <div className="flex bg-secondary p-1 rounded-lg self-start md:self-auto">
              <button onClick={() => { setTab("vendors"); setSearchQuery(""); }} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === "vendors" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}>Vendors</button>
              <button onClick={() => { setTab("tasks"); setSearchQuery(""); }} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === "tasks" ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}>Tasks</button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 relative">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder={tab === "vendors" ? "Search business, phone, owner..." : "Search task input..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {tab === "vendors" ? (
                  <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none">
                    <option value="all">All Vendors</option>
                    <option value="pending">Pending Approval</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                ) : (
                  <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} className="bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none">
                    <option value="all">All Tasks</option>
                    <option value="pending_parse">Pending Parse</option>
                    <option value="parsed">Parsed</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-muted-foreground animate-pulse">Loading data...</div>
            ) : tab === "vendors" ? (
              <div className="grid gap-4">
                {vendors.length === 0 && <div className="py-8 text-center text-muted-foreground">No vendors found matching criteria.</div>}
                {vendors.map((v) => (
                  <div key={v.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{v.business_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${v.verification_status === "verified" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : v.verification_status === "rejected" ? "bg-red-500/20 text-red-500 border-red-500/20" : "bg-amber-500/20 text-amber-500 border-amber-500/20"}`}>
                          {v.verification_status} {v.is_active ? "(Available)" : "(Suspended)"}
                        </span>
                        {v.availability_status && v.is_active && (
                           <span className="text-xs text-muted-foreground capitalize">({v.availability_status})</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Building className="h-3 w-3"/> {v.owner_name}</div>
                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {v.area || v.city}</div>
                        <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {v.phone_number}</div>
                      </div>
                      <div className="text-sm pt-1"><span className="font-medium text-foreground">Category:</span> {v.category_name || "None"} {v.subcategory ? `> ${v.subcategory}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                      <select 
                        className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                        value={v.availability_status}
                        onChange={(e) => handleAvailability(v.id, e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="offline">Offline</option>
                      </select>
                      
                      {v.verification_status === "pending" && (
                        <>
                          <button onClick={() => handleReject(v.id)} className="px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive hover:text-white transition"><X className="h-4 w-4 inline mr-1" /> Reject</button>
                          <button onClick={() => handleApprove(v.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium shadow-sm hover:bg-emerald-600 transition"><Check className="h-4 w-4 inline mr-1" /> Approve</button>
                        </>
                      )}
                      {v.verification_status === "verified" && v.is_active && (
                        <button onClick={() => handleSuspend(v.id)} className="px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive hover:text-white transition"><PowerOff className="h-4 w-4 inline mr-1" /> Suspend</button>
                      )}
                      {v.verification_status === "verified" && !v.is_active && (
                        <button onClick={() => handleReactivate(v.id)} className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition"><PlayCircle className="h-4 w-4 inline mr-1" /> Reactivate</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.length === 0 && <div className="py-8 text-center text-muted-foreground">No tasks found matching criteria.</div>}
                {tasks.map((t) => (
                  <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">Task #{t.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${t.status === "published" ? "bg-primary/20 text-primary border-primary/20" : t.status === "completed" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : "bg-secondary text-muted-foreground border-border"}`}>
                          {t.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm font-medium">"{t.raw_user_input}"</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Phone className="h-3 w-3"/> {t.customer_phone}</div>
                        <div className="flex items-center gap-1"><Briefcase className="h-3 w-3"/> {t.category_name || "Uncategorized"}</div>
                        <div className="flex items-center gap-1"><Check className="h-3 w-3"/> Matches: {t.match_count}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
                      <select 
                        className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                        value={t.status}
                        onChange={(e) => handleTaskStatus(t.id, e.target.value)}
                      >
                        <option value="pending_parse">Pending Parse</option>
                        <option value="parsed">Parsed</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <button onClick={() => handleRerun(t.id)} className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-white transition flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" /> Rerun Match
                      </button>
                      
                      <button onClick={() => openTaskDetail(t.id)} className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-border transition flex items-center gap-1">
                        View <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination Controls */}
            {(hasPrev || hasNext) && !loading && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-border">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={!hasPrev}
                  className="px-4 py-2 rounded-lg bg-secondary text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <button 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={!hasNext}
                  className="px-4 py-2 rounded-lg bg-secondary text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
            
            {/* Task Detail Modal */}
            {selectedTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-border p-6 relative">
                  <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary">
                    <X className="h-5 w-5" />
                  </button>
                  
                  {taskDetailLoading || selectedTask.loading ? (
                     <div className="py-12 text-center animate-pulse">Loading task details...</div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          Task #{selectedTask.id}
                          <span className="text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-medium">{selectedTask.status}</span>
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">{new Date(selectedTask.created_at).toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-secondary/50 p-4 rounded-xl">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Raw Request</div>
                        <p className="font-medium">"{selectedTask.raw_user_input}"</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</div>
                          <p className="font-medium">{selectedTask.category_name || "Uncategorized"}</p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Urgency</div>
                          <p className="font-medium capitalize">{selectedTask.urgency}</p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Locale</div>
                          <p className="font-medium uppercase">{selectedTask.locale}</p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">AI Confidence</div>
                          <p className="font-medium">{selectedTask.ai_confidence ? `${(selectedTask.ai_confidence * 100).toFixed(1)}%` : "N/A"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Structured Output</div>
                        <pre className="bg-black/5 dark:bg-black/40 p-4 rounded-xl text-xs overflow-x-auto">
                          {JSON.stringify(selectedTask.structured_output, null, 2)}
                        </pre>
                      </div>
                      
                      {selectedTask.location && Object.keys(selectedTask.location).length > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Location Data</div>
                          <pre className="bg-black/5 dark:bg-black/40 p-4 rounded-xl text-xs overflow-x-auto">
                            {JSON.stringify(selectedTask.location, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </RequireAdmin>
  );
}
