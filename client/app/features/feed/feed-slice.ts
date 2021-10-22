import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  DefaultFeedPosts,
  DefaultStatus,
} from "../../../src/constants/constants";
import {
  FeedPosts,
  FeedResponse,
  Status,
} from "../../../src/interfaces/interfaces";
import { RootState } from "../../store";
import { CreateResponse, UpdateResponse } from "./feed-response";

export const createPost = createAsyncThunk(
  "feed/createPost",
  async (createResponse: CreateResponse, thunkAPI) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    console.log(token);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post<FeedResponse>(
      `${process.env.API_URL}/api/feed`,
      createResponse,
      config
    );

    return data;
  }
);

export const updatePost = createAsyncThunk(
  "feed/updatePost",
  async (updateResponse: UpdateResponse, thunkAPI) => {
    // Get post id getState()
    const state = thunkAPI.getState() as RootState;
    const id = state.feed.feedPosts.id;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put<FeedPosts>(
      `${process.env.API_URL}/api/feed/${id}`,
      updateResponse,
      config
    );

    return data;
  }
);

export interface FeedState {
  feedPosts: FeedResponse;
  status: Status;
}

const initialState: FeedState = {
  feedPosts: DefaultFeedPosts,
  status: DefaultStatus,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.status = DefaultStatus;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPost.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(createPost.fulfilled, (state, { payload }) => {
      state.status.isFetching = false;
      state.status.isSuccess = true;
      state.feedPosts = payload;
    });
    builder.addCase(createPost.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });

    builder.addCase(updatePost.pending, (state) => {
      state.status.isFetching = false;
    });

    builder.addCase(updatePost.fulfilled, (state, { payload }) => {
      state.status.isSuccess = true;
      state.status.isFetching = false;
      state.feedPosts = payload;
    });
    builder.addCase(updatePost.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });
  },
});

export default feedSlice.reducer;
