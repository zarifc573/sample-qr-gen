// redux/UserSlice.js or redux/UserSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    clientInfo: null,
  },
  reducers: {
    setClientLoginInfo: (state, action) => {
      state.clientInfo = action.payload;
    },
    clearClientLoginInfo: (state) => {
      state.clientInfo = null;
    },
  },
});

export const { setClientLoginInfo, clearClientLoginInfo } = userSlice.actions;
export default userSlice.reducer;
