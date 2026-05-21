import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/vendors", label: "Vendors" },
  { to: "/vendor-panel", label: "For Vendors" },
  { to: "/admin", label: "Admin" },
] as const;

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-7xl glass rounded-2xl shadow-soft">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl bg-grad-primary grid place-items-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base">Ichalkaranji Seva</div>
              <div className="text-[10px] text-muted-foreground tracking-wider uppercase">AI Hyperlocal Concierge</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    active ? "bg-grad-primary text-white shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition">EN · हिं · मराठी</button>
            <Link to="/dashboard" className="text-sm px-4 py-2 rounded-lg bg-grad-primary text-white shadow-glow hover:opacity-90 transition">
              Open App
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border px-3 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-secondary text-sm">
                {l.label}
              </Link>
            ))}
            <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 text-sm text-center px-4 py-2 rounded-lg bg-grad-primary text-white">
              Open App
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
