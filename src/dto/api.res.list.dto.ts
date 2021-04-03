export class ApiListResDto<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageNumber: number;
  constructor(data: T[]) {
    this.data = data;
  }
}
