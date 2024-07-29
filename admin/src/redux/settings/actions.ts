import { createAsyncAction, createAction } from '../../utils';

export const { loadSettings, loadSettingsSuccess, loadSettingsFail } = createAsyncAction(
  'loadSettings',
  'LOAD_SETTINGS'
);
export const loadConfig = createAction('LOAD_CONFIG');

export const updateConfig = createAction('UPDATE_CONFIG');
