import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';

import { sellItemService } from '../../services/sell-item.service';
import { createSagas } from '../redux';
import {
  getSellItem,
  getSellItemFail,
  getSellItemRequesting,
  getSellItemSuccess
} from './actions';

const sellItemSagas = [
  {
    on: getSellItem,
    * worker(data: any) {
      try {
        yield put(getSellItemRequesting());
        const resp = data.payload?.modelId
          ? yield sellItemService.getModelSellItem(data.payload)
          : yield sellItemService.getMySellItem(data.payload);
        yield put(getSellItemSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getSellItemFail(error));
      }
    }
  }
];

export default flatten([createSagas(sellItemSagas)]);
