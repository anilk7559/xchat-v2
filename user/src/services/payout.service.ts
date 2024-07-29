import { IPayoutAccount } from '../interfaces/payout-account';
import { APIRequest } from './api-request';

class PayoutAccountAccount extends APIRequest {
  find() {
    return this.get('/payout-account/');
  }

  update(data: IPayoutAccount) {
    return this.post('/payout-account/', data as any);
  }
}

export const payoutAccountAccount = new PayoutAccountAccount();
