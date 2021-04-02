export class ModifyPasswordDto {
  /** 旧密码 */
  password: string;
  /** 新密码 */
  newPassword: string;
  /** 再次输入新密码 */
  repPassword: string;
}
