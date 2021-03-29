import React from 'react';
import { Layout } from 'antd';
import styles from './index.module.less';
import { connect } from 'dva';
const { Footer } = Layout;

const AppFooter = () => {
  return <Footer className={styles.footer}>版权所有</Footer>;
};

export default connect()(AppFooter);
