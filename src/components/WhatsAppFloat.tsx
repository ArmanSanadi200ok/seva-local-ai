import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-5 right-5 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-emerald animate-pulse-ring" />
      <span className="relative flex items-center gap-2 h-14 pl-4 pr-5 rounded-full text-white shadow-glow"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">Chat on WhatsApp</span>
      </span>
    </motion.a>
  );
}
