


"use client";

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  fetchAdminOrdersApi,
  fetchMyOrderByIdApi,
  fetchMyOrdersApi,
  placeOrderApi,
  updateAdminOrderShipmentApi,
  updateAdminOrderStatusApi,
} from "./orderApi";

function getErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (payload, thunkAPI) => {
    try {
      return await placeOrderApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          error,
          "Failed to place order"
        )
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      return await fetchMyOrdersApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch orders"
        )
      );
    }
  }
);

export const fetchMyOrderById = createAsyncThunk(
  "orders/fetchMyOrderById",
  async (id, thunkAPI) => {
    try {
      return await fetchMyOrderByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch order details"
        )
      );
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
  async (_, thunkAPI) => {
    try {
      return await fetchAdminOrdersApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(
          error,
          "Failed to fetch admin orders"
        )
      );
    }
  }
);

export const updateAdminOrderStatus =
  createAsyncThunk(
    "orders/updateAdminOrderStatus",
    async (payload, thunkAPI) => {
      try {
        return await updateAdminOrderStatusApi(
          payload
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update order status"
          )
        );
      }
    }
  );

export const updateAdminOrderShipment =
  createAsyncThunk(
    "orders/updateAdminOrderShipment",
    async (payload, thunkAPI) => {
      try {
        return await updateAdminOrderShipmentApi(
          payload
        );
      } catch (error) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update shipment"
          )
        );
      }
    }
  );

const initialState = {
  orders: [],
  selectedOrder: null,
  adminOrders: [],
  placedOrder: null,

  loading: false,
  shipmentUpdating: false,

  error: null,
  shipmentError: null,
};

const orderSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    clearPlacedOrder(state) {
      state.placedOrder = null;
    },

    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },

    clearOrderError(state) {
      state.error = null;
      state.shipmentError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action) => {
          state.loading = false;
          state.placedOrder = action.payload;
        }
      )
      .addCase(
        placeOrder.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to place order";
        }
      )

      // Customer order list
      .addCase(
        fetchMyOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];
        }
      )
      .addCase(
        fetchMyOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch orders";
        }
      )

      // Customer order details
      .addCase(
        fetchMyOrderById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.selectedOrder = null;
        }
      )
      .addCase(
        fetchMyOrderById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedOrder =
            action.payload;
        }
      )
      .addCase(
        fetchMyOrderById.rejected,
        (state, action) => {
          state.loading = false;
          state.selectedOrder = null;
          state.error =
            action.payload ||
            "Failed to fetch order details";
        }
      )

      // Admin order list
      .addCase(
        fetchAdminOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchAdminOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.adminOrders = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];
        }
      )
      .addCase(
        fetchAdminOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch admin orders";
        }
      )

      // Admin update order status
      .addCase(
        updateAdminOrderStatus.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        updateAdminOrderStatus.fulfilled,
        (state, action) => {
          state.loading = false;

          const updatedOrder =
            action.payload;

          state.adminOrders =
            state.adminOrders.map((order) =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            );

          state.orders =
            state.orders.map((order) =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            );

          if (
            state.selectedOrder?.id ===
            updatedOrder.id
          ) {
            state.selectedOrder =
              updatedOrder;
          }
        }
      )
      .addCase(
        updateAdminOrderStatus.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to update order status";
        }
      )

      // Admin update shipment
      .addCase(
        updateAdminOrderShipment.pending,
        (state) => {
          state.shipmentUpdating = true;
          state.shipmentError = null;
          state.error = null;
        }
      )
      .addCase(
        updateAdminOrderShipment.fulfilled,
        (state, action) => {
          state.shipmentUpdating = false;
          state.shipmentError = null;

          const updatedOrder =
            action.payload;

          state.adminOrders =
            state.adminOrders.map((order) =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            );

          state.orders =
            state.orders.map((order) =>
              order.id === updatedOrder.id
                ? updatedOrder
                : order
            );

          if (
            state.selectedOrder?.id ===
            updatedOrder.id
          ) {
            state.selectedOrder =
              updatedOrder;
          }

          if (
            state.placedOrder?.id ===
            updatedOrder.id
          ) {
            state.placedOrder =
              updatedOrder;
          }
        }
      )
      .addCase(
        updateAdminOrderShipment.rejected,
        (state, action) => {
          state.shipmentUpdating = false;

          state.shipmentError =
            action.payload ||
            "Failed to update shipment";

          state.error =
            action.payload ||
            "Failed to update shipment";
        }
      );
  },
});

export const {
  clearPlacedOrder,
  clearSelectedOrder,
  clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;