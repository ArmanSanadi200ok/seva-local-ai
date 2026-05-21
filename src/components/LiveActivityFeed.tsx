import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, CheckCircle2, MessageCircle, Sparkles, ShieldCheck, Radio, Zap, Inbox } from "lucide-react";
import { systemBus, type SystemEvent, type SystemEventKind } from "@/lib/systemEvents";

const ICONS: Record<SystemEventKind, React.ComponentType<{ className?: string }>> = {
  "request.received": Inbox,
  "ai.parsed": Sparkles,
  "vendor.matched": Zap,
  "vendor.responded": CheckCircle2,
  "whatsapp.sent": MessageCircle,
  "quote.received": Activity,
  "verification.passed": ShieldCheck,
  "system.health": Radio,
};

function ago(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function LiveActivityFeed({ compact = false }: { compact?: boolean }) {
  const [events, setEvents] = useState<SystemEvent[]>(() => systemBus.list());
  const [, force] = useState(0);

  useEffect(() => systemBus.subscribe(setEvents), []);
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 15_000);
    return () => clearInterval(i);
  }, []);

  const list = compact ? events.slice(0, 6) : events.slice(0, 12);

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 rounded-lg bg-grad-primary grid place-items-center text-white">
            <Activity className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">Live system feed</div>
            <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">seva.ws · realtime</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald/15 text-emerald font-medium flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" /> {events.length} events
        </span>
      </div>

      <div className="relative max-h-[420px] overflow-hidden">
        <AnimatePresence initial={false}>
          {list.map((e) => {
            const I = ICONS[e.kind];
            const tone =
              e.level === "success" ? "text-emerald bg-emerald/10" :
              e.level === "warn" ? "text-saffron bg-saffron/10" : "text-electric bg-electric/10";
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3 py-2 border-b border-border/60 last:border-0"
              >
                <div className={`h-8 w-8 shrink-0 rounded-lg grid place-items-center ${tone}`}>
                  <I className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  {e.detail && <div className="text-[11px] text-muted-foreground truncate">{e.detail}</div>}
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap pt-1 flex flex-col items-end">
                  <span>{ago(e.ts)}</span>
                  {e.latencyMs && <span className="text-emerald font-mono">{e.latencyMs}ms</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
