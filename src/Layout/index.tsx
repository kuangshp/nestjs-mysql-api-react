import React from 'react';
import { Layout } from 'antd';
import AppSider from './AppSider';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import styles from './index.module.less';

const { Content } = Layout;

const LayoutPage: React.FC = props => {
  return (
    <div className={styles.layout}>
      <Layout className={styles.content}>
        {/* 侧边导航 */}
        <AppSider />
        {/* 右侧内容区域 */}
        <Layout className={styles.view}>
          <AppHeader />
          <Content className={styles.view_content}>
            <div className={styles.container}>
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

export default LayoutPage;
