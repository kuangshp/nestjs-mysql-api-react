// 定义数据类型
export interface GlobalState {
  collapsed: boolean;
}

export default {
  namespace: 'global',
  state: {
    collapsed: false,
  },
  subscriptions: {},
  effects: {},
  reducers: {
    toggleMenusCollapsed(state: GlobalState) {
      return { collapsed: !state.collapsed };
    },
  },
};
