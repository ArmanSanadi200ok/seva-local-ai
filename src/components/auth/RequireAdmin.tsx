import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getMe, type CustomerProfile } from "@/lib/api/profile";
import { getAccessToken } from "@/lib/api/auth";
import { ShieldCheck } from "lucide-react";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate({ to: "/dashboard" });
      return;
    }
    getMe().then((p) => {
      const isActuallyAdmin = p.role === "admin" || p.is_superuser || p.is_staff;
      if (!isActuallyAdmin) navigate({ to: "/dashboard" });
      else setProfile(p);
    }).catch(() => navigate({ to: "/dashboard" }))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
      <ShieldCheck className="h-8 w-8 animate-pulse text-primary" />
      Verifying admin access...
    </div>
  );
  
  if (!profile) return null;
  
  const isActuallyAdmin = profile.role === "admin" || profile.is_superuser || profile.is_staff;
  if (!isActuallyAdmin) return null;

  return <>{children}</>;
}
