import { createAsyncAction } from '../../utils';

export const { loadPayments, loadPaymentsSuccess, loadPaymentsFail } = createAsyncAction(
  'loadPayments',
  'LOAD_PAYMENTS'
);

export const { findPayment, findPaymentSuccess, findPaymentFail } = createAsyncAction('findPayment', 'FIND_PAYMENT');
