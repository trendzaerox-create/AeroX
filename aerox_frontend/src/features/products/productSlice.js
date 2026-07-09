

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

/* ---------------- FETCH PRODUCT LIST ---------------- */

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (categoryId, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      params.set("page", "0");
      params.set("size", "50");

      if (categoryId) {
        params.set("categoryId", String(categoryId));
      }

      const res = await api.get(`/api/products?${params.toString()}`);

      const data = res.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.content)) return data.content;
      if (Array.isArray(data?.products)) return data.products;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/* ---------------- FETCH SINGLE PRODUCT ---------------- */

export const fetchProduct = createAsyncThunk(
  "products/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

/* ---------------- SLICE ---------------- */

const productSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    product: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;