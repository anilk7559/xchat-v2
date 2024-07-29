import { merge } from 'lodash';
import { createReducers } from '../../utils';
import {
  loadSettings, loadSettingsSuccess, loadConfig, updateConfig
} from './actions';

const initialState = {
  fetching: false,
  list: {
    items: [],
    count: 0
  },
  isLoadConfig: false
};

const settingReducers = [
  {
    on: loadSettings,
    reducer(state: any) {
      return {
        ...state,
        fetching: true
      };
    }
  },
  {
    on: loadSettingsSuccess,
    reducer(state: any, action: any) {
      return {
        ...state,
        fetching: false,
        list: {
          items: action.payload,
          count: action.payload.length
        }
      };
    }
  },
  {
    on: loadConfig,
    reducer(state: any, action: any) {
      return {
        ...state,
        isLoadConfig: action.payload
      };
    }
  },
  {
    on: updateConfig,
    reducer(state: any, action: any) {
      const newItems = state.list.items.map((config) => {
        if (config.key === action.payload.key) {
          // eslint-disable-next-line no-param-reassign
          config.value = action.payload.value;
        }
        return config;
      });

      return {
        ...state,
        list: {
          ...state.list,
          items: newItems
        }
      };
    }
  }
];

export default merge({}, createReducers('settings', [settingReducers], initialState));
