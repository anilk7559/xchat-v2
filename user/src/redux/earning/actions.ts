import { createAsyncAction } from '../redux';

export const { loadEarning, loadEarningSuccess, loadEarningFail } = createAsyncAction(
  'loadEarning',
  'LOAD_EARNING'
);
