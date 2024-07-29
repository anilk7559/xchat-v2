import { createAsyncAction } from '../redux';

export const { getInvoice, getInvoiceSuccess, getInvoiceFail } = createAsyncAction('getInvoice', 'GET_INVOICE');
