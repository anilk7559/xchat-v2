import { merge } from 'lodash';
import { combineReducers } from 'redux';

import user from './user/reducers';
import auth from './auth/reducers';
import setting from './settings/reducers';
import packages from './package/reducers';
import sellItems from './sell-items/reducers';
import messages from './messages/reducers';
import payments from './payments/reducers';
import payouts from './payouts/reducers';
import earnings from './earnings/reducers';
// import media from './media/reducers';
import shareLove from './share-love/reducers';
import payoutAccount from './payout-account/reducers';

// {
//   post,
//   auth,
//   user,
//   media,
//   system
// }

const reducers = merge(
  auth,
  user,
  setting,
  packages,
  sellItems,
  messages,
  payments,
  payouts,
  earnings,
  shareLove,
  payoutAccount
);

export default combineReducers(reducers);
