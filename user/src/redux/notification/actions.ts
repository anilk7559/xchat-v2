import { createAction, createAsyncAction } from '@redux/redux';

export const { loadNotificationAll, loadNotificationAllSuccess, loadNotificationAllFail } = createAsyncAction('loadNotificationAll', 'LOAD_NOTIFICATION_ALL');

export const { loadNotificationUnread, loadNotificationUnreadSuccess, loadNotificationUnreadFail } = createAsyncAction('loadNotificationUnread', 'LOAD_NOTIFICATION_UNREAD');

export const readNotifcation = createAction('READ_NOTIFICATION');

export const readAllNotifcations = createAction('READ_ALL_NOTIFICATIONS');

export const setTotalUnreadNotification = createAction('SET_TOTAL_UNREAD_NOTIFICATION');

export const setTotaNotification = createAction('SET_TOTAL_NOTIFICATION');
