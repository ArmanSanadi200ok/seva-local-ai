import { API_BASE } from "./client";

export const login = async (phone_number: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone_number, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    if (errorData && errorData.non_field_errors) {
      throw new Error(errorData.non_field_errors[0] || "Invalid credentials.");
    }
    throw new Error(`Login failed: ${res.statusText}`);
  }

  return res.json();
};

export const getAccessToken = () => localStorage.getItem("seva_access_token");
export const setAccessToken = (token: string) => localStorage.setItem("seva_access_token", token);
export const clearAccessToken = () => localStorage.removeItem("seva_access_token");

export const logout = () => {
  clearAccessToken();
  window.location.reload();
};
