import { apiFetch } from "./client";
import { type Vendor } from "../sevaData";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTaskMatches = async (taskId: number | string): Promise<any[]> => {
  const fetchMatches = async () => {
    try {
      const data = await apiFetch(`/api/matching/tasks/${taskId}/matches/`);
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.matches)) return data.matches;
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.data)) return data.data;
      return [];
    } catch (err) {
      console.error("Match fetch error:", err);
      return [];
    }
  };

  let matches = await fetchMatches();
  if (matches.length > 0) return matches;

  await delay(1200);
  matches = await fetchMatches();
  if (matches.length > 0) return matches;

  await delay(1500);
  matches = await fetchMatches();
  return matches;
};

export const getTaskMatchesWithRetry = async (taskId: number | string): Promise<any[]> => {
  return getTaskMatches(taskId);
};

export const mapBackendMatchToVendor = (match: any): Vendor => {
  const v = match?.vendor || {};
  const phone = v.whatsapp_number || v.phone_number || "";
  return {
    id: String(v.id || match?.id || Date.now()),
    name: v.business_name || v.owner_name || "Unknown Vendor",
    category: v.category_name || "General",
    experience: "Verified",
    rating: Number(v.rating) || 4.5,
    reviews: 0,
    responseMin: 15,
    distanceKm: 2.5,
    available: v.availability_status === 'available',
    verified: v.verification_status === 'verified',
    trustScore: Number(match?.ai_score) || 80,
    matchScore: Math.round(Number(match?.total_score)) || match?.score || 0,
    tags: v.subcategory ? [v.subcategory] : [],
    area: v.area || v.city || "Ichalkaranji",
    completedJobs: 0,
    whatsapp: phone,
    phone: phone,
  };
};
