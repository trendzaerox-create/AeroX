import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/tokenStorage";

const wishlistApi = {
  getWishlist() {
    return apiFetch("/api/wishlist", {
      method: "GET",
      token: getToken(),
    });
  },

  addToWishlist(productId) {
    return apiFetch(`/api/wishlist/${productId}`, {
      method: "POST",
      token: getToken(),
    });
  },

  removeFromWishlist(productId) {
    return apiFetch(`/api/wishlist/${productId}`, {
      method: "DELETE",
      token: getToken(),
    });
  },

  checkWishlist(productId) {
    return apiFetch(`/api/wishlist/check/${productId}`, {
      method: "GET",
      token: getToken(),
    });
  },
};

export default wishlistApi;