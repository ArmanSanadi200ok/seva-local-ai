import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function Layout({ children, bare = false }: { children: React.ReactNode; bare?: boolean }) {
  return (
    <div className="min-h-screen relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40" />
      <Navbar />
      <main className="px-4">{children}</main>
      {!bare && <Footer />}
      <WhatsAppFloat />
    </div>
  );
}
