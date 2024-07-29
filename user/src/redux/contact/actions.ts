import { createAction, createAsyncAction } from '../redux';

export const { getContact, getContactSuccess, getContactFail } = createAsyncAction('getContact', 'GET_CONTACT');

export const getContactListRequesting = createAction('GET_CONTACT_LIST_REQUESTING');
export const { getContactList, getContactListSuccess, getContactListFail } = createAsyncAction(
  'getContactList',
  'GET_CONTACT_LIST'
);

export const findContactRequesting = createAction('FIND_CONTACT_REQUESTING');
export const { findContact, findContactSuccess, findContactFail } = createAsyncAction('findContact', 'FIND_CONTACT');
export const resetFindContactStore = createAction('RESET_FIND_CONTACT_STORE');

export const addContactRequesting = createAction('ADD_CONTACT_REQUESTING');
export const { addContact, addContactSuccess, addContactFail } = createAsyncAction('addContact', 'ADD_CONTACT');

export const addContactList = createAction('ADD_CONTACT_LIST');

export const removeContactRequesting = createAction('CREATE_CONTACT_REQUESTING');
export const { removeContact, removeContactSuccess, removeContactFail } = createAsyncAction(
  'removeContact',
  'REMOVE_CONTACT'
);

export const setSelectedContact = createAction('SET_SELECTED_CONTACT');
