import BaseService from './../../base';
import { RoleMenusResDto } from 'src/pages/System/Role/types/role.menus.res.dto';
import { RoleMenuAuthResDto } from 'src/pages/System/Role/types/role.menu.auth.res.dto';
import { RoleApiResDto } from 'src/pages/System/Role/types/role.api.res.dto';
import { RoleMenuApiReqDto } from 'src/pages/System/Role/types/role.menu.api.req.dto';

class RoleAccessService extends BaseService {
  // 根据角色id获取已经授权的菜单
  async authMenusListByRoleId(roleId: number): Promise<RoleMenuAuthResDto[]> {
    return await this.get<RoleMenuAuthResDto[]>(`/admin/role_access/${roleId}/2`);
  }
  // 根据角色id获取已经授权的Api接口
  async authApiListByRoleId(roleId: number): Promise<RoleMenuAuthResDto[]> {
    return await this.get<RoleMenuAuthResDto[]>(`/admin/role_access/${roleId}/3`);
  }

  // 给当前角色API分配菜单
  async dispatchMenuApiToRole(roleId: number, postData: RoleMenuApiReqDto): Promise<string> {
    return await this.patch<string>('/admin/role_access/menus', roleId, postData);
  }

  //获取全部的菜单
  async allMenusList(): Promise<RoleMenusResDto[]> {
    return await this.get<RoleMenusResDto[]>('/admin/role_access/all_menus');
  }

  // 获取全部的api
  async allApiList(): Promise<RoleApiResDto[]> {
    return await this.get<RoleApiResDto[]>('/admin/role_access/all_api');
  }
}

export default new RoleAccessService();
