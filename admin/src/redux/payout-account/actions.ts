import { createAsyncAction } from '../../utils';

export const { findPayoutAccount, findPayoutAccountSuccess, findPayoutAccountFail } = createAsyncAction(
  'findPayoutAccount',
  'FIND_PAYOUT_ACCOUNT'
);

export const { createAndUpdate, createAndUpdateSuccess, createAndUpdateFail } = createAsyncAction(
  'createAndUpdate',
  'CREATE_AND_UPDATE_PAYOUT_ACCOUNT'
);
