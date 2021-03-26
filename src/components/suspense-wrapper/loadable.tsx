import Loadable from 'react-loadable';
import * as React from 'react';
import Loading from '../loading';

const asyncLoader = (fn: any) => {
  return Loadable({
    loader: fn.loader,
    loading: ToastTrue,
    delay: 0,
  });
};

function ToastTrue(params: any) {
  const { pastDelay, error } = params;
  if (pastDelay) {
    return <Loading />;
  } else if (error) {
    return <div>Error!</div>; // 加载错误时的提示模块
  } else {
    return null;
  }
}

export default asyncLoader;
