import { createAsyncAction, createAction } from '../../utils';

export const { loadPayouts, loadPayoutsSuccess, loadPayoutsFail } = createAsyncAction('loadPayouts', 'LOAD_PAYOUTS');

export const { findPayout, findPayoutSuccess, findPayoutFail } = createAsyncAction('findPayout', 'FIND_PAYOUT');

export const setStatusRequest = createAction('SET_STATUS_REQUEST');
