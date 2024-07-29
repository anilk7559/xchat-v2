import { createAsyncAction } from '../../utils';

export const { loadEarnings, loadEarningsSuccess, loadEarningsFail } = createAsyncAction(
  'loadEarnings',
  'LOAD_EARNINGS'
);

export const { loadEarningByModel, loadEarningByModelSuccess, loadEarningByModelFail } = createAsyncAction(
  'loadEarningByModel',
  'LOAD_EARNING_BY_MODEL'
);
