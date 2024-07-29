import { APIRequest } from './api-request';

class PayoutService extends APIRequest {
  getList(data: any) {
    return this.get(this.buildUrl('/payout-request', data));
  }

  findOne(id: any) {
    return this.get(`/payout-request/${id}`);
  }

  updateStatus(action: string, id: any, data?: any) {
    return this.post(`/payout-request/${action}/${id}`, data);
  }

  approve(id: any) {
    return this.post(`/payout-request/approve/${id}`);
  }

  reject(id: any) {
    return this.post(`/payout-request/reject/${id}`);
  }

  paid(id: any) {
    return this.post(`/payout-request/paid/${id}`);
  }
}

export const payoutService = new PayoutService();
