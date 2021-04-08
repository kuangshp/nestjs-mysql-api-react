import { Model } from 'dva';
import { AccessResDto } from '../../pages/System/Access/types/access.res.dto';
import { ReduxAction } from '../global';

export interface AccessState {
  accessRowData: AccessResDto;
}

const model: Model = {
  namespace: 'access',
  state: {
    accessRowData: {},
  },
  subscriptions: {},
  effects: {},
  reducers: {
    // 设置存储
    setRowData(state: AccessState, action: ReduxAction) {
      if (action.payload) {
        return { ...state, accessRowData: { ...state.accessRowData, ...action.payload } };
      } else {
        return { ...state, accessRowData: {} };
      }
    },
  },
};
export default model;
