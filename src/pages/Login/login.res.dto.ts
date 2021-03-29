/** 登录接口返回的数据 */
export interface ILoginRes {
  mobile: string;
  email: string;
  username: string;
  id: number;
  isDel: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: number;
  platform: number;
  token: string;
}
