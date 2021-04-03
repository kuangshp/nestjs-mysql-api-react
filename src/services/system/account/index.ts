import BaseService from '../../base';
import { AccountDto } from 'src/pages/System/Account/types/account.dto';
import { ModifyPasswordDto } from 'src/pages/System/Account/types/modify.password.dto';
import { QueryAccountDto } from 'src/pages/System/Account/types/query.account.dto';
import { AccountListResDto } from 'src/pages/System/Account/types/account.res.dto';

class AccountService extends BaseService {
  // 添加数据
  async createAccount(postData: AccountDto): Promise<string> {
    return await this.post<string>('/admin/account', postData);
  }

  // 重置为默认密码
  async resetPassword(postData: { id: number }): Promise<string> {
    return await this.post<string>('/admin/account/reset_password', postData);
  }

  // 修改密码
  async modifyPassword(posData: ModifyPasswordDto): Promise<string> {
    return await this.post<string>('/admin/account/modify_password', posData);
  }

  // 删除数据
  async deleteAccountById(id: number): Promise<string> {
    return await this.delete<string>('/admin/account', id);
  }

  // 修改数据
  async modifyAccountById(id: number, params: AccountDto): Promise<string> {
    return await this.patch<string>('/admin/account', id, params);
  }

  // 查询列表
  async accountList(params?: QueryAccountDto): Promise<AccountListResDto> {
    return await this.get<AccountListResDto>('/admin/account', params);
  }
}

export default new AccountService();
