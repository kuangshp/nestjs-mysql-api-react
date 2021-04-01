import { IApiListResDto } from 'src/dto/api.res.list.dto';

export class AccountResDto {
  // TODO
}

export class AccountListResDto extends IApiListResDto<AccountResDto> {
  constructor(data: AccountResDto[]) {
    super(data);
  }
}
