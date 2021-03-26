import React, { ReactNode } from 'react';
import Layout from 'src/Layout';
import dynamic from 'dva/dynamic';
import { Route, Router, Switch } from 'dva/router';
import HomeRoute from 'src/router/home';

export interface IRouteConfig {
  id: string;
  name: string;
  path: string;
  component?: any;
  models?: () => any[];
  children?: IRouteConfig[];
}

function RouterConfig({ history, app }: any) {
  const GlobalRoute: IRouteConfig[] = [
    {
      id: 'login',
      name: '登录',
      path: '/login',
      component: () => import('src/pages/Login'),
      models: () => [import('src/models/login')],
    },
    {
      id: 'index',
      name: '首页',
      path: '/',
      component(children) {
        return <Layout>{children}</Layout>;
      },
      children: HomeRoute,
    },
  ];

  const renderRoutes = (routes: IRouteConfig[]) => {
    return (
      <Switch>
        {routes.map(({ id, path, children, ...otherProps }) =>
          children && children.length ? (
            <React.Fragment key={path}>
              {otherProps.component ? (
                otherProps.component(renderRoutes(children))
              ) : (
                <React.Fragment key={path}>{renderRoutes(children)}</React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <Route
              key={path}
              path={path}
              exact
              component={(dynamic as any)({ app, ...otherProps }) as any}
            />
          )
        )}
      </Switch>
    );
  };
  return <Router history={history}>{renderRoutes(GlobalRoute)}</Router>;
}

export default RouterConfig;
