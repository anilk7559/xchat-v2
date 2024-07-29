import { merge } from 'lodash';
import { createReducers } from '../../utils';

import {
  findPayoutAccount,
  findPayoutAccountSuccess,
  findPayoutAccountFail,
  createAndUpdate,
  createAndUpdateSuccess,
  createAndUpdateFail
} from './actions';

const initialState = {
  data: null,
  status: '',
  error: null
};

const payoutAccountReducers = [
  {
    on: findPayoutAccount,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findPayoutAccountSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findPayoutAccountFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    }
  }
];

const createAndUpdateReducers = [
  {
    on: createAndUpdate,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: createAndUpdateSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'updated'
      };
    }
  },
  {
    on: createAndUpdateFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        error: action.payload
      };
    }
  }
];

export default merge(
  {},
  createReducers('payoutAccount', [payoutAccountReducers], initialState),
  createReducers('createAndUpdatePayout', [createAndUpdateReducers], initialState)
);
