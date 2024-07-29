import { merge } from 'lodash';

import { createReducers } from '../redux';
import {
  loadFriendFail,
  loadFriendRequesting,
  loadFriendSuccess,
  loadProfileFail,
  loadProfileSuccess,
  loadUserFail,
  loadUserRequesting,
  loadUserSuccess,
  removeFriend,
  setFriend
} from './actions';

const initialState = {
  items: [] as any,
  total: 0,

  loadUserStore: {
    success: false,
    requesting: false,
    error: null
  },

  loadFriendStore: {
    success: false,
    requesting: false,
    error: null,
    items: [] as any,
    total: 0
  },

  data: null as any
};

const userReducers = [
  {
    on: loadUserRequesting,
    reducer(state: any) {
      return {
        ...state,
        loadUserStore: {
          ...initialState.loadUserStore,
          requesting: true
        }
      };
    }
  },
  {
    on: loadUserSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        loadUserStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: loadUserFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadUserStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: setFriend,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: state.items.map((i) => {
          // eslint-disable-next-line no-param-reassign
          if (i._id === data.payload) i.isFriend = !i.isFriend;
          return i;
        })
      };
    }
  },
  {
    on: removeFriend,
    reducer(state: any, data: any) {
      const { loadFriendStore } = state;
      return {
        ...state,
        loadFriendStore: {
          ...loadFriendStore,
          items: loadFriendStore.items.filter((item) => item._id !== data.payload),
          total: loadFriendStore.total - 1
        }
      };
    }
  },
  {
    on: loadProfileSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...{
          data: data.payload
        }
      };
    }
  },
  {
    on: loadProfileFail,
    reducer(state) {
      // todo - handle load profile fail
      return {
        ...state
      };
    }
  },
  {
    on: loadFriendRequesting,
    reducer(state: any) {
      return {
        ...state,
        loadFriendStore: {
          ...initialState.loadFriendStore,
          requesting: true
        }
      };
    }
  },
  {
    on: loadFriendSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadFriendStore: {
          success: true,
          requesting: false,
          error: null,
          items: data.payload.items,
          total: data.payload.count
        }
      };
    }
  },
  {
    on: loadFriendFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadFriendStore: {
          success: false,
          requesting: false,
          error: data.payload,
          items: null
        }
      };
    }
  }
];

export default merge({}, createReducers('user', [userReducers], initialState));
