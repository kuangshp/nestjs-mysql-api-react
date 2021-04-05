import { ApiQueryDto } from 'src/dto/api.query.dto';

export class QueryAccessDto extends ApiQueryDto {
  /** 父节点ID */
  parentId?: number;
}
