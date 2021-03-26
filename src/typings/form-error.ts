import { ObjectType } from '.';

export interface FormError {
  errorFields: ObjectType[];
  outOfDate: boolean;
  values: string;
}
