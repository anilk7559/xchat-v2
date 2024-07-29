import { APIRequest } from './api-request';

class DashBoardService extends APIRequest {
  getDashboard() {
    return this.get('/admin/dashboard-stats');
  }
}

export const dashBoardService = new DashBoardService();
