export class IApiListResDto<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageNumber: number;
  constructor(data: T[]) {
    this.data = data;
  }
}
