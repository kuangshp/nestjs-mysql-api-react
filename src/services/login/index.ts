import { axiosPost } from '../../utils';
import BaseService from '../base';

interface ILoginParams {
  username: string;
  password: string;
}

class LoginService extends BaseService {
  // 登录接口
  async loginApi(postData: ILoginParams) {
    return this.post('/admin/login', postData);
  }
}

export default new LoginService();
