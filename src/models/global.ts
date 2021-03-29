import { Model } from 'dva';

// 定义数据类型
export interface GlobalState {
  collapsed: boolean;
}

const model: Model = {
  namespace: 'global',
  state: {
    collapsed: false,
  },
  effects: {},
  reducers: {
    toggleMenusCollapsed(state: GlobalState) {
      return { collapsed: !state.collapsed };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // dispatch({ type: 'fetchStreetData' });
        // if (Cookies.get('token')) {
        //   dispatch({ type: 'fetchUserInfo' });
        // }
      });
    },
  },
};

export default model;
