import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { shareLoveService } from '../../services/share-love.service';

import { loadShareLove, loadShareLoveSuccess, loadShareLoveFail } from './actions';

const shareLoveSagas = [
  {
    on: loadShareLove,
    * worker(action: any) {
      try {
        const res = yield shareLoveService.count(action.payload);
        yield put(loadShareLoveSuccess(res.data));
      } catch (e) {
        yield put(loadShareLoveFail());
      }
    }
  }
];

export default flatten([createSagas(shareLoveSagas)]);
