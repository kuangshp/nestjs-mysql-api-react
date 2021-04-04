import BaseService from './../../base';

class AccessService extends BaseService {
  // 根据父节点id获取资源列表
  async accessListByParentId(queryOptions?: any): Promise<any> {
    return await this.get('/admin/access', queryOptions);
  }
}

export default new AccessService();
