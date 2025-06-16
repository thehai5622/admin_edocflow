import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uuid: null,
  name: null,
  avatar: null,
  gender: null,
  birth_day: null,
  phone: null,
  email: null,
  created_at: null,
  updated_at: null,
  status: null,
  issuing_authority: null, // object: { uuid, name }
  permission: null,        // object: { uuid, name }
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
      state.gender = user.gender;
      state.birth_day = user.birth_day;
      state.phone = user.phone;
      state.email = user.email;
      state.created_at = user.created_at;
      state.updated_at = user.updated_at;
      state.status = user.status;
      state.issuing_authority = user.issuing_authority;
      state.permission = user.permission;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
