import { apiFetch } from "./client";

export const getVendorsAdmin = async (filters: any = {}) => {
  const q = new URLSearchParams(filters).toString();
  return apiFetch(`/api/vendors/admin/?${q}`);
};
export const getPendingVendors = async () => apiFetch("/api/vendors/admin/pending/");
export const getVendorDetailAdmin = async (id: number | string) => apiFetch(`/api/vendors/admin/${id}/`);
export const approveVendor = async (id: number | string) => apiFetch(`/api/vendors/admin/${id}/approve/`, { method: "POST" });
export const rejectVendor = async (id: number | string) => apiFetch(`/api/vendors/admin/${id}/reject/`, { method: "POST" });
export const suspendVendor = async (id: number | string) => apiFetch(`/api/vendors/admin/${id}/suspend/`, { method: "POST" });
export const reactivateVendor = async (id: number | string) => apiFetch(`/api/vendors/admin/${id}/reactivate/`, { method: "POST" });
export const setVendorAvailability = async (id: number | string, status: string) => 
  apiFetch(`/api/vendors/admin/${id}/set_availability/`, { method: "POST", body: JSON.stringify({ status }) });

export const getTasksAdmin = async (filters: any = {}) => {
  const q = new URLSearchParams(filters).toString();
  return apiFetch(`/api/tasks/admin/?${q}`);
};
export const getTaskDetailAdmin = async (id: number | string) => apiFetch(`/api/tasks/admin/${id}/`);
export const rerunTaskMatching = async (id: number | string) => apiFetch(`/api/tasks/admin/${id}/rerun_matching/`, { method: "POST" });
export const setTaskStatus = async (id: number | string, status: string) => 
  apiFetch(`/api/tasks/admin/${id}/set_status/`, { method: "PATCH", body: JSON.stringify({ status }) });
