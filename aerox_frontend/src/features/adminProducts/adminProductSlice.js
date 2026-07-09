


import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  updateProductReview,
  deleteProductReview,
} from "./adminProductThunks";

const adminProductSlice = createSlice({
  name: "adminProducts",

  initialState: {
    products: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearAdminProductMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products.unshift(action.payload);
        state.successMessage = "Product created successfully";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.submitting = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.successMessage = "Product archived successfully";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(addProductReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        const product = state.products.find((p) => p.id === action.payload.productId);
        if (product) {
          if (!Array.isArray(product.reviews)) product.reviews = [];
          product.reviews.unshift(action.payload.review);
        }
        state.successMessage = "Review added successfully";
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(updateProductReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        const product = state.products.find((p) => p.id === action.payload.productId);
        if (product && Array.isArray(product.reviews)) {
          product.reviews = product.reviews.map((r) =>
            r.id === action.payload.review.id ? action.payload.review : r
          );
        }
        state.successMessage = "Review updated successfully";
      })
      .addCase(updateProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(deleteProductReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.submitting = false;
        const product = state.products.find((p) => p.id === action.payload.productId);
        if (product && Array.isArray(product.reviews)) {
          product.reviews = product.reviews.filter(
            (r) => r.id !== action.payload.reviewId
          );
        }
        state.successMessage = "Review deleted successfully";
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminProductMessages } = adminProductSlice.actions;
export default adminProductSlice.reducer;