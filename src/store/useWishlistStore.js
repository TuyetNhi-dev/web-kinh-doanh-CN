import { create } from "zustand";

/**
 * Wishlist store.
 *
 * Keeps a Set of product IDs the current user has wishlisted.
 * Hydrates from /api/wishlist on first call to fetchWishlist().
 */
const useWishlistStore = create((set, get) => ({
  productIds: new Set(),
  loading:    false,
  hydrated:   false,

  fetchWishlist: async () => {
    if (get().hydrated || get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return;
      const data = await res.json();
      set({
        productIds: new Set(data.map((item) => item.product_id)),
        hydrated: true,
      });
    } catch {
      // silently ignore (user may not be logged in)
    } finally {
      set({ loading: false });
    }
  },

  isWishlisted: (productId) => get().productIds.has(productId),

  toggleWishlist: async (product) => {
    const { productIds } = get();
    const id = product.id;

    if (productIds.has(id)) {
      // Optimistically remove
      const next = new Set(productIds);
      next.delete(id);
      set({ productIds: next });

      try {
        await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      } catch {
        // Revert on error
        const revert = new Set(get().productIds);
        revert.add(id);
        set({ productIds: revert });
      }
    } else {
      // Optimistically add
      const next = new Set(productIds);
      next.add(id);
      set({ productIds: next });

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        if (res.status === 401) {
          // User not logged in — revert and signal caller
          const revert = new Set(get().productIds);
          revert.delete(id);
          set({ productIds: revert });
          return { needsLogin: true };
        }
      } catch {
        const revert = new Set(get().productIds);
        revert.delete(id);
        set({ productIds: revert });
      }
    }

    return { needsLogin: false };
  },
}));

export default useWishlistStore;
