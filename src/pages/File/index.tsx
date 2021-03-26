import React, { PropsWithChildren } from 'react';
import { RouteComponentProps } from 'dva/router';
import { Button } from 'antd';
import { connect } from 'dva';
type Props = PropsWithChildren<RouteComponentProps>;

const File = (props: Props) => {
  console.log(props, '文件组件中的');
  return (
    <div>
      <h4>文件中心</h4>
      <Button type="primary" onClick={() => props.history.push('/system/account')}>
        到账号管理页面
      </Button>
    </div>
  );
};

export default connect()(File);
