import { APIRequest } from './api-request';

class PaymentService extends APIRequest {
  getList(data: any) {
    return this.get(this.buildUrl('/invoice', data));
  }

  findOne(id: any) {
    return this.get(`/invoice/${id}`);
  }
}

export const paymentService = new PaymentService();
