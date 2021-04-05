import BaseService from './../../base';
import { RoleMenusResDto } from 'src/pages/System/Role/types/role.menus.res.dto';
import { RoleMenuAuthResDto } from 'src/pages/System/Role/types/role.menu.auth.res.dto';

class RoleAccessService extends BaseService {
  // 根据角色id获取已经授权的菜单
  async authMenusListByRoleId(roleId: number): Promise<RoleMenuAuthResDto[]> {
    return await this.get<RoleMenuAuthResDto[]>(`/admin/role_access/${roleId}/2`);
  }
  // 根据角色id获取已经授权的Api接口
  async authApiListByRoleId(roleId: number): Promise<RoleMenuAuthResDto[]> {
    return await this.get<RoleMenuAuthResDto[]>(`/admin/role_access/${roleId}/3`);
  }

  // 给当前角色分配菜单
  async dispatchMenuToRole(postData: any): Promise<string> {
    return await this.post<string>('/admin/role_access/menus', postData);
  }

  //获取全部的菜单
  async allMenusList(): Promise<RoleMenusResDto[]> {
    return await this.get<RoleMenusResDto[]>('/admin/role_access/all_menus');
  }
}

export default new RoleAccessService();
