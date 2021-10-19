import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import localForage from "localforage";

import {
  DefaultStatus,
  DefaultUserInfo,
  URL,
} from "../../../src/constants/constants";
import { Status } from "../../../src/interfaces/interfaces";
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

    const decodedToken = jwtDecode<JwtPayload>(data.token);

    // It stores the information in LocalForage storage
    try {
      await localForage.setItem("token", data.token);
      await localForage.setItem("userInfo", decodedToken);
    } catch (err) {
      console.log(err);
    }

    return data.token;
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearState: (state) => {
      state.status = DefaultStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      // It stores the information in redux store
      const decodedToken = jwtDecode<UserResponse>(payload);
      state.userInfo = decodedToken;
      state.token = payload;
      state.status.isSuccess = true;
      state.status.isFetching = false;
    });

    builder.addCase(loginUser.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });
  },
});

export const { clearState } = loginSlice.actions;
export default loginSlice.reducer;