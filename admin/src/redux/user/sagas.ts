import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { userService } from '../../services/user.service';
import {
  loadUsersFail,
  loadUsersSuccess,
  loadUsers,
  findUserFail,
  findUserSuccess,
  findUser,
  createUserFail,
  createUserSuccess,
  createUser,
  updateUserFail,
  updateUserSuccess,
  updateUser,
  findMe,
  findMeSuccess,
  findMeFail,
  updateMe,
  updateMeSuccess,
  updateMeFail,
  loadProfilePhoto,
  loadProfilePhotoSuccess,
  loadProfilePhotoFail,
  updateDocument,
  updateDocumentSuccess,
  updateDocumentFail
} from './actions';

const userSagas = [
  {
    on: loadUsers,
    * worker(action: any) {
      try {
        const res = yield userService.find(action.payload);
        yield put(loadUsersSuccess(res.data));
      } catch (e) {
        yield put(loadUsersFail());
      }
    }
  },
  {
    on: findUser,
    * worker(action: any) {
      try {
        const res = yield userService.findOne(action.payload);
        yield put(findUserSuccess(res.data));
      } catch (e) {
        yield put(findUserFail());
      }
    }
  },
  {
    on: findMe,
    * worker() {
      try {
        const res = yield userService.me();
        yield put(findMeSuccess(res.data));
      } catch (e) {
        yield put(findMeFail());
      }
    }
  },
  {
    on: createUser,
    * worker(action: any) {
      try {
        const response = yield userService.create(action.payload);
        yield put(createUserSuccess(response.data));
      } catch (e) {
        yield put(createUserFail());
      }
    }
  },
  {
    on: updateUser,
    * worker(action: any) {
      try {
        const { id, data } = action.payload;
        const {
          username,
          email,
          isActive,
          emailVerified,
          isCompletedProfile,
          isblocked,
          role,
          phoneNumber,
          address,
          avatar,
          password,
          balance
        } = data;
        const response = yield userService.update(id, {
          username,
          email,
          isActive,
          emailVerified,
          isCompletedProfile,
          isblocked,
          role,
          phoneNumber,
          address,
          avatar,
          password,
          balance
        });
        yield put(updateUserSuccess(response.data));
      } catch (e) {
        yield put(updateUserFail(action.payload));
      }
    }
  },
  {
    on: updateMe,
    * worker(action: any) {
      try {
        const { data } = action.payload;
        const {
          name, email, isActive, emailVerified, role, phoneNumber, address, avatar, password
        } = data;
        const response = yield userService.updateMe({
          name,
          email,
          isActive,
          emailVerified,
          role,
          phoneNumber,
          address,
          avatar,
          password
        });
        yield put(updateMeSuccess(response.data));
      } catch (e) {
        yield put(updateMeFail(action.payload));
      }
    }
  },
  {
    on: loadProfilePhoto,
    * worker(action: any) {
      try {
        const res = yield userService.getProfilePhotos(action.payload);
        yield put(loadProfilePhotoSuccess(res.data));
      } catch (e) {
        yield put(loadProfilePhotoFail(action.payload));
      }
    }
  },
  {
    on: updateDocument,
    * worker(action: any) {
      try {
        const user = yield userService.updateVerificationDocument(action.payload.id, action.payload.data);
        yield put(updateDocumentSuccess(user.data));
      } catch (e) {
        yield put(updateDocumentFail(action.payload));
      }
    }
  }
];

export default flatten([createSagas(userSagas)]);
