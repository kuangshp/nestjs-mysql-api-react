import { Model } from 'dva';
import { AccountResDto } from '../../pages/System/Account/types/account.res.dto';
import { ReduxAction } from '../global';

export interface AccountState {
  accountRowData: AccountResDto;
}

const model: Model = {
  namespace: 'account',
  state: {
    accountRowData: {},
  },
  subscriptions: {},
  effects: {},
  reducers: {
    // 设置存储
    setRowData(state: AccountState, action: ReduxAction) {
      if (action.payload) {
        return { ...state, accountRowData: { ...state.accountRowData, ...action.payload } };
      } else {
        return { ...state, accountRowData: {} };
      }
    },
  },
};
export default model;
