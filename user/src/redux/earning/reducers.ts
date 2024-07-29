import { merge } from 'lodash';

import { createReducers } from '../redux';
import { loadEarningFail, loadEarningSuccess } from './actions';

const initialState = {
  items: [],
  total: 0
};

const earningReducers = [
  {
    on: loadEarningSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count
      };
    }
  },
  {
    on: loadEarningFail,
    reducer(state: any) {
      return {
        ...state,
        items: [],
        total: 0
      };
    }
  }
];

export default merge({}, createReducers('earning', [earningReducers], initialState));
