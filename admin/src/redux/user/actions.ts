import { createAsyncAction, createAction } from '../../utils';

export const { loadUsers, loadUsersSuccess, loadUsersFail } = createAsyncAction('loadUsers', 'LOAD_USERS');

export const { findUser, findUserSuccess, findUserFail } = createAsyncAction('findUser', 'FIND_USER');

export const { createUser, createUserSuccess, createUserFail } = createAsyncAction('createUser', 'CREATE_USER');

export const { updateUser, updateUserSuccess, updateUserFail } = createAsyncAction('updateUser', 'UPDATE_USER');

export const deleteUser = createAction('DELETE_USER');

export const resetCreateUser = createAction('RESET_CREATE_USER');

export const { findMe, findMeSuccess, findMeFail } = createAsyncAction('findMe', 'FIND_ME');

export const { updateMe, updateMeSuccess, updateMeFail } = createAsyncAction('updateMe', 'UPDATE_ME');

export const { loadProfilePhoto, loadProfilePhotoSuccess, loadProfilePhotoFail } = createAsyncAction(
  'loadProfilePhoto',
  'LOAD_PROFILE_PHOTO'
);

export const setPhotoEdited = createAction('SET_PHOTO_EDITED');

export const { updateDocument, updateDocumentSuccess, updateDocumentFail } = createAsyncAction(
  'updateDocument',
  'UPDATE_VERIFICATION_DOCUMENT'
);
