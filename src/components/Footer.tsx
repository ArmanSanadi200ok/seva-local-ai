import { Sparkles, Instagram, Twitter, MessageCircle, Github, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 px-4 pb-8">
      <div className="mx-auto max-w-7xl glass rounded-3xl p-8 md:p-12 shadow-soft">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-grad-primary grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="font-display font-bold text-lg">Ichalkaranji Seva</div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              AI-powered hyperlocal concierge built for real India. From Ichalkaranji to Kolhapur — find verified local services in seconds.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Twitter, MessageCircle].map((Icon, i) => (
                <a key={i} className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-secondary transition" href="#">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium mb-3">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/vendors">Vendor Directory</Link></li>
              <li><Link to="/vendor-panel">Become a Vendor</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-3">Cities</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ichalkaranji</li><li>Kolhapur</li><li>Sangli</li><li>Belgaum</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full glass px-5 py-2.5 border border-white/10">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
              Built by
            </span>
            <span className="text-xs font-semibold text-foreground">
              Arman Sanadi
            </span>
            <span className="mx-1 h-3 w-px bg-border" />
            <a
              href="https://github.com/armansanadi200ok"
              target="_blank"
              rel="noopener noreferrer"
              className="grid place-items-center h-7 w-7 rounded-full hover:bg-secondary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/armansanadi"
              target="_blank"
              rel="noopener noreferrer"
              className="grid place-items-center h-7 w-7 rounded-full hover:bg-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© 2026 Ichalkaranji Seva · Made for Real India 🇮🇳</div>
          <div>Verified Local Vendors · Built in Maharashtra</div>
        </div>
      </div>
    </footer>
  );
}
