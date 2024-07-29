import { all, spawn } from 'redux-saga/effects';
// // import * as authSaga from './auth/sagas';
// import * as mediaSaga from './media/sagas';
import authSagas from './auth/sagas';
import userSagas from './user/sagas';
import settingSagas from './settings/sagas';
import packageSagas from './package/sagas';
import sellItemSagas from './sell-items/sagas';
import messageSagas from './messages/sagas';
import paymentSagas from './payments/sagas';
import payoutSagas from './payouts/sagas';
import earningSagas from './earnings/sagas';
import shareLoveSagas from './share-love/sagas';
import payoutAccountSagas from './payout-account/sagas';

function* rootSaga() {
  yield all(
    [
      ...authSagas,
      ...userSagas,
      ...settingSagas,
      ...packageSagas,
      ...sellItemSagas,
      ...messageSagas,
      ...paymentSagas,
      ...payoutSagas,
      ...earningSagas,
      ...shareLoveSagas,
      ...payoutAccountSagas
    ].map(spawn)
  );
}

export default rootSaga;
