import BaseService from './../base';
import { MenusResDto } from '../../Layout/AppSider/types/menu.res.dto';

class MenusService extends BaseService {
  // 获取全部的授权菜单
  async menusList(): Promise<MenusResDto[]> {
    return await this.get<MenusResDto[]>('/admin/menus');
  }
}

export default new MenusService();
