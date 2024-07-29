import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { paymentService } from '../../services/payment.service';

import {
  loadPayments,
  loadPaymentsSuccess,
  loadPaymentsFail,
  findPayment,
  findPaymentSuccess,
  findPaymentFail
} from './actions';

const paymentSagas = [
  {
    on: loadPayments,
    * worker(action: any) {
      try {
        const res = yield paymentService.getList(action.payload);
        yield put(loadPaymentsSuccess(res.data));
      } catch (e) {
        yield put(loadPaymentsFail());
      }
    }
  },

  {
    on: findPayment,
    * worker(action: any) {
      try {
        const res = yield paymentService.findOne(action.payload);
        yield put(findPaymentSuccess(res.data));
      } catch (e) {
        yield put(findPaymentFail());
      }
    }
  }
];

export default flatten([createSagas(paymentSagas)]);
