import { put, takeLatest } from 'redux-saga/effects';
import { polyfill } from 'es6-promise';

import {
  actionTypes, uploadPhotoFailure, uploadPhotoSuccess, getPhotosFailure, getPhotosSuccess
} from './actions';
import { mediaService } from '../../services/media.service';

polyfill();

function* uploadPhoto(action: any) {
  try {
    const photo = yield mediaService.uploadPhoto(action.data);
    yield put(uploadPhotoSuccess(photo));
  } catch (err) {
    yield put(uploadPhotoFailure(err));
  }
}

function* getPhotos(action: any) {
  try {
    const photos = yield mediaService.getPhotos(action.data);
    yield put(getPhotosSuccess(photos));
  } catch (err) {
    yield put(getPhotosFailure(err));
  }
}

export const doUploadPhoto = takeLatest(actionTypes.UPLOAD_PHOTO, uploadPhoto);
export const doGetPhoto = takeLatest(actionTypes.GET_PHOTOS, getPhotos);
