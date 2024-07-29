import { actionTypes } from './actions';

const initialState = {
  data: null,
  error: null,
  photos: null,
  uploadPhotoSuccess: false,
  getPhotoSuccess: false
};

// eslint-disable-next-line default-param-last
function reducer(state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.UPLOAD_PHOTO_SUCCESS:
      return {
        ...state,
        ...{
          uploadPhotoSuccess: true,
          data: action.data
        }
      };
    case actionTypes.UPLOAD_PHOTO_FAILURE:
      return {
        ...state,
        ...{
          uploadPhotoSuccess: false,
          error: action.error
        }
      };
    case actionTypes.GET_PHOTOS_SUCCESS:
      return {
        ...state,
        ...{
          getPhotoSuccess: true,
          photos: action.data
        }
      };
    case actionTypes.GET_PHOTOS_FAILURE:
      return {
        ...state,
        ...{
          getPhotoSuccess: false,
          error: action.error
        }
      };
    default:
      return state;
  }
}

export default reducer;
