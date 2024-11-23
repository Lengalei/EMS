import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {},
  reducers: {
    setUsers: () => {},
    resetUsers: () => {},
  },
});

export default userSlice.reducer;
