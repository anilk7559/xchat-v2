import { merge } from 'lodash';

import { createReducers } from '../redux';
import { loadConfigSuccess, setMenu } from './actions';

const initialState = {
  config: null,
  menu: null
};

const configReducers = [
  {
    on: loadConfigSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...{ config: data.payload }
      };
    }
  },
  {
    on: setMenu,
    reducer(state: any, data: any) {
      const { section, menus } = data.payload;
      return {
        ...state,
        menu: {
          ...state.menu,
          [section]: menus
        }
      };
    }
  }
];

export default merge({}, createReducers('system', [configReducers], initialState));
