import { APIRequest } from './api-request';

class ShareLoveService extends APIRequest {
  count(data?: any) {
    return this.get(this.buildUrl('/share-love/count', data));
  }
}

export const shareLoveService = new ShareLoveService();
