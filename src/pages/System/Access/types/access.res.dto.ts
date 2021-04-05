import { ApiResDto } from 'src/dto/api.res.dto';
import { ApiListResDto } from 'src/dto/api.res.list.dto';

export class AccessResDto extends ApiResDto {
  moduleName: string | null;
  type: number;
  actionName: string | null;
  icon: string | null;
  url: string | null;
  method: string | null;
  parentId: number;
  sort: number;
  status: number;
  description: string | null;
  apiName: string;
}

export class AccessListResDto extends ApiListResDto<AccessResDto> {
  constructor(data: AccessResDto[]) {
    super(data);
  }
}
