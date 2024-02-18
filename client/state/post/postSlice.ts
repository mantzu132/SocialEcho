// import { fetchPosts } from "../../api";
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// interface PostState {
//   title: string;
//   description: string;
// }
// const initialState: PostState[] = [];
//
// const postsSlice = createSlice({
//   name: "posts", // Name of the slice
//   initialState,
//   reducers: {
//     // Action to handle creating a new post
//     create: (state, action) => {
//       state.push(action.payload); // Add the new post to the state
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(
//         getPostsAsync.fulfilled,
//         (_state, action: PayloadAction<PostState[]>) => {
//           return action.payload;
//         },
//       )
//       .addCase(getPostsAsync.rejected, () => {
//         console.log("GETPOSTS PROBLEM!");
//       });
//   },
// });
//
// export const getPostsAsync = createAsyncThunk(
//   "posts/getPostsAsync",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await fetchPosts();
//       return data; // Return the fetched posts as the action payload
//     } catch (error) {
//       if (error instanceof Error) {
//         return rejectWithValue(error);
//       }
//     }
//   },
// );
//
// Export the actions generated by `createSlice`
// export const { create } = postsSlice.actions;
//
// // Export the reducer
// export default postsSlice.reducer;
