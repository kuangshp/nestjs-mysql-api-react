import { Model } from 'dva';

import LoginService from './../services/login';
import { ObjectType } from '../typings';
import { routerRedux } from 'dva/router';
import { storage } from './../utils';
import { authToken } from './../config';

export interface ReduxAction {
  type: string;
  [propName: string]: any;
}

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
    *loginApi({ payload }: ReduxAction, { call, put }) {
      const result = yield call(() => LoginService.loginApi(payload));
      if (result) {
        yield put({ type: 'setStorage', payload: result });
        yield put(routerRedux.push('/home'));
      }
    },
  },
  reducers: {
    // 设置存储
    setStorage(state: LoginState, action: ReduxAction) {
      storage.setItem(authToken, action.payload.token);
      return { userInfo: { ...state.userInfo, ...action.payload } };
    },
  },
};
export default model;
