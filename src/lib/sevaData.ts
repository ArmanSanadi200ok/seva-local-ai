// Centralized mock "backend" for Ichalkaranji Seva.
// Simulates AI task parsing, vendor matching, request lifecycle.

export type RequestStatus = "active" | "pending" | "completed" | "cancelled";

export interface ParsedTask {
  service_type: string;
  category: string;
  location: string;
  urgency_level: "low" | "medium" | "high";
  budget_range: string;
  estimated_time: string;
  people?: number;
  language: "मराठी" | "हिंदी" | "English" | "Mixed";
  confidence: number; // 0-100
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  experience: string;
  rating: number;
  reviews: number;
  responseMin: number;
  distanceKm: number;
  available: boolean;
  verified: boolean;
  trustScore: number; // 0-100
  matchScore?: number; // computed
  tags: string[];
  area: string;
  completedJobs: number;
  whatsapp: string;
}

export interface SevaRequest {
  id: string;
  title: string;
  category: string;
  status: RequestStatus;
  createdAt: string;
  area: string;
  matchedVendors: number;
  urgency: "low" | "medium" | "high";
  inquiryStatus?: "sent" | "replied" | "quote" | "confirmed";
}

export const VENDORS: Vendor[] = [
  { id: "v1", name: "Annapurna Catering", category: "Catering", experience: "12 yrs", rating: 4.9, reviews: 213, responseMin: 5, distanceKm: 1.2, available: true, verified: true, trustScore: 96, tags: ["Weddings", "Bulk", "Pure veg"], area: "Shahupuri", completedJobs: 412, whatsapp: "+919876500001" },
  { id: "v2", name: "Rajesh Plumbing Works", category: "Plumbing", experience: "8 yrs", rating: 4.7, reviews: 102, responseMin: 12, distanceKm: 0.8, available: true, verified: true, trustScore: 91, tags: ["24×7", "Urgent"], area: "Kabnur", completedJobs: 280, whatsapp: "+919876500002" },
  { id: "v3", name: "Riyaz Tailors", category: "Tailoring", experience: "20 yrs", rating: 4.8, reviews: 340, responseMin: 60, distanceKm: 2.1, available: false, verified: true, trustScore: 94, tags: ["School uniforms", "Bulk"], area: "Main Road", completedJobs: 720, whatsapp: "+919876500003" },
  { id: "v4", name: "Powerloom Care", category: "Industrial Repair", experience: "15 yrs", rating: 4.6, reviews: 78, responseMin: 30, distanceKm: 3.4, available: true, verified: true, trustScore: 88, tags: ["Powerloom", "Belts", "Motors"], area: "MIDC", completedJobs: 165, whatsapp: "+919876500004" },
  { id: "v5", name: "Shree Decorators", category: "Decor", experience: "10 yrs", rating: 4.5, reviews: 156, responseMin: 20, distanceKm: 1.7, available: true, verified: true, trustScore: 85, tags: ["Mandap", "Lighting"], area: "Shivaji Nagar", completedJobs: 198, whatsapp: "+919876500005" },
  { id: "v6", name: "Mauli Tiffin Service", category: "Catering", experience: "6 yrs", rating: 4.4, reviews: 88, responseMin: 10, distanceKm: 0.5, available: true, verified: false, trustScore: 72, tags: ["Tiffin", "Office"], area: "Rajwada", completedJobs: 94, whatsapp: "+919876500006" },
];

export const INITIAL_REQUESTS: SevaRequest[] = [
  { id: "r1", title: "Tailor for 200 school uniforms", category: "Tailoring", status: "active", createdAt: "2m ago", area: "Main Road", matchedVendors: 4, urgency: "medium", inquiryStatus: "sent" },
  { id: "r2", title: "Plumber near Kabnur — urgent", category: "Plumbing", status: "pending", createdAt: "18m ago", area: "Kabnur", matchedVendors: 2, urgency: "high", inquiryStatus: "replied" },
  { id: "r3", title: "Veg catering for 100 ppl tomorrow", category: "Catering", status: "completed", createdAt: "yesterday", area: "Shahupuri", matchedVendors: 3, urgency: "medium", inquiryStatus: "confirmed" },
  { id: "r4", title: "Powerloom belt replacement", category: "Industrial Repair", status: "active", createdAt: "1h ago", area: "MIDC", matchedVendors: 2, urgency: "high", inquiryStatus: "quote" },
  { id: "r5", title: "Mandap decor for engagement", category: "Decor", status: "cancelled", createdAt: "3d ago", area: "Shivaji Nagar", matchedVendors: 3, urgency: "low" },
];

