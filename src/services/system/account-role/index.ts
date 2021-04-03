import BaseService from '../../base';
import {
  AccountRoleResDto,
  AccountRoleDto,
} from '../../../pages/System/Account/types/account.role.res.dto';

class AccountRoleService extends BaseService {
  // 根据账号id获取已经授权的角色
  async accountRoleByAccountId(accountId: number): Promise<AccountRoleResDto[]> {
    return await this.get<AccountRoleResDto[]>(`/admin/account_role/${accountId}`);
  }
  // 获取全部的角色
  async accountRoleList(): Promise<AccountRoleDto[]> {
    return await this.get<AccountRoleDto[]>('/admin/account_role');
  }
}

export default new AccountRoleService();
