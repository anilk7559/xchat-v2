import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  deleteItemSuccess,
  getPurchaseItemFail,
  getPurchaseItemSuccess,
  purchaseItemFail,
  purchaseItemRequesting,
  purchaseItemSuccess,
  resetStatePurchase
} from './actions';

const initialState = {
  items: [] as any,
  total: 0,
  getPurchaseItemStore: basicStore,
  purchaseItemStore: basicStore
};

const purchaseItemReducers = [
  {
    on: getPurchaseItemSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        getPurchaseItemStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: getPurchaseItemFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        getPurchaseItemStore: {
          requesting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: resetStatePurchase,
    reducer(state: any) {
      return {
        ...state
      };
    }
  },
  {
    on: purchaseItemRequesting,
    reducer(state: any) {
      return {
        ...state,
        purchaseItemStore: {
          ...initialState.purchaseItemStore,
          requesting: true
        }
      };
    }
  },
  {
    on: purchaseItemSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [...state.items, data.payload],
        total: state.total + 1,
        purchaseItemStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: purchaseItemFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        purchaseItemStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: deleteItemSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: state.items.filter((item) => item._id !== data.payload),
        total: state.total - 1
      };
    }
  }
];

export default merge({}, createReducers('purchaseItem', [purchaseItemReducers], initialState));
