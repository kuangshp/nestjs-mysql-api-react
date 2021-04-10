import dva from 'dva';
import React from 'react';
import createHistory from 'history/createHashHistory';
// import createHistory from 'history/createBrowserHistory';
import './assets/style/global.less';
import 'antd/dist/antd.css';
import createLoading from 'dva-loading';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import routeConfig from 'src/router';
import 'moment/locale/zh-cn';
import { createLogger } from 'redux-logger';
import models from './models';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import undoable from 'redux-undo';

const persistConfig = {
  key: 'root',
  storage,
};

const app = dva({
  history: createHistory({
    basename: 'admin-web', // 配置项目名,可以不写
  }),
  onReducer: reducer => {
    const undoReducer = undoable(reducer);
    const rootReducer = persistReducer(persistConfig, undoReducer);
    return (state: any, action: any) => {
      const newState: any = rootReducer(state, action);
      return { ...newState, router: newState.present.router };
    };
  },
  // extraEnhancers: [
  //   createStore => (...args) => {
  //     const store: any = createStore(...args);
  //     const persistor = persistStore(store);
  //     store.persistor = persistor;
  //     return store;
  //   },
  // ],
});
app.use({ onAction: createLogger() });
app.use(createLoading());
models.forEach(m => {
  app.model(m);
});

app.router(routeConfig as any);
const App = app.start();
ReactDOM.render(
  <ConfigProvider
    locale={zhCN}
    getPopupContainer={() => document.getElementById('root') || document.createElement('div')}
  >
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);

// https://www.npmjs.com/package/redux-persist
