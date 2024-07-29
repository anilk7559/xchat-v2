import { createAction, createAsyncAction } from '../redux';

export const loadUserRequesting = createAction('LOAD_USER_REQUESTING');
export const { loadUser, loadUserSuccess, loadUserFail } = createAsyncAction('loadUser', 'LOAD_USER');

export const loadFriendRequesting = createAction('LOAD_USER_REQUESTING');
export const { loadFriend, loadFriendSuccess, loadFriendFail } = createAsyncAction('loadFriend', 'LOAD_FRIEND');

export const setFriend = createAction('SET_FRIEND');

export const removeFriend = createAction('REMOVE_FRIEND');

export const { loadProfile, loadProfileSuccess, loadProfileFail } = createAsyncAction('loadProfile', 'LOAD_PROFILE');
