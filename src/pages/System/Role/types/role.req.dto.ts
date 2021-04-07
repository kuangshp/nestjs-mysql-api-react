export class RoleReqDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description?: string;
  /** 状态 */
  status?: number | string;
  /** 是否为默认 */
  isDefault?: number | string;
}
