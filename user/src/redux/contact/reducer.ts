import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  addContactFail,
  addContactList,
  addContactRequesting,
  addContactSuccess,
  findContactFail,
  findContactRequesting,
  findContactSuccess,
  getContactFail,
  getContactListFail,
  getContactListRequesting,
  getContactListSuccess,
  getContactSuccess,
  removeContactFail,
  removeContactRequesting,
  removeContactSuccess,
  resetFindContactStore,
  setSelectedContact
} from './actions';

const initialState = {
  items: [],
  total: 0,
  getContactListStore: basicStore,
  findContactStore: {
    ...basicStore,
    contact: null,
    isFriend: false
  },
  addContactStore: basicStore,
  removeContactStore: basicStore,
  selectedContactId: null
};

const contactReducers = [
  {
    on: getContactSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...{
          contactData: data.payload,
          selectedFriend: data.payload._id,
          getContactDataFailure: false
        }
      };
    }
  },
  {
    on: getContactFail,
    reducer(state: any) {
      return {
        ...state,
        ...{
          getContactDataFailure: true
        }
      };
    }
  },
  {
    on: getContactListRequesting,
    reducer(state: any) {
      return {
        ...state,
        getContactListStore: {
          success: false,
          requesting: true,
          error: null
        }
      };
    }
  },
  {
    on: getContactListSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        getContactListStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: getContactListFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        getContactListStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: findContactRequesting,
    reducer(state: any) {
      return {
        ...state,
        findContactStore: {
          ...initialState.findContactStore,
          requesting: true
        }
      };
    }
  },
  {
    on: findContactSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        findContactStore: {
          requesting: false,
          success: true,
          error: null,
          contact: data.payload,
          isFriend: data.payload.isFriend
        }
      };
    }
  },
  {
    on: findContactFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        findContactStore: {
          requesting: false,
          success: false,
          error: data.payload,
          contact: null,
          isFriend: false
        }
      };
    }
  },
  {
    on: resetFindContactStore,
    reducer(state: any) {
      return {
        ...state,
        findContactStore: initialState.findContactStore
      };
    }
  },
  {
    on: addContactRequesting,
    reducer(state: any) {
      return {
        ...state,
        addContactStore: {
          ...initialState.addContactStore,
          requesting: true
        }
      };
    }
  },
  {
    on: addContactSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [data.payload, ...state.items],
        total: state.total + 1,
        addContactStore: {
          success: true,
          requesting: false,
          error: null
        },
        findContactStore: {
          ...state.findContactStore,
          isFriend: !state.findContactStore.isFriend,
          contact: {
            ...state.findContactStore.contact,
            isFriend: !state.findContactStore.contact.isFriend
          }
        }
      };
    }
  },
  {
    on: addContactFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        addContactStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: addContactList,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...{
          data: [...state.data, ...data.payload.items]
        }
      };
    }
  },
  {
    on: removeContactRequesting,
    reducer(state: any) {
      return {
        ...state,
        removeContactStore: {
          ...initialState.removeContactStore,
          requesting: true
        }
      };
    }
  },
  {
    on: removeContactSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: state.items.filter((cont: any) => cont._id !== data.payload.contact._id),
        total: state.total - 1,
        removeContactStore: {
          success: true,
          requesting: false,
          error: null
        },
        findContactStore: {
          ...state.findContactStore,
          isFriend: !state.findContactStore.isFriend
        }
      };
    }
  },
  {
    on: removeContactFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        removeContactStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: setSelectedContact,
    reducer(state: any, data: any) {
      return {
        ...state,
        selectedContactId: data.payload
      };
    }
  }
];

export default merge({}, createReducers('contact', [contactReducers], initialState));
