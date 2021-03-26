import React from 'react';
import { Layout } from 'antd';
import './index.less';
import { connect } from 'dva';
const { Footer } = Layout;

const AppFooter = () => {
  return <Footer className="footer">版权所有</Footer>;
};

export default connect()(AppFooter);
