import { createAction, createAsyncAction } from '../redux';

export const { login, loginSuccess, loginFail } = createAsyncAction('login', 'LOGIN');
export const loginRequesting = createAction('LOGIN_REQUESTING');

export const setLogin = createAction('SET_LOGIN');

export const logout = createAction('LOGOUT');

export const setAvatar = createAction('SET_AVATAR');

export const updateProfileRequesting = createAction('UPDATE_PROFILE_REQUESTING');
export const { updateProfile, updateProfileSuccess, updateProfileFail } = createAsyncAction(
  'updateProfile',
  'UPDATE_PROFILE'
);

export const updateDocumentRequesting = createAction('UPDATE_ DOCUMENT_REQUESTING');
export const { updateDocument, updateDocumentSuccess, updateDocumentFail } = createAsyncAction(
  'updateDocument',
  'UPDATE_DOCUMENT'
);

export const setCompletedProfile = createAction('SET_COMPLETED_PROFILE');

export const updateTokenPerMessageRequesting = createAction('UPDATE_TOKEN_PER_MESSAGE_REQUESTING');
export const { updateTokenPerMessage, updateTokenPerMessageSuccess, updateTokenPerMessageFail } = createAsyncAction(
  'updateTokenPerMessage',
  'UPDATE_TOKEN_PER_MESSAGE'
);

export const setBalanceToken = createAction('SET_BALANCE_TOKEN');
