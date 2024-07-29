import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';

import { conversationService } from '../../services/conversation.service';
import { createSagas } from '../redux';
import {
  createConversation,
  createConversationFail,
  createConversationRequesting,
  createConversationSuccess,
  loadConversation,
  loadConversationFail,
  loadConversationRequesting,
  loadConversationSuccess
} from './actions';

const conversationSagas = [
  {
    on: loadConversation,
    * worker(data: any) {
      try {
        yield put(loadConversationRequesting());
        const resp = yield conversationService.find(data.payload);
        yield put(loadConversationSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadConversationFail(error));
      }
    }
  },
  {
    on: createConversation,
    * worker(data: any) {
      try {
        yield put(createConversationRequesting());
        const resp = yield conversationService.create(data.payload);
        yield put(createConversationSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(createConversationFail(error));
      }
    }
  }
];

export default flatten([createSagas(conversationSagas)]);
