import React, { Suspense } from 'react';
import PageLoading from '../loading';

// 异步加载
const SuspenseWrapper: (Component: any) => React.NamedExoticComponent<object> = (Component: any) =>
  React.memo(props => (
    <Suspense fallback={<PageLoading />}>
      <Component {...props} />
    </Suspense>
  ));

export default SuspenseWrapper;
