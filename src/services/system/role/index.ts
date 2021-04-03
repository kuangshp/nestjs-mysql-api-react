import BaseService from './../../base';
import { RoleReqDto } from 'src/pages/System/Role/types/role.req.dto';
import { QueryRoleDto } from 'src/pages/System/Role/types/query.role.dto';

class RoleService extends BaseService {
  // 创建角色
  async createRole(postData: RoleReqDto): Promise<string> {
    return await this.post<string>('/admin/role', postData);
  }
  // 根据角色id删除角色
  async deleteRoleById(id: number): Promise<string> {
    return await this.delete<string>('/admin/role', id);
  }

  // 根据角色id修改数据
  async modifyRoleById(id: number, params: RoleReqDto): Promise<string> {
    return await this.patch<string>('/admin/role', id, params);
  }

  // 根据条件查询角色列表
  async roleList(queryOptions?: QueryRoleDto): Promise<any> {
    return await this.get('/admin/role', queryOptions);
  }
}

export default new RoleService();
