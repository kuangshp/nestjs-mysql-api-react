import dva from 'dva';
import React from 'react';
import createHistory from 'history/createBrowserHistory';
import './assets/style/global.less';
import 'antd/dist/antd.css';
import globalModel from 'src/models/global';
import loginModel from 'src/models/login';
import accessModel from 'src/models/access';
import accountModel from 'src/models/account';
import createLoading from 'dva-loading';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import routeConfig from 'src/router';
import 'moment/locale/zh-cn';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';
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
  extraEnhancers: [
    createStore => (...args) => {
      const store: any = createStore(...args);
      const persistor = persistStore(store);
      store.persistor = persistor;
      return store;
    },
  ],
});

app.use(createLoading());
app.model(globalModel);
app.model(loginModel);
app.model(accessModel);
app.model(accountModel);
app.router(routeConfig as any);

const App = app.start();

ReactDOM.render(
  <PersistGate persistor={(app as any)._store.persistor}>
    <ConfigProvider
      locale={zhCN}
      getPopupContainer={() => document.getElementById('root') || document.createElement('div')}
    >
      <App />
    </ConfigProvider>
  </PersistGate>,
  document.getElementById('root')
);

// https://www.npmjs.com/package/redux-persist
