import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uuid: null,
  name: null,
  avatar: null,
  permission: null,
  issuing_authority: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const user = action.payload;
      state.uuid = user.uuid;
      state.name = user.name;
      state.avatar = user.avatar;
      state.permission = user.permission;
      state.issuing_authority = user.issuing_authority;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
