import { IGetEarning } from '../redux/earning/interface';
import { APIRequest } from './api-request';

class EarningService extends APIRequest {
  find(query: IGetEarning) {
    return this.get('/earning', query as any);
  }
}

export const earningService = new EarningService();
