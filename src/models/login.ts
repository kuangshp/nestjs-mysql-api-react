import { Model } from 'dva';

import LoginService from './../services/login';
import { ObjectType } from '../typings';
import { routerRedux } from 'dva/router';
import { storage } from './../utils';
import { authToken } from './../config';
import { ReduxAction } from './global';

export interface LoginState {
  userInfo: ObjectType;
}

const model: Model = {
  namespace: 'login',
  state: {
    userInfo: {},
  },
  subscriptions: {},
  effects: {
    // 登录接口
    *loginApi({ payload }: ReduxAction, { call, put }) {
      const result = yield call(() => LoginService.loginApi(payload));
      if (result) {
        yield put({ type: 'setStorage', payload: result });
        // 调用菜单接口
        yield put({ type: 'menus/menusApi' });
        yield put(routerRedux.push('/home'));
      }
    },
  },
  reducers: {
    // 设置存储
    setStorage(state: LoginState, action: ReduxAction) {
      storage.setItem(authToken, action.payload.token);
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };
    },
  },
};
export default model;
