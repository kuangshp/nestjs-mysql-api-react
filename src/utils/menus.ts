import { ObjectType } from './../typings/obj-type';
import * as _ from 'lodash';
/**
 * @Author: 水痕
 * @Date: 2021-04-05 16:09:38
 * @LastEditors: 水痕
 * @Description: 将数组转换为树结构
 * @param {*}
 * @return {*}
 */
export const getTreeList = (oldDataList: ObjectType[], sortField = ''): any => {
  if (!Array.isArray(oldDataList)) {
    throw new TypeError(`${oldDataList}不是数组`);
  }
  const dataList: ObjectType[] = _.cloneDeep(oldDataList);
  // 第一次是将全部的permissionId作为对象的key重组成一个对象
  const formatObj = dataList.reduce((pre, cur) => {
    return { ...pre, [cur['id']]: cur };
  }, {});
  // 排序
  const sortArray = sortField ? dataList.sort((a, b) => a[sortField] - b[sortField]) : dataList;
  const formatArray = sortArray.reduce((arr, cur) => {
    const pid = cur.parentId ? cur.parentId : 0;
    const parent = formatObj[pid];
    if (parent) {
      parent.children ? parent.children.push(cur) : (parent.children = [cur]);
    } else {
      arr.push(cur);
    }
    return arr;
  }, []);
  return formatArray;
};
