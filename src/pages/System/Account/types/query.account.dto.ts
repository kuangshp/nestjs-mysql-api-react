import { ApiQueryDto } from 'src/dto/api.query.dto';

export class QueryAccountDto extends ApiQueryDto {
  /** 用户名 */
  username?: string;
  /**邮箱地址 */
  email?: string;
  /** 手机号码 */
  mobile?: string;
  /** 状态 */
  status?: string | number;
  /** 平台 */
  platform?: string | number;
}
