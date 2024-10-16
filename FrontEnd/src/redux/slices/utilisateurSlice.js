import { createSlice } from "@reduxjs/toolkit";
import API from "../../handlers/apiService";
import { loginRequest, loginSuccess, loginFailure, logout } from "../actions/utilisateurActions";

export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await API.login(email, password);
      if(response.err) dispatch(loginFailure(response.err))
        else dispatch(loginSuccess(response.data));
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
        return {
          ...state,
          utilisateur: action.payload,
          loading: false,
        };
      })
      .addCase(loginFailure, (state, action) => {
        return {
          ...state,
          loading: false,
          utilisateur: null,
          error: action.payload,
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
