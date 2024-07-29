import { APIRequest } from './api-request';

class PackageService extends APIRequest {
  /**
   * find all token
   * @param params id or alias
   */
  find(params?: any) {
    return this.get(this.buildUrl('/token-package', params));
  }

  findOne(id: string) {
    return this.get(`/token-package/${id}`);
  }

  remove(id: string) {
    return this.del(`/token-package/${id}`);
  }

  create(data: any) {
    return this.post('/token-package/', data);
  }

  update(id: string, data: any) {
    return this.put(`/token-package/${id}`, data);
  }
}

export const packageService = new PackageService();
