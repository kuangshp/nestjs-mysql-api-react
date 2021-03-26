import { axiosPost } from '../../utils';
import BaseService from '../base';

interface ILoginParams {
  username: string;
  password: string;
}

class LoginService extends BaseService {
  async loginApi(postData: ILoginParams) {
    console.log(this, '??', postData);
    return this.post('/admin/login', postData);
  }
  // async loginApi(postData:ILoginParams) {
  //   return axiosPost('/admin/login', postData);
  // }
}

export default new LoginService();
