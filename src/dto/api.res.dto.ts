export interface ApiResDto<T> {
  result?: T;
  code: number;
  message: string;
}
