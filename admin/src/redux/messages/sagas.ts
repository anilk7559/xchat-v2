import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { messageService } from '../../services/message.service';

import { loadMessages, loadMessagesSuccess, loadMessagesFail } from './actions';

const messageSagas = [
  {
    on: loadMessages,
    * worker(action: any) {
      try {
        const res = yield messageService.getList(action.payload);
        yield put(loadMessagesSuccess(res.data));
      } catch (e) {
        yield put(loadMessagesFail());
      }
    }
  }
];

export default flatten([createSagas(messageSagas)]);
