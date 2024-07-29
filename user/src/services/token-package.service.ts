import { APIRequest } from './api-request';

class PackageService extends APIRequest {
  find(query?: any) {
    return this.get('/token-package', query as any);
  }
}

export const packageService = new PackageService();
