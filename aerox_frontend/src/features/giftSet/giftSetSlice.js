

"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import giftSetApi from "./giftSetApi";

const GUEST_GIFTSET_STORAGE_KEY = "guest_giftset";

const emptySummary = {
  items: [],
  totalProducts: 0,
  subtotalInr: 0,
  discountPercent: 0,
  discountAmountInr: 0,
  finalTotalInr: 0,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readGuestSummary() {
  if (!isBrowser()) return emptySummary;

  try {
    const raw = localStorage.getItem(GUEST_GIFTSET_STORAGE_KEY);
    if (!raw) return emptySummary;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return emptySummary;

    return {
      ...emptySummary,
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return emptySummary;
  }
}

function writeGuestSummary(summary) {
  if (!isBrowser()) return;
  localStorage.setItem(GUEST_GIFTSET_STORAGE_KEY, JSON.stringify(summary));
}

function clearGuestSummaryStorage() {
  if (!isBrowser()) return;
  localStorage.removeItem(GUEST_GIFTSET_STORAGE_KEY);
}

function calculateSummary(items) {
  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce(
    (sum, item) => sum + (Number(item?.lineTotalInr) || 0),
    0
  );
  const totalProducts = safeItems.length;

  let discountPercent = 0;
  if (totalProducts === 2) discountPercent = 10;
  if (totalProducts >= 3 && totalProducts <= 5) discountPercent = 15;

  const discountAmountInr = Math.round(subtotal * (discountPercent / 100));
  const finalTotalInr = subtotal - discountAmountInr;

  return {
    items: safeItems,
    totalProducts,
    subtotalInr: subtotal,
    discountPercent,
    discountAmountInr,
    finalTotalInr,
  };
}

export const fetchGiftSetCart = createAsyncThunk(
  "giftSet/fetchGiftSetCart",
  async (_, thunkAPI) => {
    try {
      return await giftSetApi.getGiftSetCart();
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to fetch gift set cart",
        status: e?.response?.status || null,
      });
    }
  }
);

export const addGiftSetCartItem = createAsyncThunk(
  "giftSet/addGiftSetCartItem",
  async (payload, thunkAPI) => {
    try {
      return await giftSetApi.addGiftSetCartItem(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to add item",
        status: e?.response?.status || null,
      });
    }
  }
);

export const removeGiftSetCartItem = createAsyncThunk(
  "giftSet/removeGiftSetCartItem",
  async (itemId, thunkAPI) => {
    try {
      return await giftSetApi.removeGiftSetCartItem(itemId);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to remove item",
        status: e?.response?.status || null,
      });
    }
  }
);

export const clearGiftSetCart = createAsyncThunk(
  "giftSet/clearGiftSetCart",
  async (_, thunkAPI) => {
    try {
      return await giftSetApi.clearGiftSetCart();
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to clear cart",
        status: e?.response?.status || null,
      });
    }
  }
);

export const placeGiftSetOrder = createAsyncThunk(
  "giftSet/placeGiftSetOrder",
  async (payload, thunkAPI) => {
    try {
      return await giftSetApi.placeGiftSetOrder(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to place gift set order",
        status: e?.response?.status || null,
      });
    }
  }
);

export const createGiftSetRazorpayOrder = createAsyncThunk(
  "giftSet/createGiftSetRazorpayOrder",
  async (payload, thunkAPI) => {
    try {
      return await giftSetApi.createGiftSetRazorpayOrder(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to create Razorpay order",
        status: e?.response?.status || null,
      });
    }
  }
);

export const verifyGiftSetRazorpayPayment = createAsyncThunk(
  "giftSet/verifyGiftSetRazorpayPayment",
  async (payload, thunkAPI) => {
    try {
      return await giftSetApi.verifyGiftSetRazorpayPayment(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to verify payment",
        status: e?.response?.status || null,
      });
    }
  }
);

export const fetchMyGiftSetOrders = createAsyncThunk(
  "giftSet/fetchMyGiftSetOrders",
  async (_, thunkAPI) => {
    try {
      return await giftSetApi.fetchMyGiftSetOrders();
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to fetch gift set orders",
        status: e?.response?.status || null,
      });
    }
  }
);

export const fetchMyGiftSetOrderById = createAsyncThunk(
  "giftSet/fetchMyGiftSetOrderById",
  async (id, thunkAPI) => {
    try {
      return await giftSetApi.fetchMyGiftSetOrderById(id);
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message:
          e?.response?.data?.message || "Failed to fetch gift set order details",
        status: e?.response?.status || null,
      });
    }
  }
);

