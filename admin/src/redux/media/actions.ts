export const actionTypes = {
  UPLOAD_PHOTO: 'UPLOAD_PHOTO',
  UPLOAD_PHOTO_SUCCESS: 'UPLOAD_PHOTO_SUCCESS',
  UPLOAD_PHOTO_FAILURE: 'UPLOAD_PHOTO_FAILURE',
  GET_PHOTOS: 'GET_PHOTOS',
  GET_PHOTOS_SUCCESS: 'GET_PHOTOS_SUCCESS',
  GET_PHOTOS_FAILURE: 'GET_PHOTOS_FAILURE'
};

export function uploadPhoto(data: any) {
  return {
    type: actionTypes.UPLOAD_PHOTO,
    data
  };
}

export function uploadPhotoSuccess(data: any) {
  return {
    type: actionTypes.UPLOAD_PHOTO_SUCCESS,
    data
  };
}

export function uploadPhotoFailure(error: any) {
  return {
    type: actionTypes.UPLOAD_PHOTO_FAILURE,
    error
  };
}

export function getPhotos(data: any) {
  return {
    type: actionTypes.GET_PHOTOS,
    data
  };
}

export function getPhotosSuccess(data: any) {
  return {
    type: actionTypes.GET_PHOTOS_SUCCESS,
    data
  };
}

export function getPhotosFailure(error: any) {
  return {
    type: actionTypes.GET_PHOTOS_FAILURE,
    error
  };
}
