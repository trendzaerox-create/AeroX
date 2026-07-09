import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  subscribeNewsletterApi,
  getNewsletterSubscribersApi,
  deleteNewsletterSubscriberApi,
} from "./newsletterApi";

export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (email, { rejectWithValue }) => {
    try {
      return await subscribeNewsletterApi(email);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewsletterSubscribers = createAsyncThunk(
  "newsletter/fetchSubscribers",
  async (token, { rejectWithValue }) => {
    try {
      return await getNewsletterSubscribersApi(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNewsletterSubscriber = createAsyncThunk(
  "newsletter/deleteSubscriber",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await deleteNewsletterSubscriberApi(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    subscribers: [],
    loading: false,
    success: false,
    message: "",
    error: "",
  },
  reducers: {
    clearNewsletterState: (state) => {
      state.success = false;
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = "";
        state.message = "";
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Subscribed successfully";
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Subscription failed";
      })

      .addCase(fetchNewsletterSubscribers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload || [];
      })
      .addCase(fetchNewsletterSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load subscribers";
      })

      .addCase(deleteNewsletterSubscriber.fulfilled, (state, action) => {
        state.subscribers = state.subscribers.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const { clearNewsletterState } = newsletterSlice.actions;
export default newsletterSlice.reducer;