export const syncGuestGiftSetCart = createAsyncThunk(
  "giftSet/syncGuestGiftSetCart",
  async (_, thunkAPI) => {
    const guestSummary = readGuestSummary();
    const guestItems = guestSummary?.items || [];

    if (!guestItems.length) {
      return { skipped: true };
    }

    try {
      for (const item of guestItems) {
        await giftSetApi.addGiftSetCartItem({
          productId: item.productId,
          giftBoxId: item.giftBoxId,
        });
      }

      clearGuestSummaryStorage();
      const serverCart = await giftSetApi.getGiftSetCart();

      return {
        skipped: false,
        summary: serverCart?.summary || emptySummary,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue({
        message: e?.response?.data?.message || "Failed to sync guest gift set",
        status: e?.response?.status || null,
      });
    }
  }
);

const initialState = {
  summary: null,
  orders: [],
  selectedOrder: null,
  placedOrder: null,
  razorpayOrder: null,
  paymentVerified: null,
  loading: false,
  error: null,
};

const giftSetSlice = createSlice({
  name: "giftSet",
  initialState,
  reducers: {
    clearGiftSetError(state) {
      state.error = null;
    },
    clearPlacedGiftSetOrder(state) {
      state.placedOrder = null;
      state.razorpayOrder = null;
      state.paymentVerified = null;
    },
    clearSelectedGiftSetOrder(state) {
      state.selectedOrder = null;
    },
    loadGuestGiftSetCart(state) {
      state.summary = readGuestSummary();
      state.error = null;
    },
    addGuestGiftSetItem(state, action) {
      const item = action.payload;
      const currentItems = state.summary?.items || [];

      if (currentItems.some((i) => i.productId === item.productId)) {
        return;
      }

      if (currentItems.length >= 5) {
        state.error = "Maximum 5 products allowed in gift set";
        return;
      }

      const nextItems = [...currentItems, item];
      const nextSummary = calculateSummary(nextItems);

      state.summary = nextSummary;
      state.error = null;
      writeGuestSummary(nextSummary);
    },
    removeGuestGiftSetItem(state, action) {
      const removeKey = action.payload;
      const currentItems = state.summary?.items || [];

      const nextItems = currentItems.filter((item, index) => {
        const itemKey =
          item.cartItemId ??
          item.guestItemKey ??
          `${item.productId}-${item.giftBoxId}-${index}`;
        return itemKey !== removeKey;
      });

      const nextSummary = calculateSummary(nextItems);
      state.summary = nextSummary;
      state.error = null;
      writeGuestSummary(nextSummary);
    },
    clearGuestGiftSetCart(state) {
      state.summary = emptySummary;
      state.error = null;
      clearGuestSummaryStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGiftSetCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftSetCart.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.summary || emptySummary;
      })
      .addCase(fetchGiftSetCart.rejected, (state, action) => {
        state.loading = false;

        const status = action.payload?.status;
        if (status === 401 || status === 403 || !status) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Something went wrong";
        }
      })

      .addCase(addGiftSetCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGiftSetCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.summary || emptySummary;
      })
      .addCase(addGiftSetCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item";
      })

      .addCase(removeGiftSetCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeGiftSetCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.summary || emptySummary;
      })
      .addCase(removeGiftSetCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item";
      })

      .addCase(clearGiftSetCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearGiftSetCart.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload?.summary || emptySummary;
      })
      .addCase(clearGiftSetCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to clear cart";
      })

      .addCase(syncGuestGiftSetCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncGuestGiftSetCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload?.skipped) {
          state.summary = action.payload?.summary || emptySummary;
        }
      })
      .addCase(syncGuestGiftSetCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to sync guest gift set";
      })

      .addCase(placeGiftSetOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeGiftSetOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.placedOrder = action.payload;
        state.summary = emptySummary;
      })
      .addCase(placeGiftSetOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to place gift set order";
      })

      .addCase(createGiftSetRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGiftSetRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.razorpayOrder = action.payload;
      })
      .addCase(createGiftSetRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to create Razorpay order";
      })

      .addCase(verifyGiftSetRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyGiftSetRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentVerified = action.payload;
        state.summary = emptySummary;
      })
      .addCase(verifyGiftSetRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to verify payment";
      })

      .addCase(fetchMyGiftSetOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGiftSetOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchMyGiftSetOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch gift set orders";
      })

      .addCase(fetchMyGiftSetOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchMyGiftSetOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchMyGiftSetOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch gift set order details";
      });
  },
});

export const {
  clearGiftSetError,
  clearPlacedGiftSetOrder,
  clearSelectedGiftSetOrder,
  loadGuestGiftSetCart,
  addGuestGiftSetItem,
  removeGuestGiftSetItem,
  clearGuestGiftSetCart,
} = giftSetSlice.actions;

export default giftSetSlice.reducer;