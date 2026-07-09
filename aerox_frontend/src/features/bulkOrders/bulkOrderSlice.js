import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bulkOrderApi from "@/lib/bulkOrderApi";

export const createBulkOrderInquiry = createAsyncThunk(
  "bulkOrders/createInquiry",
  async (payload, { rejectWithValue }) => {
    try {
      return await bulkOrderApi.createBulkOrderInquiry(payload);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to send bulk order inquiry"
      );
    }
  }
);

export const fetchAdminBulkOrders = createAsyncThunk(
  "bulkOrders/fetchAdminAll",
  async (_, { rejectWithValue }) => {
    try {
      return await bulkOrderApi.fetchAdminBulkOrders();
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch bulk orders"
      );
    }
  }
);

export const fetchAdminBulkOrderById = createAsyncThunk(
  "bulkOrders/fetchAdminOne",
  async (id, { rejectWithValue }) => {
    try {
      return await bulkOrderApi.fetchAdminBulkOrderById(id);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch bulk order"
      );
    }
  }
);

export const updateAdminBulkOrderStatus = createAsyncThunk(
  "bulkOrders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await bulkOrderApi.updateAdminBulkOrderStatus(id, { status });
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update bulk order status"
      );
    }
  }
);

export const deleteAdminBulkOrder = createAsyncThunk(
  "bulkOrders/deleteAdminBulkOrder",
  async (id, { rejectWithValue }) => {
    try {
      await bulkOrderApi.deleteAdminBulkOrder(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete bulk order"
      );
    }
  }
);

const initialState = {
  items: [],
  selectedInquiry: null,
  submitSuccess: false,
  loading: false,
  submitting: false,
  error: null,
};

const bulkOrderSlice = createSlice({
  name: "bulkOrders",
  initialState,
  reducers: {
    clearBulkOrderError: (state) => {
      state.error = null;
    },
    clearBulkOrderSubmitState: (state) => {
      state.submitSuccess = false;
      state.error = null;
    },
    clearSelectedBulkOrder: (state) => {
      state.selectedInquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create inquiry
      .addCase(createBulkOrderInquiry.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(createBulkOrderInquiry.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        state.selectedInquiry = action.payload;
      })
      .addCase(createBulkOrderInquiry.rejected, (state, action) => {
        state.submitting = false;
        state.submitSuccess = false;
        state.error = action.payload;
      })

      // admin list
      .addCase(fetchAdminBulkOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBulkOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminBulkOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // admin single
      .addCase(fetchAdminBulkOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBulkOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInquiry = action.payload || null;
      })
      .addCase(fetchAdminBulkOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update status
      .addCase(updateAdminBulkOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminBulkOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;
        state.selectedInquiry = updated || null;

        state.items = state.items.map((item) =>
          item.id === updated.id ? updated : item
        );
      })
      .addCase(updateAdminBulkOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete bulk order
      .addCase(deleteAdminBulkOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminBulkOrder.fulfilled, (state, action) => {
        state.loading = false;

        state.items = state.items.filter((item) => item.id !== action.payload);

        if (state.selectedInquiry?.id === action.payload) {
          state.selectedInquiry = null;
        }
      })
      .addCase(deleteAdminBulkOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBulkOrderError,
  clearBulkOrderSubmitState,
  clearSelectedBulkOrder,
} = bulkOrderSlice.actions;

export default bulkOrderSlice.reducer;