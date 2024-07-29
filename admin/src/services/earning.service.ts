import { APIRequest } from './api-request';

class EarningService extends APIRequest {
  getList(data: any) {
    return this.get(this.buildUrl('/earning/admin-search', data));
  }

  getListByModel(data: any) {
    return this.get(this.buildUrl('/earning', data));
  }
}

export const earningService = new EarningService();
