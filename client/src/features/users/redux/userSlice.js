import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsers,
  updateUserStatus,
  updateUser,
} from "../services/usersService";
const initialState = {
  list: [],
  loading: false,
  error: null,
  filter: "active", // active, inactive, deleted
  search: "",
  page: 1,
  pages: 1,
  limit: 10,
  cache: {},
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ status, search, page, limit }, { getState, rejectWithValue }) => {
    const { users } = getState();

    const cacheKey = JSON.stringify({ status, search, page, limit });

    if (users.cache[cacheKey]) {
      return users.cache[cacheKey];
    }

    try {
      const response = await getAllUsers({ status, search, page, limit });

      const payload = {
        users: response.users,
        pagination: response.pagination,
        cacheKey,
      };

      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changeSystemStatus = createAsyncThunk(
  "users/changeSystemStatus",
  async ({ userId, action }, { rejectWithValue }) => {
    try {
      const response = await updateUserStatus(userId, action);
      return { userId, action, user: response.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateUserThunk = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await updateUser(userId, userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
      state.page = 1;
      state.cache = {};
    },

    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
      state.cache = {};
    },

    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
      state.page = 1;
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        const { status, search, page, limit } = action.meta.arg;
        const cacheKey = JSON.stringify({ status, search, page, limit });

        if (!state.cache[cacheKey]) {
          state.loading = true;
        }

        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const { users, pagination, cacheKey } = action.payload;
        const { page } = action.meta.arg;

        if (page === state.page) {
          state.list = users;
          state.pages = pagination.pages;
        }

        if (!state.cache[cacheKey]) {
          state.cache[cacheKey] = action.payload;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error?.message || "Failed to fetch users";
      })

      .addCase(changeSystemStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;

        const matchesFilter =
          (state.filter === "active" &&
            updatedUser.active &&
            !updatedUser.isDeleted) ||
          (state.filter === "inactive" &&
            !updatedUser.active &&
            !updatedUser.isDeleted) ||
          (state.filter === "deleted" && updatedUser.isDeleted);

        state.list = state.list.filter((user) => user._id !== updatedUser._id);

        if (matchesFilter) {
          state.list.unshift(updatedUser);
        }
      })

      .addCase(changeSystemStatus.pending, (state, action) => {
        // optimistic update: toggle status immediately
        const userId = action.meta.arg.userId;
        const user = state.list.find((u) => u._id === userId);

        if (user) {
          // save previous status for rollback if needed
          user.previousActiveStatus = user.active;
          // ui change immediately
          user.active = !user.active;
        }
      })
      .addCase(changeSystemStatus.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        const user = state.list.find((u) => u._id === userId);

        if (user && user.previousActiveStatus !== undefined) {
          user.active = user.previousActiveStatus;
          alert(
            "Failed to change user status: " +
              (action.payload || action.error.message),
          );
        }
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const index = state.list.findIndex(
          (user) => user._id === updatedUser._id,
        );
        if (index !== -1) {
          state.list[index] = updatedUser;
        }

        Object.keys(state.cache).forEach((key) => {
          const cachedData = state.cache[key];

          if (cachedData && Array.isArray(cachedData.users)) {
            const i = cachedData.users.findIndex(
              (user) => user._id === updatedUser._id,
            );

            if (i !== -1) {
              state.cache[key].users[i] = updatedUser;
            }
          }
        });
      });
  },
});

export const { setFilter, setSearch, setPage, setLimit } = userSlice.actions;

export default userSlice.reducer;
