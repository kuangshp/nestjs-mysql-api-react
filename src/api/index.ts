import dev from './dev';
import fat from './fat';
import uat from './uat';
import pro from './pro';
import { ObjectType, IApiObject } from '../typings';

/**
 * 根据当前环境返回匹配的url地址
 * @param env
 */
const getApi = (env: string): IApiObject => {
  const apiObj: ObjectType = {
    development: dev,
    fat,
    uat,
    production: pro,
  };
  return apiObj[env];
};
console.log(process.env.NODE_ENV, '当前环境');
export const { prefix, iamPrefix, fileFix } = getApi(process.env.NODE_ENV);
