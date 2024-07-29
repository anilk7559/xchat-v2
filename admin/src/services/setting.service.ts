import cookie from 'js-cookie';
import { APIRequest } from './api-request';

class SettingServices extends APIRequest {
  find(params?: any) {
    return this.get(this.buildUrl('/system/configs', params));
  }

  update(id: string, data: any) {
    return this.put(`/system/configs/${id}`, data);
  }

  getPublicConfig() {
    return this.get('/system/configs/public');
  }

  getFileUploadUrl() {
    const baseApiEndpoint = this.getBaseApiEndpoint();

    return `${baseApiEndpoint}/sytem/public/files`;
  }

  uploadFile(formData: FormData) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    const token = APIRequest.token || cookie.get('accessToken') || undefined;

    return fetch(`${baseApiEndpoint}/sytem/public/files`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      },
      body: formData
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        throw response.clone().json();
      })
      .then((response) => {
        if (response.status === 204 || response.status === 205) {
          return null;
        }
        return response.json();
      });
  }
}

export const settingService = new SettingServices();
