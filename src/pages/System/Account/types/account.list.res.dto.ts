import { IApiListResDto } from 'src/dto/api.res.list.dto';

export class AccountResDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  mobile: string;
  email: string;
  status: number;
  platform: number;
  lastLoginIp: string;
  lastLoginAddress: string;
  lastLoginTime: Date;
}

export class AccountListResDto extends IApiListResDto<AccountResDto> {
  constructor(data: AccountResDto[]) {
    super(data);
  }
}
