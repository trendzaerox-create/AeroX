
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./userApi";

/*
USER PROFILE
*/

export const loadProfile = createAsyncThunk(
  "user/loadProfile",
  async (_, thunkAPI) => {
    try {
      return await api.getProfile();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data, thunkAPI) => {
    try {
      return await api.updateProfile(data);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const removeAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, thunkAPI) => {
    try {
      return await api.deleteProfile();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

/*
ADMIN USERS
*/

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      return await api.getAllUsers();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const removeUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      await api.deleteUser(id);
      return id;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "admin/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      return await api.updateUser(id, data);
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e?.response?.data?.message || "Failed to update user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",

  initialState: {
    profile: null,
    users: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOAD PROFILE
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.submitting = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // REMOVE ACCOUNT
      .addCase(removeAccount.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeAccount.fulfilled, (state) => {
        state.submitting = false;
        state.profile = null;
        state.successMessage = "Account deleted successfully";
      })
      .addCase(removeAccount.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE USER
      .addCase(removeUser.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.successMessage = "User deleted successfully";
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // UPDATE USER BY ADMIN
      .addCase(updateUserByAdmin.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.submitting = false;

        const index = state.users.findIndex((u) => u.id === action.payload.id);

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        state.successMessage = "User updated successfully";
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserMessages, clearProfile } = userSlice.actions;
export default userSlice.reducer;