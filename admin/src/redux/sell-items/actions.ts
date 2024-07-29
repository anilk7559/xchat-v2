import { createAsyncAction } from '../../utils';

export const { loadSellItems, loadSellItemsSuccess, loadSellItemsFail } = createAsyncAction(
  'loadSellItems',
  'LOAD_SELL_ITEMS'
);

export const { findSellItem, findSellItemSuccess, findSellItemFail } = createAsyncAction(
  'findSellItem',
  'FIND_SELL_ITEM'
);

export const { updateSellItem, updateSellItemSuccess, updateSellItemFail } = createAsyncAction(
  'updateSellItem',
  'UPDATE_SELL_ITEM'
);

export const { deleteSellItem, deleteSellItemSuccess, deleteSellItemFail } = createAsyncAction(
  'deleteSellItem',
  'DELETE_SELL_ITEM'
);
