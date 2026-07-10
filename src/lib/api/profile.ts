import { apiFetch } from "./client";

export type CustomerProfile = {
  name: string;
  phone: string;
  role?: string;
  area?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
};

export const mapMeToProfile = (data: any): CustomerProfile => {
  let finalName = "";
  if (data?.full_name) finalName = data.full_name;
  else {
    const first = (data?.first_name || "").trim();
    const last = (data?.last_name || "").trim();
    const constructed = [first, last].filter(Boolean).join(" ");
    if (constructed) finalName = constructed;
    else if (data?.name) finalName = data.name;
    else if (data?.phone_number) finalName = `Customer ${data.phone_number.slice(-4)}`;
    else if (data?.phone) finalName = `Customer ${data.phone.slice(-4)}`;
    else finalName = "Customer";
  }

  return {
    name: finalName,
    phone: data?.phone_number || data?.phone || "",
    role: data?.role || "customer",
    area: data?.area || data?.city || "Ichalkaranji",
    is_superuser: data?.is_superuser || false,
    is_staff: data?.is_staff || false,
  };
};

export const getMe = async (): Promise<CustomerProfile> => {
  const data = await apiFetch("/api/users/me/");
  return mapMeToProfile(data);
};
