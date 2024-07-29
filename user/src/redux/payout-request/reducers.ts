import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  loadPayoutRequestFail,
  loadPayoutRequestSuccess,
  sendPayoutRequestFail,
  sendPayoutRequestRequesting,
  sendPayoutRequestSuccess
} from './actions';

const initialState = {
  items: [],
  total: 0,
  loadPayoutRequestStore: basicStore,
  sendPayoutRequestStore: basicStore
};

const payoutRequestReducers = [
  {
    on: loadPayoutRequestSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        loadPayoutRequestStore: {
          success: true,
          error: null,
          requesting: false
        }
      };
    }
  },
  {
    on: loadPayoutRequestFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [],
        total: 0,
        loadPayoutRequestStore: {
          success: false,
          error: data.payload,
          requesting: false
        }
      };
    }
  },
  {
    on: sendPayoutRequestRequesting,
    reducer(state: any) {
      return {
        ...state,
        sendPayoutRequestStore: {
          ...initialState.sendPayoutRequestStore,
          requesting: true
        }
      };
    }
  },
  {
    on: sendPayoutRequestSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [data.payload, ...state.items],
        total: state.total + 1,
        sendPayoutRequestStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: sendPayoutRequestFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        sendPayoutRequestStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  }
];

export default merge({}, createReducers('payoutRequest', [payoutRequestReducers], initialState));
