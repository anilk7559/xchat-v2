import { flatten } from 'lodash';
import { toast } from 'react-toastify';
import { put } from 'redux-saga/effects';
import { updateSellItemPurchased } from 'src/redux/sell-item/actions';

import { purchaseItemService } from '../../services/purchase-item.service';
import { createSagas } from '../redux';
import {
  deleteItem,
  deleteItemFail,
  deleteItemSuccess,
  getPurchaseItem,
  getPurchaseItemFail,
  getPurchaseItemSuccess,
  purchaseItem,
  purchaseItemFail,
  purchaseItemRequesting,
  purchaseItemSuccess
} from './actions';

const purchaseItemSagas = [
  {
    on: getPurchaseItem,
    * worker(data: any) {
      try {
        const resp = yield purchaseItemService.getPurchaseItem(data.payload);
        yield put(getPurchaseItemSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getPurchaseItemFail(error));
      }
    }
  },
  {
    on: purchaseItem,
    * worker(data: any) {
      try {
        yield put(purchaseItemRequesting());
        const resp = yield purchaseItemService.purchaseItem(data.payload);
        yield put(purchaseItemSuccess(resp.data));
        toast.success('Der Kauf des Artikels war erfolgreich.Purchased item ');
        yield put(updateSellItemPurchased(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        toast.error(error?.message || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut!');
        yield put(purchaseItemFail(error));
      }
    }
  },
  {
    on: deleteItem,
    * worker(data: any) {
      try {
        yield purchaseItemService.deleteItem(data.payload);
        yield put(deleteItemSuccess(data.payload));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(deleteItemFail(error));
      }
    }
  }
];

export default flatten([createSagas(purchaseItemSagas)]);
