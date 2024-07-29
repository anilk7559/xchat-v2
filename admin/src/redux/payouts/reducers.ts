import { merge } from 'lodash';
import { createReducers } from '../../utils';

import {
  loadPayouts,
  loadPayoutsSuccess,
  loadPayoutsFail,
  findPayout,
  findPayoutSuccess,
  findPayoutFail,
  setStatusRequest
} from './actions';

const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const payoutReducers = [
  {
    on: loadPayouts,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadPayoutsSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadPayoutsFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

// Single Package
const initialSingle = {
  data: null,
  status: ''
};

const singlePayoutReducers = [
  {
    on: findPayout,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findPayoutSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findPayoutFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: setStatusRequest,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: {
          ...state.data,
          status: action.payload.status
        }
      };
    }
  }
];

export default merge(
  {},
  createReducers('payouts', [payoutReducers], initialState),
  createReducers('singlePayout', [singlePayoutReducers], initialSingle)
);
