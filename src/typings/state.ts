import { GlobalState } from '../models/global';
import { LoginState } from 'src/models/login';

export interface CombinedState {
  global: GlobalState;
  userInfo: LoginState;
}
