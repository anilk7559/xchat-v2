import { APIRequest } from './api-request';

class SytemService extends APIRequest {
  getConfig() {
    return this.get('/system/configs/public');
  }

  getConfigByKeys(keys: string[]) {
    return this.post('/system/configs/keys', { keys });
  }

  getMenus(section = 'footer') {
    return this.get(`/menus/sections/${section}`);
  }
}

export const systemService = new SytemService();
