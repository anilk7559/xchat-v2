import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  loginFail,
  loginRequesting,
  loginSuccess,
  logout,
  setAvatar,
  setBalanceToken,
  setCompletedProfile,
  setLogin,
  updateDocumentFail,
  updateDocumentRequesting,
  updateDocumentSuccess,
  updateProfileFail,
  updateProfileRequesting,
  updateProfileSuccess,
  updateTokenPerMessageFail,
  updateTokenPerMessageRequesting,
  updateTokenPerMessageSuccess
} from './actions';

const initialState = {
  isLoggedIn: false,
  authUser: null,
  userRegister: basicStore,
  userLogin: basicStore,
  updateProfileStore: basicStore,
  updateDocumentStore: basicStore,
  deactiveProfileStore: basicStore,
  updateTokenPerMessageStore: basicStore
};

const authReducers = [
  {
    on: loginRequesting,
    reducer(state: any) {
      return {
        ...state,
        userLogin: {
          ...state.userLogin,
          requesting: true
        }
      };
    }
  },
  {
    on: loginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        isLoggedIn: true,
        authUser: data.payload,
        userLogin: {
          requesting: false,
          error: null,
          success: true
        }
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        authUser: null,
        userLogin: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: setLogin,
    reducer(state: any, data: any) {
      return {
        ...state,
        isLoggedIn: true,
        authUser: data.payload,
        userLogin: {
          requesting: false,
          error: null,
          success: true
        }
      };
    }
  },
  {
    on: logout,
    reducer(state: any) {
      return {
        ...initialState,
        authUser: state.authUser
      };
    }
  },
  {
    on: setAvatar,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: { ...state.authUser, avatarUrl: data.payload }
      };
    }
  },
  {
    on: updateProfileRequesting,
    reducer(state: any) {
      return {
        ...state,
        updateProfileStore: {
          requesting: true,
          success: false,
          error: null
        }
      };
    }
  },
  {
    on: updateProfileSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: { ...state.authUser, ...data.payload },
        updateProfileStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: updateProfileFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        updateProfileStore: {
          requesting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: updateDocumentRequesting,
    reducer(state: any) {
      return {
        ...state,
        updateDocumentStore: {
          requesting: true,
          success: false,
          error: null
        }
      };
    }
  },
  {
    on: updateDocumentSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: { ...state.authUser, verificationDocument: data.payload },
        updateDocumentStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: updateDocumentFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        updateDocumentStore: {
          requesting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: setCompletedProfile,
    reducer(state: any, data: any) {
      const authUser = { ...state.authUser, isCompletedProfile: data.payload };
      return {
        ...state,
        authUser
      };
    }
  },
  {
    on: updateTokenPerMessageRequesting,
    reducer(state: any) {
      return {
        ...state,
        updateTokenPerMessageStore: {
          ...initialState.updateTokenPerMessageStore,
          requesting: true
        }
      };
    }
  },
  {
    on: updateTokenPerMessageSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: {
          ...state.authUser,
          tokenPerMessage: data.payload.token
        },
        updateTokenPerMessageStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: updateTokenPerMessageFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        updateTokenPerMessageStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: setBalanceToken,
    reducer(state: any, data: any) {
      return {
        ...state,
        authUser: {
          ...state.authUser,
          balance: data.payload.balance
        }
      };
    }
  }
];

export default merge({}, createReducers('auth', [authReducers], initialState));
