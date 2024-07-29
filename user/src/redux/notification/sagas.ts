import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { notificationService } from 'src/services';

import { createSagas } from '../redux';
import {
  loadNotificationAll,
  loadNotificationAllFail,
  loadNotificationAllSuccess,
  loadNotificationUnread,
  loadNotificationUnreadFail,
  loadNotificationUnreadSuccess,
  setTotalUnreadNotification,
  setTotaNotification
} from './actions';

const sagas = [
  {
    on: loadNotificationAll,
    * worker(data: any) {
      try {
        const resp = yield notificationService.list(data.payload);
        yield put(setTotaNotification(resp.data.count));
        yield put(loadNotificationAllSuccess(resp.data.items));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadNotificationAllFail(error));
      }
    }
  },
  {
    on: loadNotificationUnread,
    * worker(data: any) {
      try {
        const resp = yield notificationService.listUnread(data.payload);
        const totalUnread = yield notificationService.countUnread();
        yield put(loadNotificationUnreadSuccess(resp.data));
        yield put(setTotalUnreadNotification(totalUnread.data.count));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadNotificationUnreadFail(error));
      }
    }
  }
];

export default flatten([createSagas(sagas)]);
