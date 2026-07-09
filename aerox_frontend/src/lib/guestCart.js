export const getGuestCart = () => {
  try {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("guest_cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const clearGuestCart = () => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem("guest_cart");
  } catch {}
};