import { merge } from 'lodash';
import { createReducers } from '../../utils';

import { loadShareLove, loadShareLoveSuccess, loadShareLoveFail } from './actions';

const initialState = {
  data: {
    count: 0,
    items: []
  },
  status: ''
};

const shareLoveReducers = [
  {
    on: loadShareLove,
    reducer(state: any) {
      return {
        ...state,
        data: {
          count: 0,
          items: []
        },
        status: 'loading'
      };
    }
  },
  {
    on: loadShareLoveSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: {
          count: action.payload.total,
          items: action.payload.data
        },
        status: 'loaded'
      };
    }
  },
  {
    on: loadShareLoveFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

export default merge({}, createReducers('shareLove', [shareLoveReducers], initialState));
