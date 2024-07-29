import { APIRequest } from './api-request';

class NotificationService extends APIRequest {
  list(query?: any) {
    return this.get('/notifications', query as any);
  }

  listUnread(query?: any) {
    return this.get('/notifications/unread/list', query as any);
  }

  countUnread() {
    return this.get('/notifications/unread/count');
  }

  read(id) {
    return this.put(`/notifications/read/${id}`);
  }

  readAll() {
    return this.put('/notifications/read/all');
  }
}

export const notificationService = new NotificationService();
