import { createSelector } from 'reselect';

export const selectTotalUnreadNotification = createSelector((state) => state.notification.totalUnreadNotification, (totalUnreadNotification) => totalUnreadNotification);

export const selectNotificationMapping = createSelector((state) => state.notification.allIds, (state) => state.notification.mapping, (ids, mapping) => ({ ids, mapping }));

export const selectTotalNotfication = createSelector((state) => state.notification.totalNotification, (totalNotification) => totalNotification);
