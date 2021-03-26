import React from 'react';
import './index.less';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = () => {
  return (
    <div className="spinBox">
      <Spin indicator={antIcon} />
    </div>
  );
};

export default Loading;
