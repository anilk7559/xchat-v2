import { merge } from 'lodash';
import { createReducers } from '../../utils';

import {
  loadPayments,
  loadPaymentsSuccess,
  loadPaymentsFail,
  findPayment,
  findPaymentSuccess,
  findPaymentFail
} from './actions';

const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const paymentReducers = [
  {
    on: loadPayments,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadPaymentsSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadPaymentsFail,
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

const singlePaymentReducers = [
  {
    on: findPayment,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findPaymentSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findPaymentFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

export default merge(
  {},
  createReducers('payments', [paymentReducers], initialState),
  createReducers('singlePayment', [singlePaymentReducers], initialSingle)
);
