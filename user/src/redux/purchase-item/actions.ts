import { createAction, createAsyncAction } from '../redux';

export const { getPurchaseItem, getPurchaseItemSuccess, getPurchaseItemFail } = createAsyncAction(
  'getPurchaseItem',
  'GET_PURCHASE_ITEM'
);

export const purchaseItemRequesting = createAction('PURCHASE_ITEM_REQUESTING');
export const { purchaseItem, purchaseItemSuccess, purchaseItemFail } = createAsyncAction(
  'purchaseItem',
  'PURCHASE_ITEM'
);
export const { deleteItem, deleteItemSuccess, deleteItemFail } = createAsyncAction(
  'deleteItem',
  'DELETE_ITEM'
);

export const resetStatePurchase = createAction('RESET_STATE_PURCHASE');
