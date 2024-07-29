import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { removeFriend, setFriend } from 'src/redux/user/actions';
import { userService } from 'src/services';

import { contactService } from '../../services/contact.service';
import { createSagas } from '../redux';
import {
  addContact,
  addContactFail,
  addContactRequesting,
  addContactSuccess,
  findContact,
  findContactFail,
  findContactRequesting,
  findContactSuccess,
  getContact,
  getContactFail,
  getContactList,
  getContactListFail,
  getContactListRequesting,
  getContactListSuccess,
  getContactSuccess,
  removeContact,
  removeContactFail,
  removeContactRequesting,
  removeContactSuccess,
  setSelectedContact
} from './actions';

const contactSagas = [
  {
    on: getContact,
    * worker(data: any) {
      try {
        const resp = yield contactService.findOne(data.payload);
        yield put(getContactSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getContactFail(error));
      }
    }
  },
  {
    on: getContactList,
    * worker(data: any) {
      try {
        yield put(getContactListRequesting());
        const resp = yield contactService.find(data.payload);
        yield put(getContactListSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getContactListFail(error));
      }
    }
  },
  {
    on: addContact,
    * worker(data: any) {
      try {
        yield put(addContactRequesting());
        const resp = yield contactService.add(data.payload);
        yield put(addContactSuccess(resp.data));
        yield put(setFriend(data.payload.userId));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(addContactFail(error));
      }
    }
  },
  {
    on: removeContact,
    * worker(data: any) {
      try {
        yield put(removeContactRequesting());
        const resp = yield contactService.remove(data.payload.userId);
        yield put(removeContactSuccess(resp.data));
        yield put(removeFriend(data.payload.userId));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(removeContactFail(error));
      }
    }
  },
  {
    on: findContact,
    * worker(data: any) {
      try {
        yield put(findContactRequesting());
        const resp = yield userService.findByUsername(data.payload.username);
        yield put(findContactSuccess(resp.data));
        if (resp.data.contactId) {
          yield put(setSelectedContact(resp.data.contactId));
        }
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(findContactFail(error));
      }
    }
  }
];

export default flatten([createSagas(contactSagas)]);
