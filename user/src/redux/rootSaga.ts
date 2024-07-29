import { all, spawn } from 'redux-saga/effects';

import authSaga from './auth/sagas';
import contactSaga from './contact/sagas';
import conversationSaga from './conversation/sagas';
import earning from './earning/sagas';
import messageSaga from './message/sagas';
import notificationSaga from './notification/sagas';
import payment from './payment/sagas';
import payout from './payout-request/sagas';
import purchaseItemSaga from './purchase-item/sagas';
import sellItemSaga from './sell-item/sagas';
import userSaga from './user/sagas';

function* rootSaga() {
  yield all(
    [
      ...authSaga,
      ...userSaga,
      ...sellItemSaga,
      ...purchaseItemSaga,
      ...contactSaga,
      ...conversationSaga,
      ...messageSaga,
      ...payment,
      ...earning,
      ...payout,
      ...notificationSaga
    ].map(spawn)
  );
}

export default rootSaga;
