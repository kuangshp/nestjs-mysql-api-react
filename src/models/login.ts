import LoginService from './../services/login';
import { ObjectType } from '../typings';
import { routerRedux } from 'dva/router';
import { storage } from './../utils';
import { authToken } from './../config';
import { Model } from 'dva';
import { ApiResDto } from 'src/dto/api.res.dto';
import { ILoginRes } from 'src/pages/Login/login.res.dto';

export interface ReduxAction {
  type: string;
  [propName: string]: any;
}

const model: Model = {
  namespace: 'login',
  state: {},
  subscriptions: {},
  effects: {
    *loginApi({ payload }: ReduxAction, { call, put }) {
      const data: ApiResDto<ILoginRes> = yield call(() => LoginService.loginApi(payload));
      // const data = yield call(LoginService.loginApi, payload);
      console.log(data, '请求结果');
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        yield put({ type: 'setStorage', payload: result });
        yield put(routerRedux.push('/home'));
      } else {
        console.log('请求接口失败', message);
      }
    },
  },
  reducers: {
    // 设置存储
    setStorage(state, action: ReduxAction) {
      storage.setItem(authToken, action.payload.token);
      return { ...state, ...action.payload };
    },
  },
};
export default model;
