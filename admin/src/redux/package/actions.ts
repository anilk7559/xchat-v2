import { createAsyncAction, createAction } from '../../utils';

export const { loadPackages, loadPackagesSuccess, loadPackagesFail } = createAsyncAction(
  'loadPackages',
  'LOAD_PACKAGES'
);

export const { findPackage, findPackageSuccess, findPackageFail } = createAsyncAction('findPackage', 'FIND_PACKAGE');

export const { createPackage, createPackageSuccess, createPackageFail } = createAsyncAction(
  'createPackage',
  'CREATE_PACKAGE'
);

export const { updatePackage, updatePackageSuccess, updatePackageFail } = createAsyncAction(
  'updatePackage',
  'UPDATE_PACKAGE'
);

export const { deletePackage, deletePackageSuccess, deletePackageFail } = createAsyncAction(
  'deletePackage',
  'DELETE_PACKAGE'
);

export const resetCreatePackage = createAction('RESET_CREATE_PACKAGE');
