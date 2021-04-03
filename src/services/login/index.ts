import BaseService from '../base';
import { ILoginRes } from 'src/pages/Login/types/login.res.dto';

interface ILoginParams {
  username: string;
  password: string;
}

class LoginService extends BaseService {
  // 登录接口
  async loginApi(postData: ILoginParams): Promise<ILoginRes> {
    return this.post<ILoginRes>('/admin/login', postData);
  }
}

export default new LoginService();
