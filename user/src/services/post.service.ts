import { APIRequest } from './api-request';

class PostService extends APIRequest {
  findAll(data: { [key: string]: string }) {
    return this.get('/posts', data);
  }

  findOne(id: String) {
    return this.get(`/posts/${id}`);
  }
}

export const postService = new PostService();
