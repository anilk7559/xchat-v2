import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '../../utils';
import { loadSettings, loadSettingsSuccess, loadSettingsFail } from './actions';
import { settingService } from '../../services/setting.service';

const setingSagas = [
  {
    on: loadSettings,
    * worker(action: any) {
      try {
        const res = yield settingService.find(action.payload);
        yield put(loadSettingsSuccess(res.data));
      } catch (e) {
        const error = yield e;
        yield put(loadSettingsFail(error.data));
      }
    }
  }
];

export default flatten([createSagas(setingSagas)]);
