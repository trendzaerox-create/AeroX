"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPublicHeroSectionsApi,
  getAdminHeroSectionsApi,
  getAdminHeroSectionByIdApi,
  createHeroSectionApi,
  updateHeroSectionApi,
  deleteHeroSectionApi,
} from "./heroSectionApi";

const initialState = {
  publicItems: [],
  adminItems: [],
  currentItem: null,
  loadingPublic: false,
  loadingAdmin: false,
  loadingCurrent: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

export const fetchPublicHeroSections = createAsyncThunk(
  "heroSections/fetchPublicHeroSections",
  async (_, thunkAPI) => {
    try {
      return await getPublicHeroSectionsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to load public hero sections"
      );
    }
  }
);

export const fetchAdminHeroSections = createAsyncThunk(
  "heroSections/fetchAdminHeroSections",
  async (_, thunkAPI) => {
    try {
      return await getAdminHeroSectionsApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to load admin hero sections"
      );
    }
  }
);

export const fetchAdminHeroSectionById = createAsyncThunk(
  "heroSections/fetchAdminHeroSectionById",
  async (id, thunkAPI) => {
    try {
      return await getAdminHeroSectionByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to load hero section"
      );
    }
  }
);

export const createHeroSection = createAsyncThunk(
  "heroSections/createHeroSection",
  async (payload, thunkAPI) => {
    try {
      return await createHeroSectionApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to create hero section"
      );
    }
  }
);

export const updateHeroSection = createAsyncThunk(
  "heroSections/updateHeroSection",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await updateHeroSectionApi(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to update hero section"
      );
    }
  }
);

export const deleteHeroSection = createAsyncThunk(
  "heroSections/deleteHeroSection",
  async (id, thunkAPI) => {
    try {
      return await deleteHeroSectionApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete hero section"
      );
    }
  }
);

const heroSectionSlice = createSlice({
  name: "heroSections",
  initialState,
  reducers: {
    clearHeroSectionError: (state) => {
      state.error = null;
    },
    clearCurrentHeroSection: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicHeroSections.pending, (state) => {
        state.loadingPublic = true;
        state.error = null;
      })
      .addCase(fetchPublicHeroSections.fulfilled, (state, action) => {
        state.loadingPublic = false;
        state.publicItems = action.payload || [];
      })
      .addCase(fetchPublicHeroSections.rejected, (state, action) => {
        state.loadingPublic = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminHeroSections.pending, (state) => {
        state.loadingAdmin = true;
        state.error = null;
      })
      .addCase(fetchAdminHeroSections.fulfilled, (state, action) => {
        state.loadingAdmin = false;
        state.adminItems = action.payload || [];
      })
      .addCase(fetchAdminHeroSections.rejected, (state, action) => {
        state.loadingAdmin = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminHeroSectionById.pending, (state) => {
        state.loadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchAdminHeroSectionById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchAdminHeroSectionById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.error = action.payload;
      })

      .addCase(createHeroSection.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createHeroSection.fulfilled, (state, action) => {
        state.creating = false;
        state.adminItems.unshift(action.payload);
      })
      .addCase(createHeroSection.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      .addCase(updateHeroSection.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateHeroSection.fulfilled, (state, action) => {
        state.updating = false;
        state.adminItems = state.adminItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.currentItem = action.payload;
      })
      .addCase(updateHeroSection.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(deleteHeroSection.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteHeroSection.fulfilled, (state, action) => {
        state.deleting = false;
        state.adminItems = state.adminItems.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteHeroSection.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearHeroSectionError, clearCurrentHeroSection } =
  heroSectionSlice.actions;

export default heroSectionSlice.reducer;