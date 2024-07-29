import { merge } from 'lodash';
import { createReducers } from '../../utils';
import {
  loadPackages,
  loadPackagesSuccess,
  loadPackagesFail,
  findPackage,
  findPackageSuccess,
  findPackageFail,
  createPackage,
  createPackageSuccess,
  createPackageFail,
  resetCreatePackage,
  updatePackage,
  updatePackageSuccess,
  updatePackageFail,
  deletePackage,
  deletePackageSuccess,
  deletePackageFail
} from './actions';

// List Package
const initialState = {
  list: {
    count: 0,
    items: []
  },
  status: ''
};

const packageReducers = [
  {
    on: loadPackages,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: loadPackagesSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        list: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: loadPackagesFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

// Single Package
const initialSingle = {
  data: null,
  status: ''
};

const singlePackageReducers = [
  {
    on: findPackage,
    reducer(state: any) {
      return {
        ...state,
        status: 'loading'
      };
    }
  },
  {
    on: findPackageSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        data: action.payload,
        status: 'loaded'
      };
    }
  },
  {
    on: findPackageFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

// Create Package
const initialCreate = {
  status: '',
  data: null
};

const createPackageReducers = [
  {
    on: createPackage,
    reducer(state: any) {
      return {
        ...state,
        status: 'creating'
      };
    }
  },
  {
    on: createPackageSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'created',
        data: action.payload
      };
    }
  },
  {
    on: createPackageFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  },
  {
    on: resetCreatePackage,
    reducer() {
      return initialCreate;
    }
  }
];

// Update Package
const initialUpdate = {
  status: '',
  data: null
};

const updatePackageReducers = [
  {
    on: updatePackage,
    reducer(state: any) {
      return {
        ...state,
        status: 'updating'
      };
    }
  },
  {
    on: updatePackageSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'updated',
        data: action.payload
      };
    }
  },
  {
    on: updatePackageFail,
    reducer(state: any, action: any) {
      return {
        ...state,
        status: 'error',
        data: action.payload
      };
    }
  }
];

// Delete Package
const initialDelete = {
  status: '',
  id: ''
};

const deletePackageReducers = [
  {
    on: deletePackage,
    reducer(state: any) {
      return {
        ...state,
        status: 'deleting'
      };
    }
  },
  {
    on: deletePackageSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        id: action.payload,
        status: 'deleted'
      };
    }
  },
  {
    on: deletePackageFail,
    reducer(state: any) {
      return {
        ...state,
        status: 'error'
      };
    }
  }
];

export default merge(
  {},
  createReducers('package', [packageReducers], initialState),
  createReducers('singlePackage', [singlePackageReducers], initialSingle),
  createReducers('packageCreate', [createPackageReducers], initialCreate),
  createReducers('packageUpdate', [updatePackageReducers], initialUpdate),
  createReducers('packageDelete', [deletePackageReducers], initialDelete)
);
