import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';

import { userService } from '../../services/user.service';
import { createSagas } from '../redux';
import {
  loadFriend,
  loadFriendFail,
  loadFriendRequesting,
  loadFriendSuccess,
  loadProfile,
  loadProfileFail,
  loadProfileSuccess,
  loadUser,
  loadUserFail,
  loadUserRequesting,
  loadUserSuccess
} from './actions';

const userSagas = [
  {
    on: loadUser,
    * worker(data: any) {
      try {
        yield put(loadUserRequesting());
        const resp = yield userService.find(data.payload);
        yield put(loadUserSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadUserFail(error));
      }
    }
  },
  {
    on: loadFriend,
    * worker(data: any) {
      try {
        yield put(loadFriendRequesting());
        const resp = yield userService.getFriends(data.payload);
        yield put(loadFriendSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadFriendFail(error));
      }
    }
  },
  {
    on: loadProfile,
    * worker() {
      try {
        const resp = yield userService.me();
        yield put(loadProfileSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadProfileFail(error));
      }
    }
  }
];

export default flatten([createSagas(userSagas)]);
