import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Tiny always-on system status pill — communicates "live SaaS" feel.
export function SystemStatusBar() {
  const [p95, setP95] = useState(186);
  const [reqs, setReqs] = useState(1247);

  useEffect(() => {
    const i = setInterval(() => {
      setP95(160 + Math.floor(Math.random() * 80));
      setReqs((r) => r + Math.floor(1 + Math.random() * 4));
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="hidden md:flex fixed bottom-4 left-4 z-30 items-center gap-3 glass rounded-full pl-2 pr-4 py-1.5 text-[11px] font-mono shadow-soft">
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/15 text-emerald">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> all systems
      </span>
      <span className="text-muted-foreground">match.p95 <span className="text-foreground">{p95}ms</span></span>
      <span className="text-muted-foreground">req/24h <span className="text-foreground">{reqs.toLocaleString("en-IN")}</span></span>
      <Activity className="h-3 w-3 text-electric" />
    </div>
  );
}
