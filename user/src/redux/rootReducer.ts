import { merge } from 'lodash';
import { combineReducers } from 'redux';

import auth from './auth/reducers';
import contact from './contact/reducer';
import conversation from './conversation/reducers';
import earning from './earning/reducers';
import message from './message/reducers';
import notification from './notification/reducers';
import payment from './payment/reducers';
import payout from './payout-request/reducers';
import purchaseItem from './purchase-item/reducers';
import sellItem from './sell-item/reducers';
import system from './system/reducers';
import user from './user/reducers';

const reducers = merge(
  auth,
  user,
  sellItem,
  purchaseItem,
  system,
  contact,
  conversation,
  message,
  payment,
  earning,
  payout,
  notification
);

export default combineReducers(reducers);
