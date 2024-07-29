import { createAsyncAction } from '../../utils';

export const { login, loginSuccess, loginFail } = createAsyncAction('login', 'LOGIN');

export const { logout, logoutSuccess, logoutFail } = createAsyncAction('logout', 'LOGOUT');

export const { setLogin, setLoginSuccess } = createAsyncAction('setLogin', 'SET_LOGIN');
