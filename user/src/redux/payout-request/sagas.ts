import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { updateProfileSuccess } from 'src/redux/auth/actions';
import { authService } from 'src/services/auth.service';

import { payoutService } from '../../services/payout-request.service';
import { createSagas } from '../redux';
import {
  loadPayoutRequest,
  loadPayoutRequestFail,
  loadPayoutRequestSuccess,
  sendPayoutRequest,
  sendPayoutRequestFail,
  sendPayoutRequestRequesting,
  sendPayoutRequestSuccess
} from './actions';

const payoutRequestSagas = [
  {
    on: loadPayoutRequest,
    * worker(data: any) {
      try {
        const resp = yield payoutService.find(data.payload);
        yield put(loadPayoutRequestSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadPayoutRequestFail(error));
      }
    }
  },
  {
    on: sendPayoutRequest,
    * worker(data: any) {
      try {
        yield put(sendPayoutRequestRequesting());
        const { token, email, verifyCode } = data.payload;
        yield authService.doVerifyCode({ email, verifyCode });
        const resp = yield payoutService.requestPayout({ token });

        const authUser = yield authService.me();
        yield put(updateProfileSuccess(authUser.data));
        yield put(sendPayoutRequestSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(sendPayoutRequestFail(error));
      }
    }
  }
];

export default flatten([createSagas(payoutRequestSagas)]);
