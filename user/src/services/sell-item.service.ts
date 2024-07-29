import { IGetSellItem } from 'src/interfaces/sell-item';

import { APIRequest } from './api-request';

class SellItemService extends APIRequest {
  createSellItem(data: any) {
    return this.post('/sell-item', data);
  } 
  createBlogPost(data: any) {
    return this.post('/blog-post', data);
  }
 
  getAllBlogs(userId) {
    return this.get(`/blogs/${userId}`);
  }
  

  getBlogById(id) {
    return this.get(`/getBlogPost/${id}`);
  }
  // user get sell item of model
  getModelSellItem(data: IGetSellItem) {
    return this.get('/sell-item/model', data as any);
  }
  getModelSellItems(data: IGetSellItem) {
    return this.get('/sell-items/model', data as any);
  }

  getMySellItem(data: IGetSellItem) {
    return this.get('/sell-item/me', data as any);
  }
  getMyPendingItem(data: IGetSellItem) {
    return this.get('/pending-item/me', data as any);
  }
  getMyPendingVideoItem(data: IGetSellItem) {
    return this.get('/pending-videoItem/me', data as any);
  }
  updateSellItem(id: string, data: any) {
    return this.put(`/sell-item/${id}`, data);
  }

  removeSellItem(id: string) {
    return this.del(`/sell-item/${id}`);
  }

  // folder services
    createFolder(data: any) {
      return this.post('/create-folder', data);
    }

    getFolders() {
      return this.get('/folders');
    } 
    
    getFolderImages() {
      return this.get('/folder-images');
    }
}



export const sellItemService = new SellItemService();
