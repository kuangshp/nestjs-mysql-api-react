export class RoleMenuApiReqDto {
  /** 资源列表 */
  accessList: number[] | string[];
  /** 类型(2为菜单,3为接口) */
  type: number;
}
