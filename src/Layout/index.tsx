import React, { PropsWithChildren } from 'react';
import { Layout } from 'antd';
import AppSider from './AppSider';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import './index.less';
import { connect } from 'dva';

const { Content } = Layout;

const LayoutPage: React.FC = props => {
  return (
    <div className="layout">
      <Layout className="content">
        {/* 侧边导航 */}
        <AppSider />
        {/* 右侧内容区域 */}
        <Layout className="view">
          <AppHeader />
          <Content className="view-content">
            <div className="container">
              {/* 内容区域 */}
              {props.children}
            </div>
          </Content>
          {/* 底部版权 */}
          <AppFooter />
        </Layout>
      </Layout>
    </div>
  );
};

export default connect()(LayoutPage);
