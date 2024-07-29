import { flatten } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { updateLastMessage, updateUnreadMessageCount } from 'src/redux/conversation/actions';
import { conversationService } from 'src/services';
import { messageService } from '../../services/message.service';
import { createSagas } from '../redux';
import {
  loadMessage,
  loadMessageFail,
  loadMessageRequesting,
  loadMessageSuccess,
  loadOldMessage,
  loadOldMessageFail,
  loadOldMessageRequesting,
  loadOldMessageSuccess,
  newActiveConversationMessage,
  newMessage,
  sendMessage,
  sendMessageFail,
  sendMessageRequesting,
  sendMessageSuccess
} from './actions';

const messageSagas = [
  {
    on: loadMessage,
    * worker(data: any) {
      try {
        yield put(loadMessageRequesting());
        const { conversationId, query } = data.payload;
        const resp = yield messageService.find(conversationId, query);
        const recipient = yield conversationService.findRecipient(conversationId);
        yield conversationService.readMessage(conversationId);
        yield put(loadMessageSuccess({ ...resp.data, recipient: recipient.data }));
        yield put(updateUnreadMessageCount(conversationId));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadMessageFail(error));
      }
    }
  },

  {
    on: loadOldMessage,
    * worker(data: any) {
      try {
        yield put(loadOldMessageRequesting());
        const { conversationId, query } = data.payload;
        const resp = yield messageService.find(conversationId, query);
        yield put(loadOldMessageSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(loadOldMessageFail(error));
      }
    }
  },
  {
    on: sendMessage,
    * worker(data: any) {
      try {
        yield put(sendMessageRequesting());
        const resp = yield messageService.send(data.payload);
        console.log(resp.data, "mesage resp");
        
        yield put(sendMessageSuccess(resp.data));
        yield put(updateLastMessage(resp.data));
        yield put(updateUnreadMessageCount(resp.data?.conversationId));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(sendMessageFail(error));
      }
    }
  },
  {
    on: newMessage,
    * worker(data: any) {
      const getActiveConversation = (state) => state.conversation.selectedConversation;
      const conversation = yield select(getActiveConversation);
      const { conversationId } = data.payload;
      if (conversationId === conversation?._id) {
        yield put(newActiveConversationMessage(data.payload));
      }
    }
  }
];

export default flatten([createSagas(messageSagas)]);
