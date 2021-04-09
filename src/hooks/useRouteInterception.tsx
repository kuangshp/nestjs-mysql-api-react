import { useSelector } from 'dva';
import { MenusState } from 'src/models/menus';
import { useMount } from 'ahooks';
import { History } from 'history';
import { storage } from 'src/utils';
import { authToken } from 'src/config';
const whiteList = ['/home', '/login'];
const useRouteInterception = (history: History) => {
  const { menusList } = useSelector((state: any): MenusState => state.present.menus);
  useMount(() => {
    history.listen(({ pathname }) => {
      if (!storage.getItem(authToken)) {
        history.replace('/login');
      }
      console.log('menus --->', menusList);
      const find = menusList.find(({ url }) => pathname.slice(1) === url);
      if (!whiteList.includes(pathname) && !find) {
        console.warn('没有该路径权限');
        history.replace('/home');
      }
    });
  });
};
export default useRouteInterception;
