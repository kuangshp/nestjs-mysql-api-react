import BaseService from '../base';
import { CreateAccountDto } from 'src/pages/System/Account/types/create.account.dto';

class AccountService extends BaseService {
  // 添加数据
  async createAccount(postData: CreateAccountDto): Promise<any> {
    return await this.post<string>('/admin/account', postData);
  }

  // 删除数据
  async deleteAccountById(id: number): Promise<any> {
    return await this.delete('/admin/account', id);
  }

  // 修改数据
  async modifyAccountById(id: number, params: any): Promise<any> {
    return await this.patch('/admin/account', id, params);
  }

  // 查询列表
  async accountList(params?: any): Promise<any> {
    console.log(params, '获取到的参数');
    return await this.get('/admin/account', params);
  }
}

export default new AccountService();
