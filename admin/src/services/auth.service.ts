import cookie from 'js-cookie';
import { APIRequest } from './api-request';
import { ILogin } from '../redux/auth/interface';

const TOKEN = 'accessToken';
class AuthService extends APIRequest {
  adminLogin(data: ILogin) {
    return this.post('/auth/admin-login', data);
  }

  adminForgotPassword(data: ILogin) {
    return this.post('/auth/forgot', data);
  }

  setToken(token: string) {
    // https://github.com/js-cookie/js-cookie
    // since Safari does not support, need a better solution
    cookie.set('accessToken', token);
  }

  getToken() {
    return cookie.get(TOKEN);
  }

  removeToken() {
    cookie.remove(TOKEN);
    localStorage.removeItem(TOKEN);
  }

  me(headers?: { [key: string]: string }) {
    return this.get('/users/me', headers);
  }
}

export const authService = new AuthService();
