import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Star, MapPin, MessageCircle, Phone, ShieldCheck, Clock, Filter, Search, Zap, Sparkles, ArrowDownUp, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { VENDORS, matchVendors, parseTaskAI, QUICK_MESSAGES, type Vendor } from "@/lib/sevaData";

export const Route = createFileRoute("/vendors")({
  head: () => ({ meta: [{ title: "Verified Vendors — Ichalkaranji Seva" }] }),
  component: Vendors,
});

type SortKey = "match" | "distance" | "rating" | "response";
const FILTERS = ["All", "Catering", "Plumbing", "Tailoring", "Industrial Repair", "Decor"];
const SORT_LABEL: Record<SortKey, string> = { match: "AI Match", distance: "Nearest", rating: "Top rated", response: "Fastest" };

function Vendors() {
  const [query, setQuery] = useState("Veg catering 100 ppl");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<SortKey>("match");
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const parsed = parseTaskAI(query);
      setVendors(matchVendors(parsed));
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, [query]);

  const visible = useMemo(() => {
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

  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-violet" /> AI Matched for · "{query}"
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">Verified vendors near you</h1>
          </div>
          <div className="flex gap-2">
            <div className="glass flex items-center gap-2 px-3 h-11 rounded-xl">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Describe what you need…" className="bg-transparent outline-none text-sm w-52" />
            </div>
            <button className="glass h-11 px-4 rounded-xl flex items-center gap-2 text-sm"><Filter className="h-4 w-4" /> Filters</button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${filter === f ? "bg-grad-primary text-white shadow-glow" : "glass hover:bg-secondary"}`}>{f}</button>
            ))}
          </div>
          <div className="glass rounded-xl flex items-center px-2 py-1 text-xs">
            <ArrowDownUp className="h-3.5 w-3.5 mx-2 text-muted-foreground" />
            {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
              <button key={k} onClick={() => setSort(k)} className={`px-3 py-1.5 rounded-lg transition ${sort === k ? "bg-foreground text-background" : "hover:bg-secondary"}`}>{SORT_LABEL[k]}</button>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
          {loading ? <><Loader2 className="h-3 w-3 animate-spin" /> Searching nearby verified vendors…</> : <><CheckCircle2 className="h-3 w-3 text-emerald" /> {visible.length} vendors found · ranked by {SORT_LABEL[sort]}</>}
        </div>

        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <VendorSkeleton key={i} />)
            : visible.map((v, i) => <VendorCard key={v.id} v={v} best={sort === "match" && i === 0} onContact={() => setContactId(v.id)} />)
          }
        </div>
      </div>

      {/* Contact drawer */}
      {contactId && (
        <ContactSheet vendor={vendors.find((v) => v.id === contactId)!} onClose={() => setContactId(null)} />
      )}
    </Layout>
  );
}

function VendorCard({ v, best, onContact }: { v: Vendor; best: boolean; onContact: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`relative glass rounded-3xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all ${best ? "ring-2 ring-violet/40" : ""}`}>
      {best && (
        <span className="absolute -top-2.5 left-5 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-grad-primary text-white shadow-glow flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI Best Match
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 rounded-2xl bg-grad-primary grid place-items-center text-white text-lg font-bold">{v.name[0]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-semibold truncate">{v.name}</div>
            {v.verified && <ShieldCheck className="h-4 w-4 text-emerald shrink-0" />}
          </div>
          <div className="text-xs text-muted-foreground">{v.category} · {v.experience} · {v.completedJobs} jobs</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
            <span className="font-medium">{v.rating}</span>
            <span className="text-muted-foreground">({v.reviews})</span>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${v.available ? "bg-emerald/15 text-emerald" : "bg-muted text-muted-foreground"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${v.available ? "bg-emerald animate-pulse" : "bg-muted-foreground"}`} />
          {v.available ? "Available" : "Busy"}
        </span>
      </div>

      {/* Score row */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="Match" value={`${v.matchScore ?? 0}%`} accent="violet" icon={Zap} />
        <Metric label="Trust" value={`${v.trustScore}`} accent="emerald" icon={ShieldCheck} />
        <Metric label="Responds" value={`${v.responseMin}m`} accent="electric" icon={Clock} />
      </div>

      {/* Match score bar */}
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${v.matchScore ?? 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-grad-primary" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {v.tags.map((t) => <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-secondary">{t}</span>)}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.distanceKm} km · {v.area}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onContact} className="h-10 rounded-xl bg-emerald text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
        <button className="h-10 rounded-xl bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2"><Phone className="h-4 w-4" /> Call</button>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, accent, icon: Icon }: { label: string; value: string; accent: "violet"|"emerald"|"electric"; icon: any }) {
  const cls = { violet: "text-violet bg-violet/10", emerald: "text-emerald bg-emerald/10", electric: "text-electric bg-electric/10" }[accent];
  return (
    <div className={`rounded-xl ${cls} px-2 py-2`}>
      <Icon className="h-3 w-3 mx-auto" />
      <div className="text-sm font-bold mt-0.5">{value}</div>
      <div className="text-[9px] uppercase tracking-wider opacity-70">{label}</div>
    </div>
  );
}

function VendorSkeleton() {
  return (
    <div className="glass rounded-3xl p-5 animate-pulse">
      <div className="flex gap-3">
        <div className="h-14 w-14 rounded-2xl bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 bg-secondary rounded" />
          <div className="h-3 w-1/2 bg-secondary rounded" />
          <div className="h-3 w-1/3 bg-secondary rounded" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0,1,2].map((i)=> <div key={i} className="h-14 bg-secondary rounded-xl" />)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-10 bg-secondary rounded-xl" />
        <div className="h-10 bg-secondary rounded-xl" />
      </div>
    </div>
  );
}

function ContactSheet({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const [sent, setSent] = useState<string | null>(null);
  const send = (m: string) => { setSent(m); setTimeout(onClose, 1100); };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-end md:place-items-center" onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(e)=>e.stopPropagation()}
        className="w-full md:max-w-md glass rounded-t-3xl md:rounded-3xl p-6 m-0 md:m-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-grad-primary text-white grid place-items-center font-bold">{vendor.name[0]}</div>
          <div>
            <div className="font-semibold flex items-center gap-1.5">{vendor.name} {vendor.verified && <ShieldCheck className="h-4 w-4 text-emerald" />}</div>
            <div className="text-xs text-muted-foreground">{vendor.whatsapp} · responds in {vendor.responseMin}m</div>
          </div>
        </div>
        <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Send a quick message</div>
        <div className="mt-2 flex flex-col gap-2">
          {QUICK_MESSAGES.map((m) => (
            <button key={m} onClick={() => send(m)} className="text-left text-sm px-4 py-3 rounded-xl bg-emerald/10 hover:bg-emerald/20 text-foreground transition flex items-center justify-between">
              <span>{m}</span> <MessageCircle className="h-4 w-4 text-emerald" />
            </button>
          ))}
        </div>
        {sent && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-xl bg-emerald/15 text-emerald text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Sent via WhatsApp · inquiry tracked
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
