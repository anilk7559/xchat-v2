import { APIRequest } from './api-request';

class MessageService extends APIRequest {
  getList(data: any) {
    return this.get(this.buildUrl('/messages/all-messages', data));
  }
}

export const messageService = new MessageService();
