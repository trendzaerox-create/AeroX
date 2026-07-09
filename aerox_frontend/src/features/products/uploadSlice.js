
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

export const uploadProductImages = createAsyncThunk(
  "products/uploadImages",
  async (files, { rejectWithValue }) => {
    try {
      const uploadedResults = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);


        const res = await api.post("/api/admin/products/upload", formData);

        uploadedResults.push(res.data.imageUrl);
      }

      return uploadedResults;
    } catch (err) {
      console.error("Image upload failed:", err?.response?.data || err.message);
      return rejectWithValue("Upload failed");
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",

  initialState: {
    images: [],
    loading: false,
  },

  reducers: {
    clearImages: (state) => {
      state.images = [];
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImages.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...state.images, ...action.payload];
      })
      .addCase(uploadProductImages.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearImages, setImages } = uploadSlice.actions;
export default uploadSlice.reducer;