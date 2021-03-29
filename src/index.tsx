import dva from 'dva';
import React from 'react';
import createHistory from 'history/createBrowserHistory';
import './assets/style/global.less';
import 'antd/dist/antd.css';
import globalModel from 'src/models/global';
import createLoading from 'dva-loading';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import routeConfig from 'src/router';
import 'moment/locale/zh-cn';

const app = dva({
  history: createHistory({
    basename: 'admin-web', // 配置项目名,可以不写
  }),
});

app.use(createLoading());
app.model(globalModel);
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
