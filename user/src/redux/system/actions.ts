import { createAction, createAsyncAction } from '../redux';

export const { loadConfig, loadConfigSuccess, loadConfigFail } = createAsyncAction('loadConfig', 'LOAD_CONFIG');

export const setMenu = createAction('setMenu');
