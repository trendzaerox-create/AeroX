// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   getPublicCategoriesApi,
//   getAdminCategoriesApi,
//   getAdminCategoryByIdApi,
//   createCategoryApi,
//   updateCategoryApi,
//   deleteCategoryApi,
// } from "./categoryApi";

// const initialState = {
//   publicCategories: [],
//   adminCategories: [],
//   selectedCategory: null,
//   loading: false,
//   submitting: false,
//   error: null,
//   successMessage: null,
// };

// export const fetchPublicCategories = createAsyncThunk(
//   "categories/fetchPublicCategories",
//   async (_, thunkAPI) => {
//     try {
//       return await getPublicCategoriesApi();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch categories"
//       );
//     }
//   }
// );

// export const fetchAdminCategories = createAsyncThunk(
//   "categories/fetchAdminCategories",
//   async (_, thunkAPI) => {
//     try {
//       return await getAdminCategoriesApi();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch admin categories"
//       );
//     }
//   }
// );

// export const fetchAdminCategoryById = createAsyncThunk(
//   "categories/fetchAdminCategoryById",
//   async (id, thunkAPI) => {
//     try {
//       return await getAdminCategoryByIdApi(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch category"
//       );
//     }
//   }
// );

// export const createCategory = createAsyncThunk(
//   "categories/createCategory",
//   async (payload, thunkAPI) => {
//     try {
//       return await createCategoryApi(payload);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to create category"
//       );
//     }
//   }
// );

// export const updateCategory = createAsyncThunk(
//   "categories/updateCategory",
//   async ({ id, payload }, thunkAPI) => {
//     try {
//       return await updateCategoryApi(id, payload);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to update category"
//       );
//     }
//   }
// );

// export const deleteCategory = createAsyncThunk(
//   "categories/deleteCategory",
//   async (id, thunkAPI) => {
//     try {
//       await deleteCategoryApi(id);
//       return id;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to delete category"
//       );
//     }
//   }
// );

// const categorySlice = createSlice({
//   name: "categories",
//   initialState,
//   reducers: {
//     clearCategoryState: (state) => {
//       state.error = null;
//       state.successMessage = null;
//     },
//     clearSelectedCategory: (state) => {
//       state.selectedCategory = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // public
//       .addCase(fetchPublicCategories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPublicCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.publicCategories = action.payload;
//       })
//       .addCase(fetchPublicCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // admin list
//       .addCase(fetchAdminCategories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.adminCategories = action.payload;
//       })
//       .addCase(fetchAdminCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // get one
//       .addCase(fetchAdminCategoryById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAdminCategoryById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedCategory = action.payload;
//       })
//       .addCase(fetchAdminCategoryById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // create
//       .addCase(createCategory.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(createCategory.fulfilled, (state, action) => {
//         state.submitting = false;
//         state.adminCategories.unshift(action.payload);
//         state.successMessage = "Category created successfully";
//       })
//       .addCase(createCategory.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload;
//       })

//       // update
//       .addCase(updateCategory.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.submitting = false;
//         state.selectedCategory = action.payload;
//         state.adminCategories = state.adminCategories.map((item) =>
//           item.id === action.payload.id ? action.payload : item
//         );
//         state.successMessage = "Category updated successfully";
//       })
//       .addCase(updateCategory.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload;
//       })

//       // delete
//       .addCase(deleteCategory.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.submitting = false;
//         state.adminCategories = state.adminCategories.filter(
//           (item) => item.id !== action.payload
//         );
//         state.successMessage = "Category deleted successfully";
//       })
//       .addCase(deleteCategory.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearCategoryState, clearSelectedCategory } = categorySlice.actions;
// export default categorySlice.reducer;






















import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPublicCategoriesApi,
  getAdminCategoriesApi,
  getAdminCategoryByIdApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "./categoryApi";

const initialState = {
  publicCategories: [],
  adminCategories: [],
  selectedCategory: null,
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

export const fetchPublicCategories = createAsyncThunk(
  "categories/fetchPublicCategories",
  async (_, thunkAPI) => {
    try {
      return await getPublicCategoriesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchAdminCategories = createAsyncThunk(
  "categories/fetchAdminCategories",
  async (_, thunkAPI) => {
    try {
      return await getAdminCategoriesApi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin categories"
      );
    }
  }
);

export const fetchAdminCategoryById = createAsyncThunk(
  "categories/fetchAdminCategoryById",
  async (id, thunkAPI) => {
    try {
      return await getAdminCategoryByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload, thunkAPI) => {
    try {
      return await createCategoryApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await updateCategoryApi(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, thunkAPI) => {
    try {
      await deleteCategoryApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.publicCategories = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchAdminCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.submitting = false;
        state.adminCategories.unshift(action.payload);
        state.successMessage = "Category created successfully";
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(updateCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedCategory = action.payload;
        state.adminCategories = state.adminCategories.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.successMessage = "Category updated successfully";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.submitting = false;
        state.adminCategories = state.adminCategories.filter(
          (item) => item.id !== action.payload
        );
        state.successMessage = "Category deleted successfully";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryState, clearSelectedCategory } =
  categorySlice.actions;

export default categorySlice.reducer;