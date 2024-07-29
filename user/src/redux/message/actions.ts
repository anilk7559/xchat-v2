import { createAction, createAsyncAction } from '../redux';

export const loadMessageRequesting = createAction('LOAD_MESSAGE_REQUESTING');
export const { loadMessage, loadMessageSuccess, loadMessageFail } = createAsyncAction('loadMessage', 'LOAD_MESSAGES');

export const sendMessageRequesting = createAction('SEND_MESSAGE_REQUESTING');
export const { sendMessage, sendMessageSuccess, sendMessageFail } = createAsyncAction('sendMessage', 'SEND_MESSAGE');

export const loadOldMessageRequesting = createAction('LOAD_OLD_MESSAGE_REQUESTING');
export const { loadOldMessage, loadOldMessageSuccess, loadOldMessageFail } = createAsyncAction(
  'loadOldMessage',
  'LOAD_OLD_MESSAGE'
);

export const newMessage = createAction('NEW_MESSAGE');

export const newActiveConversationMessage = createAction('NEW_ACTIVE_CONVERSATION_MESSAGE');

export const setUsingSearchBar = createAction('SET_USING_SEARCH_BAR');

export const addBookmarkedMessage = createAction('ADD_BOOKMARKED_MESSAGE');

export const removeBookmarkMessage = createAction('UN_BOOKMARKED_MESSAGE');

export const removeMessage = createAction('REMOVE_MESSAGE');

export const removeSendMessgeStatus = createAction('REMOVE_SEND_MESSAGE');
