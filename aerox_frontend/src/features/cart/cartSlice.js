


// src/features/cart/cartSlice.js

"use client";

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import cartApi from "./cartApi";

import {
  addGuestCartItem,
  buildMergePayloadFromGuestCart,
  clearGuestCart,
  getGuestCart,
  saveGuestCart,
} from "./cartUtils";

import {
  getToken,
  removeToken,
} from "@/lib/tokenStorage";

/* =========================================
   TOKEN CHECK
========================================= */

function hasValidToken() {
  if (typeof window === "undefined") {
    return false;
  }

  const token = getToken();

  if (
    !token ||
    token === "undefined" ||
    token === "null"
  ) {
    return false;
  }

  return true;
}

/* =========================================
   GUEST CART RESPONSE
========================================= */

function buildGuestCartResponse() {
  const guestItems = getGuestCart();

  let subtotal = 0;
  let totalItems = 0;

  const items = guestItems.map(
    (item, index) => {
      const unitPrice = Number(
        item.unitPrice || 0
      );

      const quantity = Number(
        item.quantity || 1
      );

      const lineTotal =
        unitPrice * quantity;

      subtotal += lineTotal;

      totalItems += quantity;

      return {
        itemId: `guest-${index}`,
        productId: item.productId,
        title: item.title || "",
        quantity,
        unitPrice,
        lineTotal,
        images: item.image
          ? [item.image]
          : [],
        stock: 999,
      };
    }
  );

  return {
    cartId: null,
    items,
    subtotal,
    totalItems,
    isGuest: true,
  };
}

/* =========================================
   FETCH CART
========================================= */

export const fetchCart =
  createAsyncThunk(
    "cart/fetchCart",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          return buildGuestCartResponse();
        }

        return await cartApi.getCart();
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   ADD TO CART
========================================= */

