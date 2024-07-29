import cookie from 'js-cookie';
import { APIRequest } from './api-request';

class MediaService extends APIRequest {
  uploadPhoto(formData: FormData) {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    const token = APIRequest.token || cookie.get('accessToken') || undefined;

    return fetch(`${baseApiEndpoint}/media/photos`, {
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

  getPhotos(data: any) {
    return this.get(`/media/search?type=${data.type}&page=${data.page}&take=${data.pageSize}`);
  }

  removePhoto(id: string) {
    return this.del(`/media/photos/${id}`);
  }

  getPhotoUploadUrl() {
    const baseApiEndpoint = this.getBaseApiEndpoint();

    return `${baseApiEndpoint}/media/photos`;
  }

  getFileUploadUrl() {
    const baseApiEndpoint = this.getBaseApiEndpoint();
    return `${baseApiEndpoint}/media/files`;
  }
}

export const mediaService = new MediaService();
