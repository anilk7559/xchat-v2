import { merge } from 'lodash';
import { createReducers } from '../../utils';

import {
  loadSellItems,
  loadSellItemsSuccess,
  loadSellItemsFail,
  findSellItem,
  findSellItemSuccess,
  findSellItemFail,
  updateSellItem,
  updateSellItemSuccess,
  updateSellItemFail,
  deleteSellItem,
  deleteSellItemSuccess,
  deleteSellItemFail
} from './actions';

const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const sellItemReducers = [
  {
    on: loadSellItems,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadSellItemsSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadSellItemsFail,
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

const singleSellItemReducers = [
  {
    on: findSellItem,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findSellItemSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findSellItemFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

// Update SellItem
const initialUpdate = {
  status: '',
  data: null
};

const updateSellItemReducers = [
  {
    on: updateSellItem,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: updateSellItemSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'updated',
        data: action.payload
      };
    }
  },
  {
    on: updateSellItemFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        data: action.payload
      };
    }
  }
];

// Delete SellItem
const initialDelete = {
  status: '',
  id: ''
};

const deleteSellItemReducers = [
  {
    on: deleteSellItem,
    reducer(state: any) {
      return {
        ...state,
        status: 'deleting'
      };
    }
  },
  {
    on: deleteSellItemSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        id: action.payload,
        status: 'deleted'
      };
    }
  },
  {
    on: deleteSellItemFail,
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
  createReducers('sellItems', [sellItemReducers], initialState),
  createReducers('singleSellItem', [singleSellItemReducers], initialSingle),
  createReducers('sellItemUpdate', [updateSellItemReducers], initialUpdate),
  createReducers('sellItemDelete', [deleteSellItemReducers], initialDelete)
);
