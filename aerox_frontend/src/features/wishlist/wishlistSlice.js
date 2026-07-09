"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wishlistApi from "./wishlistApi";
import { getToken, removeToken } from "@/lib/tokenStorage";

function hasValidToken() {
  const token = getToken();
  return !!token && token !== "undefined" && token !== "null";
}

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      if (!hasValidToken()) {
        return [];
      }

      return await wishlistApi.getWishlist();
    } catch (err) {
      if (err?.message?.includes("401")) {
        removeToken();
        return [];
      }

      return thunkAPI.rejectWithValue({
        message: err.message || "Fetch wishlist failed",
      });
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      if (!hasValidToken()) {
        return thunkAPI.rejectWithValue({
          message: "Please login to add wishlist",
        });
      }

      return await wishlistApi.addToWishlist(productId);
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.message || "Add wishlist failed",
      });
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      if (!hasValidToken()) {
        return [];
      }

      return await wishlistApi.removeFromWishlist(productId);
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.message || "Remove wishlist failed",
      });
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, thunkAPI) => {
    const state = thunkAPI.getState();
    const exists = state.wishlist.items.some(
      (item) => Number(item.productId) === Number(productId)
    );

    if (exists) {
      return await thunkAPI.dispatch(removeFromWishlist(productId)).unwrap();
    }

    return await thunkAPI.dispatch(addToWishlist(productId)).unwrap();
  }
);

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  initialized: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlistError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalItems = state.items.length;
        state.loading = false;
        state.initialized = true;
        state.error = null;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload?.message || "Fetch wishlist failed";
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalItems = state.items.length;
        state.loading = false;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalItems = state.items.length;
        state.loading = false;
      })

      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalItems = state.items.length;
        state.loading = false;
      })

      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Wishlist action failed";
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;