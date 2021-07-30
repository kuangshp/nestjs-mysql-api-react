import global, { GlobalState } from './global';
import login, { LoginState } from './login';
import menus, { MenusState } from './menus';
import systemAccess, { AccessState } from './system/access';
import systemAccount, { AccountState } from './system/account';
import systemRole, { RoleState } from './system/role';

export interface IGState {
  // '@@dva': number;
  menus: MenusState;
  access: AccessState;
  account: AccountState;
  global: GlobalState;
  // loading: any;
  login: LoginState;
  role: RoleState;
  router: any;
}
const models = [global, login, menus, systemAccess, systemAccount, systemRole];
// export type RootState = ReturnType<typeof models.getState>;
export default models;
