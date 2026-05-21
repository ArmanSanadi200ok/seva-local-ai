import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Users, Building2, Sparkles, AlertTriangle, TrendingUp, ShieldCheck, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Ichalkaranji Seva" }] }),
  component: Admin,
});

const growth = Array.from({ length: 14 }, (_, i) => ({ d: i + 1, u: 200 + Math.round(Math.sin(i / 2) * 80 + i * 30) }));
const cities = [
  { c: "Ichalkaranji", v: 4200 },
  { c: "Kolhapur", v: 3100 },
  { c: "Sangli", v: 2200 },
  { c: "Belgaum", v: 1400 },
];
const cats = [
  { n: "Catering", v: 32, color: "oklch(0.62 0.24 258)" },
  { n: "Plumbing", v: 24, color: "oklch(0.66 0.22 300)" },
  { n: "Tailoring", v: 18, color: "oklch(0.7 0.18 162)" },
  { n: "Powerloom", v: 14, color: "oklch(0.78 0.13 200)" },
  { n: "Other", v: 12, color: "oklch(0.78 0.17 60)" },
];
const queue = [
  { n: "Mauli Tiffin Service", c: "Catering · Ichalkaranji", docs: "Aadhaar + GST" },
  { n: "Sagar Electricals", c: "Repairs · Kolhapur", docs: "Aadhaar" },
  { n: "Vinayak Decorators", c: "Decor · Sangli", docs: "Aadhaar + Photos" },
];

function Admin() {
  return (
    <Layout>
      <div className="mx-auto max-w-7xl pt-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Admin · Operations</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold">City pulse & vendor health</h1>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "Active users", v: "10,924", i: Users, up: "+12%" },
            { l: "Verified vendors", v: "1,240", i: Building2, up: "+8%" },
            { l: "AI tasks today", v: "2,318", i: Sparkles, up: "+24%" },
            { l: "Fraud flags", v: "7", i: AlertTriangle, up: "-3" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-xl bg-grad-primary grid place-items-center text-white"><s.i className="h-4 w-4" /></div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald/20 text-emerald">{s.up}</span>
              </div>
              <div className="mt-3 text-2xl font-bold">{s.v}</div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Growth chart */}
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">User growth · last 14 days</h2>
                <div className="text-xs text-muted-foreground">Daily active users</div>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald" />
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <LineChart data={growth}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.45 0.22 274)" />
                      <stop offset="100%" stopColor="oklch(0.66 0.22 300)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" hide />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="u" stroke="url(#g1)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories */}
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Task categories</h2>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={cats} dataKey="v" nameKey="n" innerRadius={50} outerRadius={80} strokeWidth={0}>
                    {cats.map((c) => <Cell key={c.n} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
              {cats.map((c) => (
                <div key={c.n} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} /> {c.n} · {c.v}%
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* City activity */}
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> City-wise activity</h2>
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <BarChart data={cities}>
                  <XAxis dataKey="c" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="v" fill="oklch(0.62 0.24 258)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification queue */}
          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald" /> Verification queue</h2>
            <div className="mt-4 space-y-3">
              {queue.map((q) => (
                <div key={q.n} className="p-3 rounded-xl border border-border bg-background/40">
                  <div className="font-medium text-sm">{q.n}</div>
                  <div className="text-xs text-muted-foreground">{q.c}</div>
                  <div className="text-[10px] mt-1 text-muted-foreground">Docs: {q.docs}</div>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 h-8 rounded-lg bg-emerald text-white text-xs flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approve</button>
                    <button className="flex-1 h-8 rounded-lg bg-destructive/20 text-destructive text-xs flex items-center justify-center gap-1"><XCircle className="h-3 w-3" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fraud */}
        <div className="mt-6 glass rounded-3xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Fraud detection</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-3">
            {[
              { t: "Duplicate phone numbers", c: "3 vendors flagged", sev: "Medium" },
              { t: "Fake reviews pattern", c: "1 vendor flagged", sev: "High" },
              { t: "Suspicious GPS spoofing", c: "3 users flagged", sev: "Low" },
            ].map((f) => (
              <div key={f.t} className="p-4 rounded-2xl border border-border bg-background/40">
                <div className="font-medium text-sm">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.c}</div>
                <span className={`mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full ${
                  f.sev === "High" ? "bg-destructive/20 text-destructive" :
                  f.sev === "Medium" ? "bg-saffron/30 text-foreground" : "bg-secondary"
                }`}>{f.sev} priority</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
