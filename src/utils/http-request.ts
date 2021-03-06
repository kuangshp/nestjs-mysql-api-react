import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { storage } from './storage';
import { authToken } from '../config';
import { message as Message } from 'antd';

const prefix: string = <string>process.env.REACT_APP_BASE_API_URL;
const iamPrefix: string = <string>process.env.REACT_APP_BASE_IMG_URL;

class HttpRequest {
  constructor() {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios.defaults.timeout = 60 * 1000;
    // 拦截请求的
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) => this.request(config),
      (rejection: { data: any }) => this.requestError(rejection)
    );
    // 拦截响应
    axios.interceptors.response.use(
      (res: AxiosResponse) => this.response(res),
      (error: AxiosError) => this.responseError(error)
    );
  }
  /**
   * 成功请求的方法
   * @param config
   */
  private request(config: AxiosRequestConfig) {
    // 配置请求头
    config.headers['X-Origin'] = 'admin-web';
    config.headers[authToken] = storage.getItem(authToken);
    // 处理请求地址
    const input = config.url as string;
    if (this.isHttpUrl(input)) {
      config.url = input;
    } else if (this.isIamUrl(input)) {
      config.url = `${iamPrefix}${input}`;
    } else {
      config.url = `${prefix}${input}`;
    }
    return config;
  }

  /**
   * 失败请求的方法
   * @param rejection
   */
  private requestError(rejection: { data: any }) {
    return this.useOrigin(rejection) ? Promise.reject(rejection) : Promise.reject(rejection.data);
  }

  /**
   * 成功响应的方法
   * @param response
   */
  private response(response: AxiosResponse) {
    const status = response.status;
    if ((status >= 200 && status < 300) || status === 304) {
      console.log(response, '路由中');
      if (response?.data) {
        const { code, message, result } = response.data;
        if (Object.is(code, 0)) {
          return Promise.resolve(result);
        } else {
          Message.error(message);
          return Promise.resolve(null);
        }
      } else {
        return Promise.reject(response);
      }
      // return this.isPlainRequest(response.config.url as string) || this.useOrigin(response)
      //   ? Promise.resolve(response)
      //   : Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  }

  /**
   * 响应失败的方法(根据自己的业务逻辑写)
   * @param error
   */
  private responseError(error: AxiosError) {
    if (error.response && error.response.status) {
      let $path: string = '';
      let $errorInfo: string = '';
      if (error.response.data) {
        const { path, data } = error.response.data;
        $path = path;
        $errorInfo = Array.isArray(data.error) ? data.error.join(',') : data.error;
      }
      switch (error.response.status) {
        case 400:
          console.log(`错误的请求:${$path}-${$errorInfo}`);
          break;
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        case 401:
          console.log('你没有登录,请先登录');
          window.location.reload();
          break;
        // 跳转登录页面
        case 403:
          console.log('登录过期，请重新登录');
          // 清除全部的缓存数据
          window.localStorage.clear();
          window.location.reload();
          break;

        // 404请求不存在
        case 404:
          console.log('网络请求不存在');
          break;
        // 其他错误，直接抛出错误提示
        default:
          console.log('我也不知道是什么错误');
          break;
      }
    }
    return error.response ? Promise.reject(error.response) : Promise.reject(error);
  }

  private isHttpUrl(input: string) {
    return /^https?:\/\//.test(input);
  }

  // 判断是不是图片请求
  private isIamUrl(input: string) {
    return /^(sso|iam|iam-.*)\//.test(input);
  }

  // private isPlainRequest(input: string) {
  //   return /\.(html?|xml|txt)$/.test(input);
  // }

  private useOrigin(res: any) {
    return res.config.useOrigin;
  }
}

export const httpRequest = new HttpRequest();
