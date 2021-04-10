import React from 'react';
import { useHistory } from 'dva';
import { useMount } from 'ahooks';
import { message } from 'antd';

const NoAuth: React.FC = () => {
  const history = useHistory();
  useMount(() => {
    message.error('没有权限 即将返回').then(
      () => {
        history.replace('/home');
      },
      () => {
        console.log();
      }
    );
  });

  return <></>;
};
export default NoAuth;
