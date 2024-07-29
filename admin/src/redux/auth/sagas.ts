import { flatten } from 'lodash';
import { createSagas } from 'src/utils';
import { put, call } from 'redux-saga/effects';
import { resetAppState } from '@redux/actions';
import {
  login, loginSuccess, loginFail, setLogin, setLoginSuccess, logout, logoutSuccess
} from './actions';
import { authService } from '../../services/auth.service';

const loginSagas = [
  {
    on: login,
    * worker(action: any) {
      try {
        const auth = yield authService.adminLogin(action.payload);
        yield call(authService.setToken, auth.data.token);
        const user = yield authService.me();
        yield put(loginSuccess(user.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loginFail(error));
      }
    }
  },

  {
    on: setLogin,
    * worker(action: any) {
      yield put(setLoginSuccess(action.payload));
    }
  }
];

const logoutSagas = [
  {
    on: logout,
    * worker() {
      yield authService.removeToken();
      yield put(logoutSuccess());
      yield put(resetAppState());
    }
  }
];

export default flatten([createSagas(loginSagas), createSagas(logoutSagas)]);
