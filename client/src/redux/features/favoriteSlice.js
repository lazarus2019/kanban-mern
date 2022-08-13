import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: [] };

export const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    setFavoritesList: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setFavoritesList } = favoriteSlice.actions;

export default favoriteSlice.reducer;
