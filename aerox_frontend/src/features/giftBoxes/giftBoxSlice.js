"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createGiftBoxApi,
  deleteGiftBoxApi,
  getActiveGiftBoxesApi,
  getAdminGiftBoxByIdApi,
  getAdminGiftBoxesApi,
  updateGiftBoxApi,
  updateGiftBoxStatusApi,
} from "./giftBoxApi";

const initialState = {
  publicGiftBoxes: [],
  adminGiftBoxes: [],
  currentGiftBox: null,
  loading: false,
  submitting: false,
  error: null,
  success: null,
};

export const fetchActiveGiftBoxes = createAsyncThunk(
  "giftBoxes/fetchActiveGiftBoxes",
  async (_, { rejectWithValue }) => {
    try {
      return await getActiveGiftBoxesApi();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch gift boxes"
      );
    }
  }
);

export const fetchAdminGiftBoxes = createAsyncThunk(
  "giftBoxes/fetchAdminGiftBoxes",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminGiftBoxesApi();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch admin gift boxes"
      );
    }
  }
);

export const fetchAdminGiftBoxById = createAsyncThunk(
  "giftBoxes/fetchAdminGiftBoxById",
  async (id, { rejectWithValue }) => {
    try {
      return await getAdminGiftBoxByIdApi(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch gift box"
      );
    }
  }
);

export const createGiftBox = createAsyncThunk(
  "giftBoxes/createGiftBox",
  async (payload, { rejectWithValue }) => {
    try {
      return await createGiftBoxApi(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create gift box"
      );
    }
  }
);

export const updateGiftBox = createAsyncThunk(
  "giftBoxes/updateGiftBox",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateGiftBoxApi({ id, payload });
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update gift box"
      );
    }
  }
);

export const updateGiftBoxStatus = createAsyncThunk(
  "giftBoxes/updateGiftBoxStatus",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      return await updateGiftBoxStatusApi({ id, active });
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update gift box status"
      );
    }
  }
);

export const deleteGiftBox = createAsyncThunk(
  "giftBoxes/deleteGiftBox",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGiftBoxApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete gift box"
      );
    }
  }
);

const giftBoxSlice = createSlice({
  name: "giftBoxes",
  initialState,
  reducers: {
    clearGiftBoxMessages(state) {
      state.error = null;
      state.success = null;
    },
    clearCurrentGiftBox(state) {
      state.currentGiftBox = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveGiftBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveGiftBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.publicGiftBoxes = action.payload || [];
      })
      .addCase(fetchActiveGiftBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminGiftBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGiftBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.adminGiftBoxes = action.payload || [];
      })
      .addCase(fetchAdminGiftBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminGiftBoxById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminGiftBoxById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGiftBox = action.payload;
      })
      .addCase(fetchAdminGiftBoxById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGiftBox.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createGiftBox.fulfilled, (state, action) => {
        state.submitting = false;
        state.success = "Gift box created successfully";
        state.adminGiftBoxes.unshift(action.payload);
      })
      .addCase(createGiftBox.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(updateGiftBox.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateGiftBox.fulfilled, (state, action) => {
        state.submitting = false;
        state.success = "Gift box updated successfully";
        state.currentGiftBox = action.payload;
        state.adminGiftBoxes = state.adminGiftBoxes.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateGiftBox.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(updateGiftBoxStatus.fulfilled, (state, action) => {
        state.success = "Gift box status updated";
        state.adminGiftBoxes = state.adminGiftBoxes.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(updateGiftBoxStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteGiftBox.fulfilled, (state, action) => {
        state.success = "Gift box deleted successfully";
        state.adminGiftBoxes = state.adminGiftBoxes.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteGiftBox.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearGiftBoxMessages, clearCurrentGiftBox } = giftBoxSlice.actions;
export default giftBoxSlice.reducer;