import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { packageService } from '../../services/package.service';
import {
  loadPackagesFail,
  loadPackagesSuccess,
  loadPackages,
  findPackageFail,
  findPackageSuccess,
  findPackage,
  createPackageFail,
  createPackageSuccess,
  createPackage,
  updatePackageFail,
  updatePackageSuccess,
  updatePackage,
  deletePackage,
  deletePackageSuccess,
  deletePackageFail
} from './actions';

const packageSagas = [
  {
    on: loadPackages,
    * worker(action: any) {
      try {
        const res = yield packageService.find(action.payload);
        yield put(loadPackagesSuccess(res.data));
      } catch (e) {
        yield put(loadPackagesFail());
      }
    }
  },
  {
    on: findPackage,
    * worker(action: any) {
      try {
        const res = yield packageService.findOne(action.payload);
        yield put(findPackageSuccess(res.data));
      } catch (e) {
        yield put(findPackageFail());
      }
    }
  },
  {
    on: createPackage,
    * worker(action: any) {
      try {
        const response = yield packageService.create(action.payload);
        yield put(createPackageSuccess(response.data));
      } catch (e) {
        yield put(createPackageFail());
      }
    }
  },
  {
    on: updatePackage,
    * worker(action: any) {
      try {
        const { id, data } = action.payload;
        const {
          name, description, price, token, ordering
        } = data;
        const response = yield packageService.update(id, {
          name,
          description,
          price,
          token,
          ordering
        });
        yield put(updatePackageSuccess(response.data));
      } catch (e) {
        yield put(updatePackageFail(action.payload));
      }
    }
  },
  {
    on: deletePackage,
    * worker(action: any) {
      try {
        yield packageService.remove(action.payload);
        yield put(deletePackageSuccess(action.payload));
      } catch (e) {
        yield put(deletePackageFail());
      }
    }
  }
];

export default flatten([createSagas(packageSagas)]);
