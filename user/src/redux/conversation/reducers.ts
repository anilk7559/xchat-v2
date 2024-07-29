/* eslint-disable no-param-reassign */
import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';

import { createReducers } from '../redux';
import {
  blockConversation,
  createConversationFail,
  createConversationRequesting,
  createConversationSuccess,
  deleteConversation,
  loadConversationFail,
  loadConversationRequesting,
  loadConversationSuccess,
  newConversation,
  setSelectedConversation,
  unBlockConversation,
  updateHaveBeenBlocked,
  updateHaveBeenUnBlocked,
  updateLastMessage,
  updateTotalUnreadMessage,
  updateUnreadMessageCount
} from './actions';

const initialState = {
  items: [] as any,
  total: 0,
  selectedConversation: null,
  loadConvStore: basicStore,
  createConvStore: {
    ...basicStore,
    data: null
  },
  blockConvStore: basicStore,
  unBlockConvStore: basicStore,
  haveBeenBlockStatus: false,
  totalUnreadMessage: 0
};

const conversationReducers = [
  {
    on: loadConversationRequesting,
    reducer(state: any) {
      return {
        ...state,
        loadConvStore: {
          ...initialState.loadConvStore,
          requesting: true
        }
      };
    }
  },
  {
    on: loadConversationSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items,
        total: data.payload.count,
        loadConvStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: loadConversationFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadConvStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: createConversationRequesting,
    reducer(state: any) {
      return {
        ...state,
        createConvStore: {
          ...initialState.createConvStore,
          requesting: true
        }
      };
    }
  },
  {
    on: createConversationSuccess,
    reducer(state: any, data: any) {
      const { items } = state;
      const existConv = items.find((i) => i._id === data.payload._id);
      return {
        ...state,
        items: existConv && existConv._id ? items : [data.payload, ...items],
        total: state.total + 1,
        createConvStore: {
          success: true,
          error: null,
          requesting: false,
          data: data.payload
        }
      };
    }
  },
  {
    on: createConversationFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        createConvStore: {
          success: false,
          error: data.payload,
          requesting: false,
          data: null
        }
      };
    }
  },
  {
    on: newConversation,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [data.payload, ...state.items],
        total: state.total + 1
      };
    }
  },
  {
    on: setSelectedConversation,
    reducer(state: any, data: any) {
      return {
        ...state,
        selectedConversation: data.payload
      };
    }
  },
  {
    on: blockConversation,
    reducer(state: any, data: any) {
      const items = state.items.map((item) => {
        if (item._id.toString() === data.payload.conversationId) {
          item.blockedIds.push(data.payload.blockedId);
        }

        return item;
      });
      return {
        ...state,
        items,
        blockConvStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: unBlockConversation,
    reducer: (state: any, data: any) => {
      const { selectedConversation } = state;
      const newSelectConv = state.selectedConversation;
      const items = state.items.map((item) => {
        if (item._id.toString() === data.payload.conversationId) {
          item.blockedIds.filter((blockedId) => blockedId !== data.payload.blockedId);
        }

        return item;
      });
      if (selectedConversation && selectedConversation._id === data.payload.conversationId) {
        newSelectConv.blockedIds = selectedConversation.blockedIds.filter(
          (blockedId) => blockedId !== data.payload.blockedId
        );
      }

      return {
        ...state,
        items,
        selectedConversation: newSelectConv,
        unBlockConvStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: deleteConversation,
    reducer(state: any, data: any) {
      const items = state.items.filter((item) => item._id.toString() !== data.payload);
      return {
        ...state,
        items
      };
    }
  },
  {
    on: updateUnreadMessageCount,
    reducer(state: any, data: any) {
      const items = state.items.map((item) => {
        if (item._id.toString() === data.payload.toString()) {
          item.unreadMessageCount = 0;
        }

        return item;
      });
      return {
        ...state,
        items
      };
    }
  },
  {
    on: updateLastMessage,
    reducer(state: any, data: any) {
      const { conversationId } = data.payload;
      const items = state.items.map((item) => {
        if (item._id.toString() === conversationId.toString()) {
          if (conversationId.toString() !== state?.selectedConversation?._id.toString()) {
            item.unreadMessageCount += 1;
          }
          item.lastMessageId = data.payload._id;
          item.lastMessage = data.payload;
        }

        return item;
      });
      return {
        ...state,
        items
      };
    }
  },
  {
    on: updateHaveBeenBlocked,
    reducer: (state: any, data: any) => {
      const newSelectConv = state.selectedConversation;
      newSelectConv.blockedIds.push(data.payload.blockedId);
      return {
        ...state,
        selectedConversation: newSelectConv,
        haveBeenBlockStatus: !state.haveBeenBlockStatus
      };
    }
  },
  {
    on: updateHaveBeenUnBlocked,
    reducer: (state: any, data: any) => {
      const newSelectConv = state.selectedConversation;
      newSelectConv.blockedIds = state.selectedConversation.blockedIds.filter(
        (blockedId) => blockedId !== data.payload.blockedId
      );
      return {
        ...state,
        selectedConversation: newSelectConv,
        haveBeenBlockStatus: !state.haveBeenBlockStatus
      };
    }
  },
  {
    on: updateTotalUnreadMessage,
    reducer: (state: any, data: any) => ({
      ...state,
      totalUnreadMessage: data.payload
    })
  }

];

export default merge({}, createReducers('conversation', [conversationReducers], initialState));
