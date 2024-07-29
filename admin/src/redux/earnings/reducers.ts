import { merge } from 'lodash';
import { createReducers } from '../../utils';

import {
  loadEarnings, loadEarningsSuccess, loadEarningsFail, loadEarningByModel, loadEarningByModelFail, loadEarningByModelSuccess
} from './actions';

const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: '',
  listByModel: {
    count: 0,
    items: [],
    status: ''
  }
};

const earningReducers = [
  {
    on: loadEarnings,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadEarningsSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadEarningsFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },

  {
    on: loadEarningByModel,
    reducer(state: any) {
      return {
        ...state,
        listByModel: {
          count: 0,
          items: [],
          status: 'loading'
        }
      };
    }
  },
  {
    on: loadEarningByModelSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        listByModel: {
          count: action.payload.count,
          items: action.payload.items,
          status: 'loaded'
        }
      };
    }
  },
  {
    on: loadEarningByModelFail,
    reducer(state: any) {
      return {
        ...state,
        listByModel: {
          count: 0,
          items: [],
          status: 'error'
        }
      };
    }
  }
];

export default merge({}, createReducers('earnings', [earningReducers], initialState));
