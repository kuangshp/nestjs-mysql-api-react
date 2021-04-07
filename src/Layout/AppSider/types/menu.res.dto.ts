export class MenusResDto {
  /** 菜单ID */
  id: number;
  /** 菜单名称 */
  name: string;
  /** 父节点ID */
  parentId: number;
  /** 跳转路径 */
  url: string;
  /** 排序 */
  sort: number;
  /** 小图标 */
  icon: string;
}
