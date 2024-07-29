import { IGetInvoice } from '../redux/payment/interface';
import { APIRequest } from './api-request';

class PaymentService extends APIRequest {
  create(data: any) {
    return this.post('/payment/transactions/request', data);
  }

  find(query: IGetInvoice) {
    return this.get('/invoice', query as any);
  }
}

export const paymentService = new PaymentService();
