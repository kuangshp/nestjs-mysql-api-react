import { Model } from 'dva';
import { RoleResDto } from '../../pages/System/Role/types/role.res.dto';
import { ReduxAction } from '../global';

export interface RoleState {
  roleRowData: RoleResDto;
}

const model: Model = {
  namespace: 'role',
  state: {
    roleRowData: {},
  },
  subscriptions: {},
  effects: {},
  reducers: {
    // 设置存储
    setRowData(state: RoleState, action: ReduxAction) {
      if (action.payload) {
        return { roleRowData: { ...state.roleRowData, ...action.payload } };
      } else {
        return { roleRowData: {} };
      }
    },
  },
};
export default model;
