import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';

import { paymentService } from '../../services/payment.service';
import { createSagas } from '../redux';
import {
  getInvoice,
  getInvoiceFail,
  getInvoiceSuccess
} from './actions';

const paymentSagas = [
  {
    on: getInvoice,
    * worker(data: any) {
      try {
        const resp = yield paymentService.find(data.payload);
        yield put(getInvoiceSuccess(resp.data));
      } catch (e) {
        // const error = yield Promise.resolve(e);
        yield getInvoiceFail();
      }
    }
  }
];

export default flatten([createSagas(paymentSagas)]);
