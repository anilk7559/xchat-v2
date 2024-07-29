import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';

import { earningService } from '../../services/earning.service';
import { createSagas } from '../redux';
import { loadEarning, loadEarningFail, loadEarningSuccess } from './actions';

const earningSagas = [
  {
    on: loadEarning,
    * worker(data: any) {
      try {
        const resp = yield earningService.find(data.payload);
        yield put(loadEarningSuccess(resp.data));
      } catch (e) {
        // const error = yield Promise.resolve(e);
        yield loadEarningFail();
      }
    }
  }
];

export default flatten([createSagas(earningSagas)]);
