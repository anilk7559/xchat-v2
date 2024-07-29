import { APIRequest } from './api-request';

class PurchaseItemService extends APIRequest {
  getPurchaseItem(data: any) {
    return this.get('/purchase-item', data);
  }

  purchaseItem(data: any) {
    return this.post('/purchase-item', data);
  }

  deleteItem(id: string) {
    return this.del(`/purchase-item/${id}`);
  }

  download(purchaseId: string) {
    return this.get(`/purchase-item/${purchaseId}/download/`);
  }
}

export const purchaseItemService = new PurchaseItemService();
