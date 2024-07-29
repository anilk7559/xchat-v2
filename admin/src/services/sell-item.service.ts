import { APIRequest } from './api-request';

class SellItemService extends APIRequest {
  getList(data: any) {
    return this.get(this.buildUrl('/sell-item', data));
  }

  findOne(id: any) {
    return this.get(`/sell-item/${id}`);
  }

  update(id: string, data: any) {
    return this.put(`/sell-item/${id}`, data);
  }

  remove(id: string) {
    return this.del(`/sell-item/${id}`);
  }
}

export const sellItemService = new SellItemService();
