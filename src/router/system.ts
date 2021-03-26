const SystemRoute = [
  {
    id: 'system/account',
    name: '账号',
    path: '/system/account',
    component: () => import('src/pages/System/Account'),
  },
  {
    id: 'system/role',
    name: '角色',
    path: '/system/role',
    component: () => import('src/pages/System/Role'),
  },
];
export default SystemRoute;