// Simulated AI parser. Picks plausible structure from input keywords.
export function parseTaskAI(input: string): ParsedTask {
  const lower = input.toLowerCase();
  const has = (...k: string[]) => k.some((w) => lower.includes(w));

  let category = "General Seva";
  let service_type = "service";
  if (has("cater", "catering", "tiffin", "जेवण", "food")) { category = "Catering"; service_type = "veg catering"; }
  else if (has("plumb", "tap", "leak", "नळ")) { category = "Plumbing"; service_type = "plumbing repair"; }
  else if (has("tailor", "uniform", "stitch", "शिलाई", "saree")) { category = "Tailoring"; service_type = "bulk tailoring"; }
  else if (has("powerloom", "motor", "belt", "मशीन")) { category = "Industrial Repair"; service_type = "powerloom repair"; }
  else if (has("decor", "mandap", "wedding", "लग्न")) { category = "Decor"; service_type = "event decoration"; }
  else if (has("tutor", "tuition", "study")) { category = "Education"; service_type = "home tutor"; }

  const urgency: ParsedTask["urgency_level"] = has("urgent", "asap", "now", "तत्काळ", "लगेच") ? "high" : has("tomorrow", "today") ? "medium" : "low";

  const areas = ["Kabnur", "Shahupuri", "MIDC", "Shivaji Nagar", "Main Road", "Rajwada"];
  const location = areas.find((a) => lower.includes(a.toLowerCase())) || "Ichalkaranji";

  const peopleMatch = input.match(/(\d{2,4})\s*(people|ppl|लोक|persons|guests)?/i);
  const people = peopleMatch ? parseInt(peopleMatch[1], 10) : undefined;

  let budget_range = "₹ 500 – ₹ 2,000";
  if (category === "Catering") budget_range = people ? `₹ ${people * 120} – ₹ ${people * 220}` : "₹ 12,000 – ₹ 24,000";
  if (category === "Plumbing") budget_range = "₹ 200 – ₹ 1,500";
  if (category === "Tailoring") budget_range = people ? `₹ ${people * 80} – ₹ ${people * 140}` : "₹ 2,000 – ₹ 8,000";
  if (category === "Industrial Repair") budget_range = "₹ 800 – ₹ 6,000";

  const estimated_time = urgency === "high" ? "Within 1 hour" : urgency === "medium" ? "Same day" : "Within 2-3 days";

  const hasMarathi = /[\u0900-\u097F]/.test(input);
  const hasEnglish = /[a-zA-Z]/.test(input);
  const language: ParsedTask["language"] = hasMarathi && hasEnglish ? "Mixed" : hasMarathi ? "मराठी" : "English";

  return {
    service_type,
    category,
    location,
    urgency_level: urgency,
    budget_range,
    estimated_time,
    people,
    language,
    confidence: 88 + Math.floor(Math.random() * 10),
  };
}

// Match vendors with weighted AI score.
export function matchVendors(parsed: ParsedTask): Vendor[] {
  const ranked = VENDORS.map((v) => {
    const catMatch = v.category.toLowerCase() === parsed.category.toLowerCase() ? 40 : v.category.toLowerCase().includes(parsed.category.toLowerCase().split(" ")[0]) ? 25 : 5;
    const distScore = Math.max(0, 25 - v.distanceKm * 4);
    const respScore = Math.max(0, 20 - v.responseMin * 0.3);
    const trust = v.trustScore * 0.15;
    const availability = v.available ? 0 : -15;
    const matchScore = Math.min(99, Math.round(catMatch + distScore + respScore + trust + availability));
    return { ...v, matchScore };
  }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  return ranked;
}

export const QUICK_MESSAGES = [
  "नमस्कार! Service available आहे का?",
  "Quote पाठवा please",
  "किती वेळ लागेल?",
  "Address share करू का?",
];

// Simulated network call with delay.
export function fakeDelay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((res) => setTimeout(() => res(value), ms));
}
