import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { earningService } from '../../services/earning.service';

import {
  loadEarnings, loadEarningsSuccess, loadEarningsFail, loadEarningByModel, loadEarningByModelFail, loadEarningByModelSuccess
} from './actions';

const earningSagas = [
  {
    on: loadEarnings,
    * worker(action: any) {
      try {
        const res = yield earningService.getList(action.payload);
        yield put(loadEarningsSuccess(res.data));
      } catch (e) {
        yield put(loadEarningsFail());
      }
    }
  },
  {
    on: loadEarningByModel,
    * worker(action: any) {
      try {
        const res = yield earningService.getListByModel(action.payload);
        yield put(loadEarningByModelSuccess(res.data));
      } catch (e) {
        yield put(loadEarningByModelFail());
      }
    }
  }
];

export default flatten([createSagas(earningSagas)]);
