import { merge } from 'lodash';
import { basicStore } from 'src/lib/utils';
import { createReducers } from '../redux';
import {
  addBookmarkedMessage,
  loadMessageFail,
  loadMessageRequesting,
  loadMessageSuccess,
  loadOldMessageFail,
  loadOldMessageRequesting,
  loadOldMessageSuccess,
  newActiveConversationMessage,
  removeBookmarkMessage,
  removeMessage,
  removeSendMessgeStatus,
  sendMessageFail,
  sendMessageRequesting,
  sendMessageSuccess,
  setUsingSearchBar
} from './actions';

const initialState = {
  items: [] as any,
  total: 0,
  recipient: null,
  usingSearchBar: false,
  loadMessageStore: basicStore,
  loadOldMessageStore: basicStore,
  sendMessageStore: {
    ...basicStore,
    data: null
  }
};

const messageReducers = [
  {
    on: loadMessageRequesting,
    reducer(state: any) {
      return {
        ...state,
        items: [],
        total: 0,
        recipient: null,
        usingSearchBar: false,
        loadMessageStore: {
          ...initialState.loadMessageStore,
          requesting: true
        }
      };
    }
  },
  {
    on: loadMessageSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: data.payload.items.reverse(),
        total: data.payload.count,
        recipient: data.payload.recipient,
        loadMessageStore: {
          success: true,
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: loadMessageFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadMessageStore: {
          success: false,
          requesting: false,
          error: data.payload
        }
      };
    }
  },

  {
    on: loadOldMessageRequesting,
    reducer(state: any) {
      return {
        ...state,
        loadOldMessageStore: {
          requesting: true,
          success: false,
          error: null
        }
      };
    }
  },
  {
    on: loadOldMessageSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        items: [...data.payload.items.reverse(), ...state.items],
        total: data.payload.count,
        loadOldMessageStore: {
          requesting: false,
          success: true,
          error: null
        }
      };
    }
  },
  {
    on: loadOldMessageFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loadOldMessageStore: {
          requesting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: sendMessageRequesting,
    reducer(state: any) {
      return {
        ...state,
        sendMessageStore: {
          ...initialState.sendMessageStore,
          requesting: true
        }
      };
    }
  },
  {
    on: sendMessageSuccess,
    reducer(state: any, data: any) {
      const hasItem = (state.items || []).find((item) => item._id === data.payload._id);

      if (hasItem) {
        return {
          ...state,
          sendMessageStore: {
            ...state.sendMessageStore,
            success: true,
            requesting: false,
            error: null
          }
        };
      }

      return {
        ...state,
        items: [...state.items, data.payload],
        total: state.total + 1,
        sendMessageStore: {
          success: true,
          requesting: false,
          error: null,
          data: data.payload
        }
      };
    }
  },
  {
    on: sendMessageFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        sendMessageStore: {
          success: false,
          requesting: false,
          error: data.payload,
          data: null
        }
      };
    }
  },
  {
    on: newActiveConversationMessage,
    reducer(state: any, data: any) {
      const item = state.items.find((i) => i._id === data.payload._id);
      if (!item) {
        return {
          ...state,
          items: [...state.items, data.payload],
          total: state.total + 1
        };
      }

      return state;
    }
  },
  {
    on: setUsingSearchBar,
    reducer(state: any, data: any) {
      return {
        ...state,
        usingSearchBar: data.payload
      };
    }
  },
  {
    on: addBookmarkedMessage,
    reducer(state: any, action: any) {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item._id === action.payload.messageId) {
            return {
              ...item,
              bookmarkId: action.payload.bookmarkId,
              bookmarked: true
            };
          }
          return item;
        })
      };
    }
  },
  {
    on: removeBookmarkMessage,
    reducer(state: any, action: any) {
      return {
        ...state,
        items: state.items.map((item) => {
          if (item._id === action.payload.messageId) {
            return {
              ...item,
              bookmarkId: null,
              bookmarked: false
            };
          }

          return item;
        })
      };
    }
  }, {
    on: removeMessage,
    reducer(state: any, data: any) {
      const items = state.items.filter((item) => item._id.toString() !== data.payload);
      return {
        ...state,
        items,
        total: state.total - 1
      };
    }
  },
  {
    on: removeSendMessgeStatus,
    reducer(state: any, data: any) {
      return {
        ...state,
        sendMessageStore: {
          ...basicStore,
          data: null
        }
      };
    }
  }
];

export default merge({}, createReducers('message', [messageReducers], initialState));
