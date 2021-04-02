import moment from 'moment';
import { isString } from 'util';

/**
 * @Author: 水痕
 * @Date: 2021-04-02 13:05:40
 * @LastEditors: 水痕
 * @Description: 时间转换工具
 * @param {Date} dateNum 时间
 * @param {boolean} isDue 是否要显示时分秒
 * @return {*}
 */
export const formatDate = (dateNum: Date | string | number, isDue: boolean = false): string => {
  if (!dateNum) {
    return '';
  }
  if (isString(dateNum) && /^\d+$/g.test(dateNum)) {
    dateNum = Number.parseInt(dateNum);
  }
  if (isDue) {
    return moment(dateNum).format('YYYY-MM-DD');
  } else {
    return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
  }
};