export const addToCart =
  createAsyncThunk(
    "cart/addToCart",
    async (
      { product, quantity = 1 },
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        quantity = Math.max(
          1,
          quantity
        );

        if (!hasValidToken()) {
          addGuestCartItem(
            product,
            quantity
          );

          return buildGuestCartResponse();
        }

        return await cartApi.addToCart({
          productId:
            product.id,
          quantity,
        });
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          addGuestCartItem(
            product,
            quantity
          );

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   UPDATE CART ITEM
========================================= */

export const updateCartItem =
  createAsyncThunk(
    "cart/updateCartItem",
    async (
      { itemId, quantity },
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        quantity = Math.max(
          1,
          quantity
        );

        if (!hasValidToken()) {
          const guest =
            getGuestCart();

          const index = Number(
            String(itemId).replace(
              "guest-",
              ""
            )
          );

          if (guest[index]) {
            guest[index].quantity =
              quantity;
          }

          saveGuestCart(
            guest
          );

          return buildGuestCartResponse();
        }

        return await cartApi.updateCartItem(
          itemId,
          {
            quantity,
          }
        );
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   REMOVE CART ITEM
========================================= */

export const removeCartItem =
  createAsyncThunk(
    "cart/removeCartItem",
    async (
      itemId,
      thunkAPI
    ) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          const guest =
            getGuestCart();

          const index = Number(
            String(itemId).replace(
              "guest-",
              ""
            )
          );

          const filtered =
            guest.filter(
              (_, i) =>
                i !== index
            );

          saveGuestCart(
            filtered
          );

          return buildGuestCartResponse();
        }

        return await cartApi.removeCartItem(
          itemId
        );
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   CLEAR CART
========================================= */

export const clearCart =
  createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          clearGuestCart();

          return buildGuestCartResponse();
        }

        return await cartApi.clearCart();
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          clearGuestCart();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   MERGE GUEST CART
========================================= */

export const mergeGuestCartAfterLogin =
  createAsyncThunk(
    "cart/mergeGuestCartAfterLogin",
    async (_, thunkAPI) => {
      try {
        if (
          thunkAPI.signal.aborted
        ) {
          return;
        }

        if (!hasValidToken()) {
          return buildGuestCartResponse();
        }

        const guestItems =
          getGuestCart();

        if (
          !guestItems.length
        ) {
          return await cartApi.getCart();
        }

        const payload =
          buildMergePayloadFromGuestCart();

        const merged =
          await cartApi.mergeCart(
            payload
          );

        clearGuestCart();

        return merged;
      } catch (err) {
        if (
          err?.response?.status === 401
        ) {
          removeToken();

          return buildGuestCartResponse();
        }

        return thunkAPI.rejectWithValue(
          err?.response?.data || {
            message:
              err.message,
          }
        );
      }
    }
  );

/* =========================================
   INITIAL STATE
========================================= */

const initialState = {
  cartId: null,
  items: [],
  subtotal: 0,
  totalItems: 0,
  drawerOpen: false,
  loading: false,
  initialized: false,
  error: null,
};

/* =========================================
   HELPERS
========================================= */

function applyCartState(
  state,
  action
) {
  const payload =
    action.payload || {};

  state.cartId =
    payload.cartId || null;

  state.items =
    payload.items || [];

  state.subtotal =
    payload.subtotal || 0;

  state.totalItems =
    payload.totalItems || 0;

  state.loading = false;

  state.initialized = true;

  state.error = null;
}

function applyPendingState(
  state
) {
  state.loading = true;

  state.error = null;
}

function applyErrorState(
  state,
  action,
  fallback
) {
  state.loading = false;

  state.initialized = true;

  state.error =
    action.payload?.message ||
    action.payload?.error ||
    fallback;
}

/* =========================================
   SLICE
========================================= */

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    openCartDrawer(
      state
    ) {
      state.drawerOpen = true;
    },

    closeCartDrawer(
      state
    ) {
      state.drawerOpen = false;
    },

    toggleCartDrawer(
      state
    ) {
      state.drawerOpen =
        !state.drawerOpen;
    },

    clearCartError(
      state
    ) {
      state.error = null;
    },
  },

  extraReducers: (
    builder
  ) => {
    builder

      /* ===============================
         FETCH CART
      ============================== */

      .addCase(
        fetchCart.pending,
        applyPendingState
      )

      .addCase(
        fetchCart.fulfilled,
        applyCartState
      )

      .addCase(
        fetchCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Fetch cart failed"
          );
        }
      )

      /* ===============================
         ADD TO CART
      ============================== */

      .addCase(
        addToCart.pending,
        applyPendingState
      )

      .addCase(
        addToCart.fulfilled,
        applyCartState
      )

      .addCase(
        addToCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Add to cart failed"
          );
        }
      )

      /* ===============================
         UPDATE CART
      ============================== */

      .addCase(
        updateCartItem.pending,
        applyPendingState
      )

      .addCase(
        updateCartItem.fulfilled,
        applyCartState
      )

      .addCase(
        updateCartItem.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Update cart failed"
          );
        }
      )

      /* ===============================
         REMOVE CART ITEM
      ============================== */

      .addCase(
        removeCartItem.pending,
        applyPendingState
      )

      .addCase(
        removeCartItem.fulfilled,
        applyCartState
      )

      .addCase(
        removeCartItem.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Remove cart item failed"
          );
        }
      )

      /* ===============================
         CLEAR CART
      ============================== */

      .addCase(
        clearCart.pending,
        applyPendingState
      )

      .addCase(
        clearCart.fulfilled,
        applyCartState
      )

      .addCase(
        clearCart.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Clear cart failed"
          );
        }
      )

      /* ===============================
         MERGE GUEST CART
      ============================== */

      .addCase(
        mergeGuestCartAfterLogin.pending,
        applyPendingState
      )

      .addCase(
        mergeGuestCartAfterLogin.fulfilled,
        applyCartState
      )

      .addCase(
        mergeGuestCartAfterLogin.rejected,
        (
          state,
          action
        ) => {
          applyErrorState(
            state,
            action,
            "Merge cart failed"
          );
        }
      );
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;