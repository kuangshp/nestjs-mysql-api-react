import BaseService from './../../base';

class RoleAccessService extends BaseService {
  // 根据角色id获取菜单
  async menusListByRoleId(roleId: number): Promise<any> {
    return await this.get(`/admin/role_access/${roleId}/2`);
  }
  // 根据角色id获取Api接口
  async apiListByRoleId(roleId: number): Promise<any> {
    return await this.get(`/admin/role_access/${roleId}/3`);
  }
}

export default new RoleAccessService();
