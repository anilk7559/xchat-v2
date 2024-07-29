import { APIRequest } from './api-request';

class MenuService extends APIRequest {
  findOne(id: string) {
    return this.get(`/menus/${id}`);
  }

  remove(id: string) {
    return this.del(`/menus/${id}`);
  }

  create(data: any) {
    return this.post('/menus', data);
  }

  update(id: string, data: any) {
    return this.put(`/menus/${id}`, data);
  }

  list(params?: Record<string, any>) {
    return this.get(this.buildUrl('/menus', params));
  }

  section(section: any) {
    return this.get(`/menus/sections/${section}`);
  }
}

export const menuService = new MenuService();
