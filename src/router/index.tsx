import React from 'react';
import Layout from 'src/Layout';
import HomeRoute from 'src/router/home';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AuthRoute from 'src/router/auth/authRoute';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dynamic = require('dva').dynamic;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Route, Router, Switch, Redirect } = require('dva').router;

export interface IRouteConfig {
  id: string;
  name: string;
  path: string;
  component?: any;
  // models?: any; // dynamic 的model加载不了 不知为什么
  children?: IRouteConfig[];
}

function RouterConfig({ history, app }: any) {
  const persistor = persistStore(app._store);

  const GlobalRoute: IRouteConfig[] = [
    {
      id: 'login',
      name: '登录',
      path: '/login',
      component: () => import('src/pages/Login'),
    },
    {
      id: 'index',
      name: '首页 ',
      path: '/',
      component(children) {
        return <Layout>{children}</Layout>;
      },
      children: HomeRoute,
    },
  ];

  const renderRoutes = (routes: IRouteConfig[]) => {
    return (
      <PersistGate persistor={persistor}>
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
                render={() => {
                  const DynamicComponent = (dynamic as any)({ app, ...otherProps });
                  return (
                    <AuthRoute path={path}>
                      <DynamicComponent />
                    </AuthRoute>
                  );
                }}
              />
            )
          )}
          {/* 重定向到首页 */}
          <Redirect to="/home" />
        </Switch>
      </PersistGate>
    );
  };
  return <Router history={history}>{renderRoutes(GlobalRoute)}</Router>;
}

export default RouterConfig;
