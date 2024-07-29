import { createAction, createAsyncAction } from '../redux';

export const loadConversationRequesting = createAction('LOAD_CONVERSATION_REQUESTING');
export const { loadConversation, loadConversationSuccess, loadConversationFail } = createAsyncAction(
  'loadConversation',
  'LOAD_CONVERSATION'
);

export const createConversationRequesting = createAction('CREATE_CONVERSATION_REQUESTING');
export const { createConversation, createConversationSuccess, createConversationFail } = createAsyncAction(
  'createConversation',
  'CREATE_CONVERSATION'
);

export const newConversation = createAction('NEW_CONVERSATION');

export const setSelectedConversation = createAction('SET_SELECTED_CONVERSATION');

export const blockConversation = createAction('BLOCK_CONVERSATION_REQUESTING');

export const unBlockConversation = createAction('UN_BLOCK_CONVERSATION_REQUESTING');

export const updateUnreadMessageCount = createAction('UPDATE_UNREAD_MESSAGE_COUNT');

export const updateLastMessage = createAction('UPDATE_LAST_MESSAGE');

export const updateHaveBeenBlocked = createAction('UPDATE_HAVE_BEEN_BLOCKED');

export const updateHaveBeenUnBlocked = createAction('UPDATE_HAVE_BEEN_UNBLOCKED');

export const updateTotalUnreadMessage = createAction('UPDATE_TOTAL_UNREAD_MESSAGE');

export const deleteConversation = createAction('DELETE_CONVERSATION');
