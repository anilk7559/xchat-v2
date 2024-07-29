import { APIRequest } from './api-request';

class ContactService extends APIRequest {
  findOne(id: any) {
    return this.get(`/contact/${id}`);
  }

  find(query?: any) {
    return this.get('/contact', query);
  }

  add(data: any) {
    return this.post('/contact', data);
  }

  remove(userId: string) {
    return this.del(`/contact/${userId}`);
  }

  shareLove(data) {
    return this.post('/share-love/create', data);
  }
}

export const contactService = new ContactService();
