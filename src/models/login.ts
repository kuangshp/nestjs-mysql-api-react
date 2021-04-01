import { Model } from 'dva';
import { message as Message } from 'antd';

import LoginService from './../services/login';
import { ObjectType } from '../typings';
import { routerRedux } from 'dva/router';
import { storage } from './../utils';
import { authToken } from './../config';
import { IApiBaseResDto } from 'src/dto/api.res.base.dto';
import { ILoginRes } from 'src/pages/Login/types/login.res.dto';

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
      const data: IApiBaseResDto<ILoginRes> = yield call(() => LoginService.loginApi(payload));
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        yield put({ type: 'setStorage', payload: result });
        yield put(routerRedux.push('/home'));
      } else {
        console.log('请求接口失败', message);
        Message.error(message);
      }
    },
  },
  reducers: {
    // 设置存储
    setStorage(state: LoginState, action: ReduxAction) {
      storage.setItem(authToken, action.payload.token);
      // return { userInfo: Object.assign(state.userInfo, action.payload) };
      return { userInfo: { ...state.userInfo, ...action.payload } };
    },
  },
};
export default model;
