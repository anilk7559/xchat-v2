import { merge } from 'lodash';

import { createReducers } from '../redux';
import {
  getInvoiceFail,
  getInvoiceSuccess
} from './actions';

const initialState = {
  items: [],
  total: 0
};

const paymentReducers = [
  {
    on: getInvoiceSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count
      };
    }
  },
  {
    on: getInvoiceFail,
    reducer(state: any) {
      return {
        ...state,
        items: [],
        total: 0
      };
    }
  }
];

export default merge({}, createReducers('payment', [paymentReducers], initialState));
