import BaseService from './../../base';

class RoleAccessService extends BaseService {
  // 根据角色id获取已经授权的菜单
  async authMenusListByRoleId(roleId: number): Promise<any> {
    return await this.get(`/admin/role_access/${roleId}/2`);
  }
  // 根据角色id获取已经授权的Api接口
  async authApiListByRoleId(roleId: number): Promise<any> {
    return await this.get(`/admin/role_access/${roleId}/3`);
  }

  //获取全部的菜单
  async allMenusList(): Promise<any> {
    return await this.get('/admin/role_access/all_menus');
  }
}

export default new RoleAccessService();
