import { createAsyncAction } from '../../utils';

export const { loadShareLove, loadShareLoveSuccess, loadShareLoveFail } = createAsyncAction(
  'loadShareLove',
  'LOAD_SHARE_LOVE'
);
