import { merge } from 'lodash';
import { createReducers } from '../../utils';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFail,
  findUser,
  findUserSuccess,
  findUserFail,
  createUser,
  createUserSuccess,
  createUserFail,
  resetCreateUser,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  deleteUser,
  findMe,
  findMeSuccess,
  findMeFail,
  updateMe,
  updateMeSuccess,
  updateMeFail,
  loadProfilePhoto,
  loadProfilePhotoSuccess,
  loadProfilePhotoFail,
  setPhotoEdited,
  updateDocument,
  updateDocumentSuccess,
  updateDocumentFail
} from './actions';

// List user
const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const userReducers = [
  {
    on: loadUsers,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadUsersSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadUsersFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: deleteUser,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: {
          count: state.list.count - 1,
          items: state.list.items.filter((i) => i._id.toString() !== action.payload)
        }
      };
    }
  }
];

// Single user
const initialSingle = {
  data: null,
  status: ''
};

const singleUserReducers = [
  {
    on: findUser,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findUserSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findUserFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: findMe,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findMeSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findMeFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

// Create user
const initialCreate = {
  status: '',
  data: null
};

const createUserReducers = [
  {
    on: createUser,
    reducer(state: any) {
      return {
        ...state,
        status: 'creating'
      };
    }
  },
  {
    on: createUserSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'created',
        data: action.payload
      };
    }
  },
  {
    on: createUserFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: resetCreateUser,
    reducer() {
      return initialCreate;
    }
  }
];

// Update User
const initialUpdate = {
  status: '',
  data: null
};

const updateUserReducers = [
  {
    on: updateUser,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: updateUserSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'updated',
        data: action.payload
      };
    }
  },
  {
    on: updateUserFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        data: action.payload
      };
    }
  },
  {
    on: updateMe,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: updateMeSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'updated',
        data: action.payload
      };
    }
  },
  {
    on: updateMeFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        data: action.payload
      };
    }
  }
];

// Profile photo
const initialProfilePhoto = {
  status: '',
  profilePhoto: null,
  statusEdit: ''
};

const profilePhotoReducers = [
  {
    on: loadProfilePhoto,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadProfilePhotoSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        profilePhoto: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadProfilePhotoFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: setPhotoEdited,
    reducer(state: any, action: any) {
      return {
        ...state,
        index: action.payload.index,
        data: action.payload.data,
        statusEdit: 'edited'
      };
    }
  }
];

const updateDocumentReducers = [
  {
    on: updateDocument,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: updateDocumentSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'updated',
        data: action.payload
      };
    }
  },
  {
    on: updateDocumentFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        data: action.payload
      };
    }
  }
];

export default merge(
  {},
  createReducers('user', [userReducers], initialState),
  createReducers('singleUser', [singleUserReducers], initialSingle),
  createReducers('userCreate', [createUserReducers], initialCreate),
  createReducers('userUpdate', [updateUserReducers], initialUpdate),
  // createReducers('userDelete', [deleteUserReducers], initialDelete),
  createReducers('profilePhoto', [profilePhotoReducers], initialProfilePhoto),
  createReducers('documentUpdate', [updateDocumentReducers], initialUpdate)
);
