import BaseService from '../base';
import { IApiBaseResDto } from 'src/dto/api.res.base.dto';
import { ILoginRes } from 'src/pages/Login/login.res.dto';

interface ILoginParams {
  username: string;
  password: string;
}

class LoginService extends BaseService {
  // 登录接口
  async loginApi(postData: ILoginParams) {
    return this.post<IApiBaseResDto<ILoginRes>>('/admin/login', postData);
  }
}

export default new LoginService();
