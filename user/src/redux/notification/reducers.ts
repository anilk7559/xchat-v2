import { merge } from 'lodash';

import { createReducers } from '../redux';
import {
  loadNotificationAllSuccess,
  loadNotificationUnreadSuccess,
  readAllNotifcations,
  readNotifcation,
  setTotalUnreadNotification,
  setTotaNotification
} from './actions';

const initialState = {
  ids: [],
  mapping: {},
  totalUnreadNotification: 0,
  allIds: [],
  totalNotification: 0
};

const reducer = [
  {
    on: loadNotificationAllSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        allIds: action.payload.map((notification) => notification._id),
        mapping: { ...state.mapping, ...action.payload.reduce((result, notification) => ({ ...result, [notification._id]: notification }), {}) }
      };
    }
  },
  {
    on: loadNotificationUnreadSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        ids: action.payload.map((notification) => notification._id),
        mapping: {
          ...state.mapping,
          ...action.payload.reduce((result, notification) => ({
            ...result,
            [notification._id]: notification
          }), {})
        }
      };
    }
  },
  {
    on: readNotifcation,
    reducer(state: any, action: any) {
      if (!action.payload) {
        return {
          ...state,
          totalUnreadNotification: 0,
          mapping: {
            ...Object.keys(state.mapping).reduce((v, id) => ({
              ...v,
              [id]: {
                ...state.mapping[id],
                read: true
              }
            }
            ), {})
          }
        };
      }

      return {
        ...state,
        mapping: {
          ...state.mapping,
          [action.payload.id]: {
            ...[action.payload.id],
            read: true
          }
        }
      };
    }
  },
  {
    on: readAllNotifcations,
    reducer(state: any) {
      return {
        ...state,
        totalUnreadNotification: 0,
        ids: [],
        mapping: {
          ...Object.keys(state.mapping).reduce((v, id) => ({
            ...v,
            [id]: {
              ...state.mapping[id],
              read: true
            }
          }), {})
        }
      };
    }
  },
  {
    on: setTotalUnreadNotification,
    reducer(state, action) {
      return {
        ...state,
        totalUnreadNotification: action.payload
      };
    }
  },
  {
    on: setTotaNotification,
    reducer(state, action) {
      return {
        ...state,
        totalNotification: action.payload
      };
    }
  }
];

export default merge({}, createReducers('notification', [reducer], initialState));
