import { ApiResDto } from 'src/dto/api.res.dto';
import { ApiListResDto } from 'src/dto/api.res.list.dto';

export class RoleResDto extends ApiResDto {
  /** 角色名称 */
  name: string;
  /** 角色描述 */
  description: string;
  /** 状态 */
  status: number;
  /** 是否为默认 */
  isDefault: number;
}

export class RoleListResDto extends ApiListResDto<RoleResDto> {
  constructor(data: RoleResDto[]) {
    super(data);
  }
}

export class AccountTableDto {
  list: RoleResDto[];
  total: number;
}
