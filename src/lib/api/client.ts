export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

import { getAccessToken, clearAccessToken } from "./auth";

export const getAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) return { "Content-Type": "application/json" };
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      clearAccessToken();
      throw new Error("Unauthorized: Please login.");
    }
    
    let msg = `API error: ${res.statusText}`;
    try {
      const errData = await res.json();
      msg = errData.detail || errData.message || errData.non_field_errors?.[0] || msg;
    } catch (e) {
      // Ignore parse error
    }
    throw new Error(msg);
  }
  return res.json();
};
