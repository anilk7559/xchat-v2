import { APIRequest } from './api-request';

class UserService extends APIRequest {
  find(params?: any) {
    return this.get(this.buildUrl('/users/search', params));
  }

  create(data: any) {
    return this.post('/users', data);
  }

  me() {
    return this.get('/users/me');
  }

  updateMe(data: any) {
    return this.put('/users/', data);
  }

  findOne(id: string) {
    return this.get(`/users/${id}`);
  }

  update(id: string, data: any) {
    return this.put(`/users/${id}`, data);
  }

  updateVerificationDocument(id: string, data: any) {
    return this.put(`/users/${id}/verification/document/`, data);
  }

  remove(id: string) {
    return this.del(`/users/${id}`);
  }

  getProfilePhotos(data: any) {
    return this.get(this.buildUrl('/media/search', data));
  }
}

export const userService = new UserService();
