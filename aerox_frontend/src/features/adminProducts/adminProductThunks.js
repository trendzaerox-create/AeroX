

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/products");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/admin/products", productData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/admin/products/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Archive failed"
      );
    }
  }
);

export const addProductReview = createAsyncThunk(
  "adminProducts/addProductReview",
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/admin/products/${productId}/reviews`, data);
      return { productId, review: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Add review failed"
      );
    }
  }
);

export const updateProductReview = createAsyncThunk(
  "adminProducts/updateProductReview",
  async ({ productId, reviewId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/api/admin/products/${productId}/reviews/${reviewId}`,
        data
      );
      return { productId, review: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update review failed"
      );
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "adminProducts/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/products/${productId}/reviews/${reviewId}`);
      return { productId, reviewId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete review failed"
      );
    }
  }
);