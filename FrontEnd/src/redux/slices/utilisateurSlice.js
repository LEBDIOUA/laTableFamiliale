import { createSlice } from "@reduxjs/toolkit";
import API from "../../handlers/apiService";
import { loginRequest, loginSuccess, loginFailure, logout } from "../actions/utilisateurActions";

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await API.login(email, password);
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};

const initialState = {
  utilisateur: [],
  loading: false,
  error: null,
};

const utilisateurSlice = createSlice({
  name: "utilisateur",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest, (state) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(loginSuccess, (state, action) => {
        console.log("loginSuccess");
        return {
          ...state,
          utilisateur: action.payload,
          loading: false,
        };
      })
      .addCase(loginFailure, (state, action) => {
        console.log("loginFailure");
        return {
          ...state,
          loading: false,
          error: action.error,
        };
      })
      .addCase(logout, () => {
        return {
          utilisateur: null,
          loading: false,
          error: null,
        };
      });
  },
});

export const { actions } = utilisateurSlice;
export default utilisateurSlice.reducer;
