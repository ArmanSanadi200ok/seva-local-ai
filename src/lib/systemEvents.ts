// Lightweight in-memory event bus to simulate live backend system events.
// Powers LiveActivityFeed across the app.

export type SystemEventKind =
  | "request.received"
  | "ai.parsed"
  | "vendor.matched"
  | "vendor.responded"
  | "whatsapp.sent"
  | "quote.received"
  | "verification.passed"
  | "system.health";

export interface SystemEvent {
  id: string;
  kind: SystemEventKind;
  title: string;
  detail?: string;
  area?: string;
  ts: number; // epoch ms
  latencyMs?: number;
  level: "info" | "success" | "warn";
}

type Listener = (events: SystemEvent[]) => void;

class EventBus {
  private events: SystemEvent[] = [];
  private listeners = new Set<Listener>();
  private max = 40;

  emit(e: Omit<SystemEvent, "id" | "ts"> & { ts?: number }) {
    const evt: SystemEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: e.ts ?? Date.now(),
      ...e,
    };
    this.events = [evt, ...this.events].slice(0, this.max);
    this.listeners.forEach((l) => l(this.events));
  }

  list() {
    return this.events;
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    l(this.events);
    return () => this.listeners.delete(l);
  }
}

export const systemBus = new EventBus();

// Seed a few realistic events so the feed never looks empty on first load.
const seed: Array<Omit<SystemEvent, "id" | "ts">> = [
  { kind: "request.received", title: "New request · Plumber", detail: "Kabnur · urgent", area: "Kabnur", level: "info", latencyMs: 142 },
  { kind: "ai.parsed", title: "AI parsed task", detail: "confidence 94%", level: "success", latencyMs: 380 },
  { kind: "vendor.matched", title: "3 vendors matched", detail: "best score 96%", level: "success" },
  { kind: "whatsapp.sent", title: "WhatsApp inquiry sent", detail: "Annapurna Catering", level: "info" },
  { kind: "vendor.responded", title: "Vendor responded", detail: "Rajesh Plumbing · 4 min", level: "success" },
  { kind: "verification.passed", title: "Vendor verified", detail: "Aadhaar + GST", level: "success" },
];
let t = Date.now() - 60_000;
seed.forEach((s) => {
  t += 9000;
  systemBus.emit({ ...s, ts: t });
});

// Background heartbeat to keep system feeling live.
if (typeof window !== "undefined") {
  const heartbeats = [
    () => systemBus.emit({ kind: "system.health", title: "Match engine OK", detail: `p95 ${Math.floor(180 + Math.random() * 90)}ms`, level: "info" }),
    () => systemBus.emit({ kind: "vendor.responded", title: "Vendor responded", detail: `${["Riyaz Tailors","Powerloom Care","Mauli Tiffin"][Math.floor(Math.random()*3)]} · ${Math.floor(2+Math.random()*8)} min`, level: "success" }),
    () => systemBus.emit({ kind: "request.received", title: "New request · " + ["Tailoring","Decor","Tiffin","Plumbing"][Math.floor(Math.random()*4)], detail: ["Shahupuri","MIDC","Rajwada","Main Road"][Math.floor(Math.random()*4)], level: "info" }),
  ];
  setInterval(() => heartbeats[Math.floor(Math.random() * heartbeats.length)](), 11_000);
}
