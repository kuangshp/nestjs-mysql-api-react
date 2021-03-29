export interface IApiBaseResDto<T> {
  result?: T;
  code: number;
  message: string;
}
