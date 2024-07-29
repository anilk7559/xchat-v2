import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { sellItemService } from '../../services/sell-item.service';

import {
  loadSellItems,
  loadSellItemsSuccess,
  loadSellItemsFail,
  findSellItem,
  findSellItemSuccess,
  findSellItemFail,
  updateSellItemFail,
  updateSellItemSuccess,
  updateSellItem,
  deleteSellItem,
  deleteSellItemSuccess,
  deleteSellItemFail
} from './actions';

const sellItemSagas = [
  {
    on: loadSellItems,
    * worker(action: any) {
      try {
        const res = yield sellItemService.getList(action.payload);
        yield put(loadSellItemsSuccess(res.data));
      } catch (e) {
        yield put(loadSellItemsFail());
      }
    }
  },

  {
    on: findSellItem,
    * worker(action: any) {
      try {
        const res = yield sellItemService.findOne(action.payload);
        yield put(findSellItemSuccess(res.data));
      } catch (e) {
        yield put(findSellItemFail());
      }
    }
  },

  {
    on: updateSellItem,
    * worker(action: any) {
      try {
        const { id, data } = action.payload;
        const {
          name, price, free, isApproved, description
        } = data;
        const response = yield sellItemService.update(id, {
          name, price, free, isApproved, description
        });
        yield put(updateSellItemSuccess(response.data));
      } catch (e) {
        yield put(updateSellItemFail(action.payload));
      }
    }
  },

  {
    on: deleteSellItem,
    * worker(action: any) {
      try {
        yield sellItemService.remove(action.payload);
        yield put(deleteSellItemSuccess(action.payload));
      } catch (e) {
        yield put(deleteSellItemFail());
      }
    }
  }
];

export default flatten([createSagas(sellItemSagas)]);
