import { apiFetch } from "./client";
import { type ParsedTask } from "../sevaData";

export const getTasks = async (): Promise<any[]> => {
  const data = await apiFetch("/api/tasks/");
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

export interface TaskPayload {
  raw_user_input: string;
  locale?: string;
  location?: Record<string, unknown>;
}

export const createTask = async (task: TaskPayload) => {
  return apiFetch("/api/tasks/", {
    method: "POST",
    body: JSON.stringify(task),
  });
};

export const normalizeLocation = (loc: any): string => {
  if (!loc) return "Ichalkaranji";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    return String(loc.area || loc.city || loc.address || loc.name || "Ichalkaranji");
  }
  return String(loc);
};

export const inferBetterCategoryFromText = (text: string, currentCategory: string, currentService: string) => {
  const t = (text || "").toLowerCase();
  
  if (t.includes("plumb") || t.includes("leak") || t.includes("tap") || t.includes("pipe") || t.includes("drain") || t.includes("bathroom")) {
    return { category: "Plumbing", service: "Plumbing / Leak repair" };
  }
  if (t.includes("cater") || t.includes("food") || t.includes("tiffin") || t.includes("lunch") || t.includes("dinner") || t.includes("veg")) {
    return { category: "Catering", service: "Catering / Food Services" };
  }
  if (t.includes("tailor") || t.includes("stitch") || t.includes("uniform") || t.includes("blouse") || t.includes("alteration")) {
    return { category: "Tailoring", service: "Tailoring / Uniforms" };
  }
  if (t.includes("machine") || t.includes("powerloom") || t.includes("motor") || t.includes("industrial") || t.includes("belt") || t.includes("repair")) {
    return { category: "Industrial Repair", service: "Machine Repair" };
  }
  if (t.includes("decor") || t.includes("wedding") || t.includes("stage")) {
    return { category: "Decor", service: "Decoration Services" };
  }
  
  if (currentCategory && currentCategory !== "General Seva" && currentCategory !== "General") {
    return { category: currentCategory, service: currentService || currentCategory };
  }
  
  return { category: "General Seva", service: "Service" };
};

const normalizeConfidence = (conf: any): number => {
  const num = Number(conf);
  if (isNaN(num)) return 90;
  if (num > 0 && num <= 1) return Math.round(num * 100);
  return Math.round(num);
};

export const mapTaskDetailToParsed = (task: any): ParsedTask => {
  const s = task?.structured_output || {};
  const rawInput = task?.raw_user_input || "";
  
  const inferred = inferBetterCategoryFromText(
    rawInput, 
    s.category || task?.category_name, 
    s.service_type || s.subcategory || task?.category_name
  );

  return {
    category: inferred.category,
    service_type: inferred.service,
    location: normalizeLocation(s.location || task?.location),
    urgency_level: s.urgency_level || task?.urgency || "medium",
    budget_range: s.budget_range || s.budget || "Not specified",
    estimated_time: s.estimated_time || s.eta || "Not specified",
    language: s.language || task?.locale || "English",
    confidence: normalizeConfidence(s.confidence ?? task?.ai_confidence ?? 90),
  };
};

export const mapBackendTaskToSevaRequest = (t: any): any => {
  let mappedStatus = "active";
  if (t.status === "pending_parse") mappedStatus = "pending";
  else if (t.status === "completed") mappedStatus = "completed";
  else if (t.status === "cancelled") mappedStatus = "cancelled";

  return {
    id: String(t.id),
    title: t.title || t.raw_user_input || "Untitled",
    category: t.category_name ?? "General Seva",
    status: mappedStatus,
    createdAt: t.created_at ? new Date(t.created_at).toLocaleDateString() : "just now",
    area: normalizeLocation(t.location),
    matchedVendors: 0,
    urgency: t.urgency || "medium",
  };
};
