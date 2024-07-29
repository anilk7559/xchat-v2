import { createAsyncAction } from '../../utils';

export const { loadMessages, loadMessagesSuccess, loadMessagesFail } = createAsyncAction(
  'loadMessages',
  'LOAD_MESSAGES'
);
