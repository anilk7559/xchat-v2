import { merge } from 'lodash';
import { createReducers } from 'src/utils';
import { loginSuccess, loginFail, setLoginSuccess } from './actions';

const initialState = {
  authUser: null,
  isLoggedIn: false,
  loginFailure: false
};

const authReducer = [
  {
    on: loginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: data.payload,
        isLoggedIn: true,
        loginFailure: false
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any) {
      return {
        ...state,
        isLoggedIn: false,
        authUser: null,
        loginFailure: true
      };
    }
  },
  {
    on: setLoginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        isLoggedIn: true,
        authUser: data.payload,
        loginFailure: false
      };
    }
  }
];

export default merge({}, createReducers('auth', [authReducer], initialState));
