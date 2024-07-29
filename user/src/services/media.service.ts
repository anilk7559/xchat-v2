import cookie from 'js-cookie';

import { APIRequest } from './api-request';

class MediaService extends APIRequest {
  uploadPhoto(formData: FormData) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return fetch(`${baseApiEndpoint}/media/photos`, {
      method: 'POST',
      headers: {
        Authorization: process.browser ? `Bearer ${cookie.get('accessToken')}` : ''
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
        console.log(response, 'response message');
        return response.json();
      });
  }

  uploadVideo(formData: FormData) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return fetch(`v1/media/videos`, {
      method: 'POST',
      headers: {
        Authorization: process.browser ? `Bearer ${cookie.get('accessToken')}` : ''
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

  uploadFile(formData: FormData) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return fetch(`${baseApiEndpoint}/media/files`, {
      method: 'POST',
      headers: {
        Authorization: process.browser ? `Bearer ${cookie.get('accessToken')}` : ''
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

  download(mediaId: string) {
    return this.get(`/media/${mediaId}/download/`);
  }
}

export const mediaService = new MediaService();
