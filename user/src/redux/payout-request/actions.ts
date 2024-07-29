import { createAction, createAsyncAction } from '../redux';

export const { loadPayoutRequest, loadPayoutRequestSuccess, loadPayoutRequestFail } = createAsyncAction(
  'loadPayoutRequest',
  'LOAD_PAYOUT_REQUEST'
);

export const sendPayoutRequestRequesting = createAction('SEND_PAYOUT_REQUEST_REQUESTING');
export const { sendPayoutRequest, sendPayoutRequestSuccess, sendPayoutRequestFail } = createAsyncAction(
  'sendPayoutRequest',
  'SEND_PAYOUT_REQUEST'
);
