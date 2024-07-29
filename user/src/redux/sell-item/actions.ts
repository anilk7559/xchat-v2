import { createAction, createAsyncAction } from '../redux';

export const getSellItemRequesting = createAction('GET_SELL_ITEM_REQUESTING');
export const { getSellItem, getSellItemSuccess, getSellItemFail } = createAsyncAction('getSellItem', 'GET_SELL_ITEM');

export const updateSellItemPurchased = createAction('UPDATE_SELL_ITEM_PURCHASED');
