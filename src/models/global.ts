import { Model } from 'dva';
import { storage } from 'src/utils';
import { authToken } from 'src/config';

// 定义数据类型
export interface GlobalState {
  collapsed: boolean;
}

export interface ReduxAction {
  type: string;
  [propName: string]: any;
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
        console.log(pathname, '当前的路径');
        // 判断当前是否有token,没有就到登录页面
        if (!storage.getItem(authToken)) {
          history.push('/login');
        }
      });
    },
  },
};

export default model;
