import BaseService from '../base';
import { ApiResDto } from 'src/dto/api.res.dto';
import { ILoginRes } from 'src/pages/Login/login.res.dto';

interface ILoginParams {
  username: string;
  password: string;
}

class LoginService extends BaseService {
  // 登录接口
  async loginApi(postData: ILoginParams) {
    return this.post<ApiResDto<ILoginRes>>('/admin/login', postData);
  }
}

export default new LoginService();
