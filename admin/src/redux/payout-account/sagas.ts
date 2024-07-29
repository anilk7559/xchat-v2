import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { payoutAccountService } from '../../services/payout-account.service';

import {
  findPayoutAccount,
  findPayoutAccountSuccess,
  findPayoutAccountFail,
  createAndUpdate,
  createAndUpdateSuccess,
  createAndUpdateFail
} from './actions';

const payoutSagas = [
  {
    on: findPayoutAccount,
    * worker(action: any) {
      try {
        const account = yield payoutAccountService.find(action.payload);
        yield put(findPayoutAccountSuccess(account));
      } catch (e) {
        yield put(findPayoutAccountFail(e));
      }
    }
  },

  {
    on: createAndUpdate,
    * worker(action: any) {
      try {
        const account = yield payoutAccountService.createAndUpdate(action.payload);
        yield put(createAndUpdateSuccess(account));
      } catch (e) {
        yield put(createAndUpdateFail(e));
      }
    }
  }
];

export default flatten([createSagas(payoutSagas)]);
