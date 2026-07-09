

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/lib/apiClient";

// export const createProduct = createAsyncThunk(
//   "admin/createProduct",
//   async (productData, { rejectWithValue }) => {
//     try {

//       const res = await api.post(
//         "/api/admin/products",
//         productData
//       );

//       return res.data;

//     } catch (err) {

//       return rejectWithValue(err.response?.data || "Create failed");

//     }
//   }
// );


// export const updateProduct = createAsyncThunk(
//   "admin/updateProduct",
//   async ({ id, data }, { rejectWithValue }) => {

//     try {

//       const res = await api.put(
//         `/api/admin/products/${id}`,
//         data
//       );

//       return res.data;

//     } catch (err) {

//       return rejectWithValue(err.response?.data || "Update failed");

//     }

//   }
// );


// export const deleteProduct = createAsyncThunk(
//   "admin/deleteProduct",
//   async (id, { rejectWithValue }) => {

//     try {

//       await api.delete(`/api/admin/products/${id}`);

//       return id;

//     } catch (err) {

//       return rejectWithValue(err.response?.data || "Delete failed");

//     }

//   }
// );












import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

const getErrorPayload = (err, fallbackMessage) => {
  return err.response?.data || err.message || fallbackMessage;
};

export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async ({ page = 0, size = 100 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/products", {
        params: { page, size },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Fetch products failed"));
    }
  }
);

export const fetchAdminProduct = createAsyncThunk(
  "admin/fetchAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/admin/products/${id}`);

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Fetch product failed"));
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/admin/products", productData);

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Create failed"));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/admin/products/${id}`, data);

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Update failed"));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/products/${id}`);

      return id;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Delete failed"));
    }
  }
);

export const addProductReview = createAsyncThunk(
  "admin/addProductReview",
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `/api/admin/products/${productId}/reviews`,
        data
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Review add failed"));
    }
  }
);

export const updateProductReview = createAsyncThunk(
  "admin/updateProductReview",
  async ({ productId, reviewId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/api/admin/products/${productId}/reviews/${reviewId}`,
        data
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Review update failed"));
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "admin/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(
        `/api/admin/products/${productId}/reviews/${reviewId}`
      );

      return { productId, reviewId };
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Review delete failed"));
    }
  }
);