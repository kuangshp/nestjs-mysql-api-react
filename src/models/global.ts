import { Model } from 'dva';

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
};

export default model;
