import { Model } from 'dva';

import { ReduxAction } from './global';
import { MenusResDto } from './../Layout/AppSider/types/menu.res.dto';

export interface LoginState {
  menusList: MenusResDto[];
}

const model: Model = {
  namespace: 'login',
  state: {
    userInfo: {},
  },
  subscriptions: {},
  effects: {
    // 获取菜单
    // *menusApi({ payload }: ReduxAction, { call, put }) {
    //   console.log('安逸你');
    // }
  },
  reducers: {
    // 存储菜单
    setMenus(state: LoginState, action: ReduxAction) {
      return { menusList: { ...state.menusList, ...action.payload } };
    },
  },
};
export default model;
