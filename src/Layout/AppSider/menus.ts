// 本地订单模拟菜单
export type MenusProps = {
  id: number;
  name: string;
  url: string;
  parentId: number;
  path?: string;
  icon?: string;
  keyPatch?: Array<string>;
  children?: Array<MenusProps>;
};

export const menusDataList: Array<MenusProps> = [
  {
    id: 1,
    name: '文件中心',
    url: '/file',
    parentId: 0,
  },
  {
    id: 2,
    name: '系统管理',
    url: '/system',
    parentId: 0,
    children: [
      {
        id: 3,
        name: '账号管理',
        url: '/system/account',
        parentId: 2,
      },
      {
        id: 4,
        name: '角色管理',
        url: '/system/role',
        parentId: 2,
      },
      {
        id: 5,
        name: '资源管理',
        url: '/system/access',
        parentId: 2,
      },
    ],
  },
  {
    id: 5,
    name: '测试',
    url: '/test',
    parentId: 0,
  },
];
