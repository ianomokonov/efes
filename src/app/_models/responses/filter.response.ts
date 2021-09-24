import { IdNameResponse } from './id-name.response';

export interface FilterResponse {
  name: string;
  key: string;
  values: IdNameResponse[];
}
