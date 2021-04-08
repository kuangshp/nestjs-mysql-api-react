const SystemRoute = [
  {
    id: 'system/account',
    name: '账号管理',
    path: '/system/account',
    component: () => import('src/pages/System/Account'),
    // models: () => [import('src/models/system/account')],
  },
  {
    id: 'system/role',
    name: '角色管理',
    path: '/system/role',
    component: () => import('src/pages/System/Role'),
    // models: () => [import('src/models/system/role')],
  },
  {
    id: 'system/access',
    name: '资源管理',
    path: '/system/access',
    component: () => import('src/pages/System/Access'),
    // models: () => [import('src/models/system/access')],
  },
];
export default SystemRoute;
