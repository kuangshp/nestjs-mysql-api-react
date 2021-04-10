import React, { useMemo } from 'react';
import { useHistory, useSelector } from 'dva';
import { MenusState } from 'src/models/menus';
import { useMount } from 'ahooks';
import { storage } from 'src/utils';
import { authToken } from 'src/config';
import NoAuth from './noAuth';

const whiteList = ['/home', '/login'];
interface IProps {
  path: string;
}
const AuthRoute: React.FC<IProps> = ({ path, children }) => {
  const { menusList } = useSelector((state: any): MenusState => state.present.menus);
  const history = useHistory();
  const hasAuth = useMemo(() => {
    const find = menusList.find(({ url }) => path.slice(1) === url);

    if (find || whiteList.includes(path)) {
      return true;
    }
    console.warn('没有该路径权限');
    return false;
  }, [menusList]);
  useMount(() => {
    if (!storage.getItem(authToken)) {
      history.replace('/login');
    }
  });
  return <>{hasAuth ? children : <NoAuth />}</>;
};
export default AuthRoute;
