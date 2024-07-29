import { APIRequest } from './api-request';

class PayoutAccountService extends APIRequest {
  find(id: string) {
    return this.get(`/payout-account/${id}`);
  }

  createAndUpdate(data: any) {
    return this.post('/payout-account/', data);
  }
}

export const payoutAccountService = new PayoutAccountService();
