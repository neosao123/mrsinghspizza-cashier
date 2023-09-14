// User Reducer
// export default function userReducer(state = null, action) {
//   switch (action.type) {
//     case "LOGGD_IN_USER":
//       return {
//         ...state,
//         data: action.payload,
//       };
//     case "LOGOUT":
//       return action.payload;
//     default:
//       return state;
//   }
// }
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: {},
    token: ""
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        }
    },
});

export const { setUser, setToken } = userSlice.actions;

export default userSlice.reducer;
