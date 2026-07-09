"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "@/lib/apiClient";

/* =========================
   PUBLIC API
========================= */

export const fetchActiveBrandShowcases = createAsyncThunk(
  "brandShowcases/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/api/brand-showcases");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load brand showcases"
      );
    }
  }
);

/* =========================
   ADMIN API
========================= */

export const fetchAdminBrandShowcases = createAsyncThunk(
  "brandShowcases/fetchAdminAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/api/admin/brand-showcases");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load admin brand showcases"
      );
    }
  }
);

export const fetchAdminBrandShowcaseById = createAsyncThunk(
  "brandShowcases/fetchAdminOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/api/admin/brand-showcases/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load brand showcase"
      );
    }
  }
);

export const createBrandShowcase = createAsyncThunk(
  "brandShowcases/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/api/admin/brand-showcases", payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create brand showcase"
      );
    }
  }
);

export const updateBrandShowcase = createAsyncThunk(
  "brandShowcases/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/api/admin/brand-showcases/${id}`, payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update brand showcase"
      );
    }
  }
);

export const deleteBrandShowcase = createAsyncThunk(
  "brandShowcases/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/admin/brand-showcases/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete brand showcase"
      );
    }
  }
);

export const uploadBrandShowcaseModelImage = createAsyncThunk(
  "brandShowcases/uploadModelImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post(
        "/api/admin/brand-showcases/upload-model-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data; // { imageUrl, cloudinaryPublicId }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

/* =========================
   SLICE
========================= */

const initialState = {
  publicItems: [],
  adminItems: [],
  selectedItem: null,

  loadingPublic: false,
  loadingAdmin: false,
  loadingSelected: false,
  saving: false,
  deleting: false,
  uploading: false,

  uploadResult: null,
  error: null,
  successMessage: null,
};

const brandShowcaseSlice = createSlice({
  name: "brandShowcases",
  initialState,
  reducers: {
    clearBrandShowcaseState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSelectedBrandShowcase: (state) => {
      state.selectedItem = null;
    },
    clearUploadResult: (state) => {
      state.uploadResult = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* PUBLIC */
      .addCase(fetchActiveBrandShowcases.pending, (state) => {
        state.loadingPublic = true;
        state.error = null;
      })
      .addCase(fetchActiveBrandShowcases.fulfilled, (state, action) => {
        state.loadingPublic = false;
        state.publicItems = action.payload || [];
      })
      .addCase(fetchActiveBrandShowcases.rejected, (state, action) => {
        state.loadingPublic = false;
        state.error = action.payload;
      })

      /* ADMIN LIST */
      .addCase(fetchAdminBrandShowcases.pending, (state) => {
        state.loadingAdmin = true;
        state.error = null;
      })
      .addCase(fetchAdminBrandShowcases.fulfilled, (state, action) => {
        state.loadingAdmin = false;
        state.adminItems = action.payload || [];
      })
      .addCase(fetchAdminBrandShowcases.rejected, (state, action) => {
        state.loadingAdmin = false;
        state.error = action.payload;
      })

      /* ADMIN GET ONE */
      .addCase(fetchAdminBrandShowcaseById.pending, (state) => {
        state.loadingSelected = true;
        state.error = null;
      })
      .addCase(fetchAdminBrandShowcaseById.fulfilled, (state, action) => {
        state.loadingSelected = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchAdminBrandShowcaseById.rejected, (state, action) => {
        state.loadingSelected = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createBrandShowcase.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBrandShowcase.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage = "Brand showcase created successfully";
        state.adminItems.unshift(action.payload);
      })
      .addCase(createBrandShowcase.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateBrandShowcase.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBrandShowcase.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage = "Brand showcase updated successfully";
        state.selectedItem = action.payload;
        state.adminItems = state.adminItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateBrandShowcase.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteBrandShowcase.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteBrandShowcase.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = "Brand showcase deleted successfully";
        state.adminItems = state.adminItems.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBrandShowcase.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      /* UPLOAD */
      .addCase(uploadBrandShowcaseModelImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadBrandShowcaseModelImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadResult = action.payload;
      })
      .addCase(uploadBrandShowcaseModelImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBrandShowcaseState,
  clearSelectedBrandShowcase,
  clearUploadResult,
} = brandShowcaseSlice.actions;

export default brandShowcaseSlice.reducer;





