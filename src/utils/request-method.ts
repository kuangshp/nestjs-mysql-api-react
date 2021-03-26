import axios from 'axios';
import { fileObjectField, urlObjectParams } from '.';
import { ObjectType } from '../typings';

interface CustomSuccessData<T> {
  code: number;
  message?: string;
  result?: T;
  data?: T;
  [keys: string]: any;
}

// 提供get请求方法
export const axiosGet = async <T>(
  url: string,
  params: ObjectType = {}
): Promise<CustomSuccessData<T>> => {
  if (params) {
    return await axios.get(`${url}?${urlObjectParams(params)}`);
  } else {
    return await axios.get(url);
  }
};

// 提供post请求
export const axiosPost = async <T>(
  url: string,
  postData: ObjectType
): Promise<CustomSuccessData<T>> => {
  return await axios.post(url, fileObjectField(postData));
};

// 提供patch请求
export const axiosPatch = async <T>(
  url: string,
  id: number | string,
  postData: ObjectType
): Promise<CustomSuccessData<T>> => {
  return await axios.patch(`${url}/${id}`, postData);
};

// 提供delete请求
export const axiosDelete = async <T>(
  url: string,
  id: number | string
): Promise<CustomSuccessData<T>> => {
  return await axios.delete(`${url}/${id}`);
};
