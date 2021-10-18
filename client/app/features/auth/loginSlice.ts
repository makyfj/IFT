import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  DefaultStatus,
  DefaultUserInfo,
  URL,
} from "../../../src/constants/constants";
import { Status } from "../../../src/interfaces/interfaces";
import jwt_decode from "jwt-decode";
import { UserResponse } from "../../../src/interfaces/interfaces";

export interface LoginState {
  userInfo: UserResponse;
  status: Status;
  token: string;
}

const initialState: LoginState = {
  userInfo: DefaultUserInfo,
  status: DefaultStatus,
  token: "",
};

interface LoginResponse {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async ({ email, password }: LoginResponse) => {
    const { data } = await axios.post<{ token: string }>(
      `${URL}/api/auth/login`,
      {
        email,
        password,
      }
    );

    const decodedToken: UserResponse = jwt_decode(data.token);
    localStorage.setItem("token", data.token);

    return data.token;
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      const decodedToken: UserResponse = jwt_decode(payload);
      state.userInfo = decodedToken;
      state.token = payload;
      state.status.isSuccess = true;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(loginUser.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });
  },
});

export default loginSlice.reducer;
