import BaseService from './../../base';
import { AccessReqDto } from 'src/pages/System/Access/types/access.req.dto';
import { QueryAccessDto } from 'src/pages/System/Access/types/query.access.dto';
import { AccessListResDto } from 'src/pages/System/Access/types/access.res.dto';

class AccessService extends BaseService {
  // 创建资源
  async createAccess(postData: AccessReqDto): Promise<string> {
    return await this.post<string>('/admin/access', postData);
  }

  // 修改资源
  async modifyAccessById(id: number, params: AccessReqDto): Promise<string> {
    return await this.patch<string>('/admin/access', id, params);
  }

  // 根据id删除资源
  async deleteAccessById(id: number): Promise<string> {
    return await this.delete<string>('/admin/access', id);
  }

  // 根据父节点id获取资源列表
  async accessListByParentId(queryOptions?: QueryAccessDto): Promise<AccessListResDto> {
    return await this.get<AccessListResDto>('/admin/access', queryOptions);
  }
}

export default new AccessService();
