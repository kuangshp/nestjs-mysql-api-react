// 本地订单模拟菜单
export type MenusProps = {
  id: number;
  label: string;
  value: string;
  parentId: number;
  path?: string;
  icon?: string;
  keyPatch?: Array<string>;
  children?: Array<MenusProps>;
};

export const menusDataList: Array<MenusProps> = [
  {
    id: 1,
    label: '文件中心',
    value: '/file',
    parentId: 0,
    keyPatch: ['file'],
  },
  {
    id: 2,
    label: '系统管理',
    value: '/system',
    parentId: 0,
    keyPatch: ['system'],
    children: [
      {
        id: 3,
        label: '账号管理',
        value: '/system/account',
        parentId: 2,
        keyPatch: ['system', 'account'],
      },
      {
        id: 4,
        label: '角色管理',
        value: '/system/role',
        parentId: 2,
        keyPatch: ['system', 'role'],
      },
      {
        id: 5,
        label: '资源管理',
        value: '/system/access',
        parentId: 2,
        keyPatch: ['system', 'access'],
      },
    ],
  },
  {
    id: 5,
    label: '测试',
    value: '/test',
    parentId: 0,
    keyPatch: ['test'],
  },
];
