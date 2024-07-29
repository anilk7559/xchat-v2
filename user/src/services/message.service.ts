import { APIRequest } from './api-request';

class MessageService extends APIRequest {
  find(conversationId: any, query?: any) {
    return this.get(`/messages/${conversationId}`, query);
  }

  delete(id: any) {
    return this.del(`/messages/${id}`);
  }

  send(data: any) {
    return this.post('/messages', data);
  }

  getLastest(query?: any) {
    return this.get('/messages/latest', query);
  }

  addBookmarked(payload: any) {
    return this.post('/messages/bookmark', payload);
  }

  removeBookmarked(id: any) {
    return this.del(`/messages/bookmark/${id}`);
  }

  getListBookmarked(query?: any) {
    return this.get('/messages/bookmark/search', query);
  }

  searchBookmarked(conversationId: any, query?: any) {
    return this.get(`/messages/${conversationId}`, query);
  }
}

export const messageService = new MessageService();
