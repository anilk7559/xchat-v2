import { IGetPayoutRequest } from '../redux/payout-request/interface';
import { APIRequest } from './api-request';

class PayoutService extends APIRequest {
  find(query: IGetPayoutRequest) {
    return this.get('/payout-request', query as any);
  }

  requestPayout(data) {
    return this.post('/payout-request', data);
  }
}

export const payoutService = new PayoutService();
