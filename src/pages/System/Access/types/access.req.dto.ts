export class AccessReqDto {
  /** 节点类型, 表示模块顶级模块: 1, 表示菜单: 2, 操作(API): 3 */
  type: string | number;

  /** 模块名称 */
  moduleName?: string;

  /** 菜单名称或API名称 */
  actionName?: string;

  /** 小图标 */
  icon?: string;

  /** url地址 */
  url?: string;

  /** 请求方式 */
  method?: string;

  /** 父节点模块id */
  parentId?: number;

  /** 排序 */
  sort?: number;

  /** 状态 */
  status?: number;

  /** 描述 */
  description?: string;

  /** 接口名称 */
  apiName?: string;
}
