import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { payoutService } from '../../services/payout.service';

import {
  loadPayouts,
  loadPayoutsSuccess,
  loadPayoutsFail,
  findPayout,
  findPayoutSuccess,
  findPayoutFail
} from './actions';

const payoutSagas = [
  {
    on: loadPayouts,
    * worker(action: any) {
      try {
        const res = yield payoutService.getList(action.payload);
        yield put(loadPayoutsSuccess(res.data));
      } catch (e) {
        yield put(loadPayoutsFail());
      }
    }
  },

  {
    on: findPayout,
    * worker(action: any) {
      try {
        const res = yield payoutService.findOne(action.payload);
        yield put(findPayoutSuccess(res.data));
      } catch (e) {
        yield put(findPayoutFail());
      }
    }
  }
];

export default flatten([createSagas(payoutSagas)]);
