export class AccountDto {
  /** 用户名 */
  username: string;
  /** 手机号码 */
  mobile?: string;
  /** 邮箱 */
  email?: string;
  /** 状态 */
  status?: string | number;
  /** 平台 */
  platform: string | number;
}
