import React from 'react';
import { connect, useSelector } from 'dva';

const Home: React.FC = () => {
  const state = useSelector((state: any) => state.present);
  console.log(state, '首页数据');
  return <div>主页</div>;
};

export default connect()(Home);
