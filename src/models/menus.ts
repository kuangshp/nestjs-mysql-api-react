import { Model } from 'dva';

import { ReduxAction } from './global';
import { MenusResDto } from './../Layout/AppSider/types/menu.res.dto';
import MenusService from './../services/menus';

export interface MenusState {
  menusList: MenusResDto[];
}

const model: Model = {
  namespace: 'menus',
  state: {
    userInfo: {},
  },
  subscriptions: {},
  effects: {
    // 获取菜单
    *menusApi(_: ReduxAction, { call, put }) {
      const result = yield call(() => MenusService.menusList());
      if (result) {
        yield put({ type: 'setMenus', payload: result });
      }
      return result;
    },
  },
  reducers: {
    // 存储菜单
    setMenus(state: MenusState, action: ReduxAction) {
      return { menusList: action.payload };
    },
  },
};
export default model;
