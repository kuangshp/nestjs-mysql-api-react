import { ApiListResDto } from 'src/dto/api.res.list.dto';
import { ApiResDto } from 'src/dto/api.res.dto';

export class AccountResDto extends ApiResDto {
  username: string;
  mobile: string;
  email: string;
  status: number;
  platform: number;
  isSuper: number;
  lastLoginIp: string;
  lastLoginAddress: string;
  lastLoginTime: Date;
}

export class AccountListResDto extends ApiListResDto<AccountResDto> {
  constructor(data: AccountResDto[]) {
    super(data);
  }
}

export class AccountTableDto {
  list: AccountResDto[];
  total: number;
}
