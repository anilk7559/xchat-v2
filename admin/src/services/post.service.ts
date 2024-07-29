import { APIRequest } from './api-request';

class PostService extends APIRequest {
  /**
   * find all posts
   * @param params id or alias
   */
  find(params?: any) {
    return this.get(this.buildUrl('/posts', params));
  }

  findOne(id: string) {
    return this.get(`/posts/${id}`);
  }

  remove(id: string) {
    return this.del(`/posts/${id}`);
  }

  create(data: any) {
    return this.post('/posts', data);
  }

  update(id: string, data: any) {
    return this.put(`/posts/${id}`, data);
  }
}

export const postService = new PostService();
