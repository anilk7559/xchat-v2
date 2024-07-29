import { merge } from 'lodash';
import { createReducers } from '../../utils';

import { loadMessages, loadMessagesSuccess, loadMessagesFail } from './actions';

const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const messageReducers = [
  {
    on: loadMessages,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadMessagesSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadMessagesFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

export default merge({}, createReducers('messages', [messageReducers], initialState));
