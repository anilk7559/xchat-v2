import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  getSellItemFail,
  getSellItemRequesting,
  getSellItemSuccess,
  updateSellItemPurchased
} from './actions';

const initialState = {
  items: [] as any,
  total: 0,
  getSellItemStore: basicStore,
  updateSellItemStore: basicStore,
  removeSellItemStore: basicStore
};

const sellItemReducers = [
  {
    on: getSellItemRequesting,
    reducer(state: any) {
      return {
        ...state,
        getSellItemStore: {
          ...initialState.getSellItemStore,
          requesting: true
        }
      };
    }
  },
  {
    on: getSellItemSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        getSellItemStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: getSellItemFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        getSellItemStore: {
          requesting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: updateSellItemPurchased,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item._id.toString() === data.payload.sellItemId.toString()) {
            // eslint-disable-next-line no-param-reassign
            item.isPurchased = true;
            // eslint-disable-next-line no-param-reassign
            item.purchasedItem = data.payload;
          }
          return item;
        })
      };
    }
  }
];

export default merge({}, createReducers('sellItem', [sellItemReducers], initialState));
