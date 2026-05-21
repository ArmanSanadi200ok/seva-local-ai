import { useState, useEffect } from "react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"enter" | "settled" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("settled"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return <>{children}</>;

  const isExit = phase === "exit";

  return (
    <>
      <div
        aria-hidden={isExit}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden splash-bg ${
          isExit ? "splash-exit" : "splash-enter"
        }`}
      >
        {/* Soft radial glow behind content */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[50vmin] w-[50vmin] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 px-6">
          {/* Logo mark */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-grad-primary shadow-glow splash-mark ${
              isExit ? "mark-out" : ""
            }`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* App name */}
          <div
            className={`flex flex-col items-center gap-1.5 text-center splash-text ${
              isExit ? "text-out" : ""
            }`}
          >
            <h1 className="text-[1.65rem] font-bold tracking-tight md:text-3xl">
              <span className="text-grad-primary">Ichalkaranji</span>{" "}
              <span className="text-foreground">Seva</span>
            </h1>
            <p className="max-w-[16rem] text-xs font-medium leading-relaxed text-muted-foreground md:max-w-none md:text-sm">
              AI-powered local services for real India
            </p>
          </div>

          {/* Dot loader */}
          <div
            className={`mt-1 flex items-center gap-2 splash-loader ${
              isExit ? "loader-out" : ""
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-splash-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
