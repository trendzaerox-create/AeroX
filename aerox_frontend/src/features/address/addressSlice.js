

"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createAddressApi,
  deleteAddressApi,
  fetchAddressesApi,
  setDefaultAddressApi,
  updateAddressApi,
} from "./addressApi";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await fetchAddressesApi();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to load addresses"
      );
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/create",
  async (payload, thunkAPI) => {
    try {
      return await createAddressApi(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to create address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/update",
  async (payload, thunkAPI) => {
    try {
      return await updateAddressApi(payload);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, thunkAPI) => {
    try {
      return await deleteAddressApi(id);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "address/default",
  async (id, thunkAPI) => {
    try {
      return await setDefaultAddressApi(id);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to set default address"
      );
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.submitting = false;

        const created = action.payload;

        if (created?.isDefault) {
          state.addresses = state.addresses.map((a) => ({
            ...a,
            isDefault: false,
          }));
        }

        state.addresses.unshift(created);
        state.successMessage = "Address added successfully";
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.submitting = false;
        const updated = action.payload;

        state.addresses = state.addresses.map((a) => {
          if (updated?.isDefault) {
            return {
              ...a,
              isDefault: a.id === updated.id,
            };
          }
          return a.id === updated.id ? updated : a;
        });

        state.successMessage = "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.submitting = false;
        state.addresses = state.addresses.filter((a) => a.id !== action.payload);
        state.successMessage = "Address deleted successfully";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // SET DEFAULT
      .addCase(setDefaultAddress.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.submitting = false;
        state.addresses = state.addresses.map((a) => ({
          ...a,
          isDefault: a.id === action.payload.id,
        }));
        state.successMessage = "Default address updated";
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressMessages } = addressSlice.actions;
export default addressSlice.reducer;