import * as querystring from 'querystring';
import { isString } from './data-type';
import { ObjectType } from '../typings';

/**
 * @Author: 水痕
 * @Date: 2020-01-24 13:16:17
 * @LastEditors: 水痕
 * @Description: 将对象转换为字符串
 * eg.对象转换为name=hello&age=20
 * @param {type}
 * @return:
 */
export const object2str = (data: ObjectType): string => {
  return querystring.stringify(data);
};

/**
 * @Author: 水痕
 * @Date: 2020-01-24 19:38:49
 * @LastEditors: 水痕
 * @Description: 过滤对象中空的提交到后台
 * @param {type}
 * @return:
 */
export const fileObjectField = (data: ObjectType): ObjectType => {
  return Object.keys(data).reduce((cur: ObjectType, next) => {
    if (Array.isArray(data[next])) {
      if (data[next].length) {
        cur[next] = data[next];
      }
    } else {
      if (data[next] || /^\d+$/.test(data[next])) {
        cur[next] = data[next];
      }
    }
    return cur;
  }, {});
};

/**
 * @Author: 水痕
 * @Date: 2020-01-27 09:47:14
 * @LastEditors: 水痕
 * @Description: 去除对象value的前后空格
 * @param {type}
 * @return:
 */
export const trimObject = (data: ObjectType): ObjectType => {
  return Object.keys(data).reduce((cur: ObjectType, next) => {
    cur[next] =
      data[next] && isNaN(data[next]) && isString(data[next]) ? data[next].trim() : data[next];
    return cur;
  }, {});
};

/**
 * @Author: 水痕
 * @Date: 2020-01-27 10:09:20
 * @LastEditors: 水痕
 * @Description: 对url地址的参数加以处理
 * @param {type}
 * @return:
 */
export const urlObjectParams = (data: ObjectType): string => {
  return object2str(fileObjectField(trimObject(data)));
};

/**
 * @Author: 水痕
 * @Date: 2020-05-11 17:55:56
 * @LastEditors: 水痕
 * @Description: 定义一个方法根据数组对象中的key值获取值
 * @param {type}
 * @return:
 */
export const getArrayValue = (
  key: string,
  array: ObjectType[] = []
): string | number | undefined => {
  for (const item of array) {
    if (item.key === key) {
      return item.value;
    }
  }
  return undefined;
};

/**
 * @Author: 水痕
 * @Date: 2020-05-11 17:55:49
 * @LastEditors: 水痕
 * @Description: 定义一个方法根据id返回列表的对象
 * @param {type}
 * @return:
 */
export const getArrayObj = (id: number, array: ObjectType[] = []): ObjectType | undefined => {
  for (const item of array) {
    if (item.id === id) {
      return item;
    }
  }
  return undefined;
};
