import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Star, MapPin, MessageCircle, Phone, ShieldCheck, Clock, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/vendors")({
  head: () => ({ meta: [{ title: "Verified Vendors — Ichalkaranji Seva" }] }),
  component: Vendors,
});

const vendors = [
  { n: "Annapurna Catering", c: "Veg Catering", exp: "12 yrs", r: 4.9, reviews: 213, resp: "5 min", dist: "1.2 km", avail: true, verified: true, tags: ["Weddings", "Bulk", "Pure veg"] },
  { n: "Rajesh Plumbing Works", c: "Plumbing", exp: "8 yrs", r: 4.7, reviews: 102, resp: "12 min", dist: "0.8 km", avail: true, verified: true, tags: ["24×7", "Urgent"] },
  { n: "Riyaz Tailors", c: "Tailoring", exp: "20 yrs", r: 4.8, reviews: 340, resp: "1 hr", dist: "2.1 km", avail: false, verified: true, tags: ["School uniforms", "Bulk"] },
  { n: "Powerloom Care", c: "Industrial Repair", exp: "15 yrs", r: 4.6, reviews: 78, resp: "30 min", dist: "3.4 km", avail: true, verified: true, tags: ["Powerloom", "Belts", "Motors"] },
  { n: "Shree Decorators", c: "Wedding Decor", exp: "10 yrs", r: 4.5, reviews: 156, resp: "20 min", dist: "1.7 km", avail: true, verified: true, tags: ["Mandap", "Lighting"] },
  { n: "Mauli Tiffin Service", c: "Catering", exp: "6 yrs", r: 4.4, reviews: 88, resp: "10 min", dist: "0.5 km", avail: true, verified: false, tags: ["Tiffin", "Office"] },
];

const filters = ["All", "Plumbing", "Catering", "Tailoring", "Repairs", "Decor", "Logistics"];

function Vendors() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Matched for · "Veg catering 100 ppl"</div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold">Verified vendors near you</h1>
          </div>
          <div className="flex gap-2">
            <div className="glass flex items-center gap-2 px-3 h-11 rounded-xl">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search service…" className="bg-transparent outline-none text-sm w-44" />
            </div>
            <button className="glass h-11 px-4 rounded-xl flex items-center gap-2 text-sm"><Filter className="h-4 w-4" /> Filters</button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {filters.map((f, i) => (
            <button key={f} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${i === 0 ? "bg-grad-primary text-white shadow-glow" : "glass hover:bg-secondary"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vendors.map((v) => (
            <div key={v.n} className="glass rounded-3xl p-5 hover:shadow-glow hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-2xl bg-grad-primary grid place-items-center text-white text-lg font-bold">{v.n[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="font-semibold truncate">{v.n}</div>
                    {v.verified && <ShieldCheck className="h-4 w-4 text-emerald shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{v.c} · {v.exp}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
                    <span className="font-medium">{v.r}</span>
                    <span className="text-muted-foreground">({v.reviews})</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full ${v.avail ? "bg-emerald/20 text-emerald" : "bg-muted text-muted-foreground"}`}>
                  {v.avail ? "Available" : "Busy"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {v.tags.map((t) => <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-secondary">{t}</span>)}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.dist}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Responds in {v.resp}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="h-10 rounded-xl bg-emerald text-white text-sm font-medium flex items-center justify-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
                <button className="h-10 rounded-xl bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2"><Phone className="h-4 w-4" /> Call</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
