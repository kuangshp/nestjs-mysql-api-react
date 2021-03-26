import SystemRoute from 'src/router/system';

const HomeRoute = [
  {
    id: 'index',
    name: '首页',
    path: '/home',
    component: () => import('src/pages/Home'),
  },
  {
    id: 'file',
    name: '文件管理',
    path: '/file',
    component: () => import('src/pages/File'),
  },
  {
    id: 'system',
    name: '系统',
    path: '/system',
    children: SystemRoute,
  },
];
export default HomeRoute;
