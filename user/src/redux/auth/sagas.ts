import { flatten } from 'lodash';
import Router from 'next/router';
import { put } from 'redux-saga/effects';

import { authService } from '../../services/auth.service';
import { createSagas } from '../redux';
import {
  login,
  loginFail,
  loginRequesting,
  loginSuccess,
  logout,
  updateDocument,
  updateDocumentFail,
  updateDocumentRequesting,
  updateDocumentSuccess,
  updateProfile,
  updateProfileFail,
  updateProfileRequesting,
  updateProfileSuccess,
  updateTokenPerMessage,
  updateTokenPerMessageFail,
  updateTokenPerMessageRequesting,
  updateTokenPerMessageSuccess
} from './actions';

const authSagas = [
  {
    on: login,
    * worker(data: any) {
      try {
        yield put(loginRequesting());
        const { email, password, isKeepLogin } = data.payload;
        const resp = yield authService.login({ email, password });
        yield authService.setToken(resp.data.token, isKeepLogin);
        const authUser = yield authService.me();
        yield put(loginSuccess(authUser.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loginFail(error));
      }
    }
  },
  {
    on: logout,
    * worker() {
      yield authService.removeToken();
      Router.push('/auth/login', '/');
    }
  },
  {
    on: updateDocument,
    * worker(data: any) {
      try {
        yield put(updateDocumentRequesting());
        const resp = yield authService.updateDocument(data.payload);
        yield put(updateDocumentSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(updateDocumentFail(error));
      }
    }
  },
  {
    on: updateProfile,
    * worker(data: any) {
      try {
        yield put(updateProfileRequesting());
        const resp = yield authService.updateProfile(data.payload);
        yield put(updateProfileSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(updateProfileFail(error));
      }
    }
  },
  {
    on: updateTokenPerMessage,

    * worker(data: any) {
      try {
        yield put(updateTokenPerMessageRequesting());
        yield authService.updateTokenPerMessage(data.payload);
        yield put(updateTokenPerMessageSuccess(data.payload));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(updateTokenPerMessageFail(error));
      }
    }
  }
];

export default flatten([createSagas(authSagas)]);
