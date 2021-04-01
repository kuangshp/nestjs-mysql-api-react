import React from 'react';
import Mock from 'mockjs';
import { useRequest } from 'ahooks';
import { connect } from 'dva';

function getUsername(): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Mock.mock('@name'));
    }, 1000);
  });
}

const Role: React.FC = () => {
  const { data, error, loading } = useRequest(getUsername);

  if (error) {
    return <div>failed to load</div>;
  }
  if (loading) {
    return <div>loading...</div>;
  }

  return <div>role页面:{data}</div>;
};

export default connect()(Role);
