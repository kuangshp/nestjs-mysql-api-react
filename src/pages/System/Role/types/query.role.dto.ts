import { ApiQueryDto } from 'src/dto/api.query.dto';

export class QueryRoleDto extends ApiQueryDto {
  /** 角色名称 */
  name?: string;
  /** 角色状态 */
  status?: number | string;
}
