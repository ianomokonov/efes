import { User } from './user.entity';
import { IdNameResponse } from '../_models/responses/id-name.response';

export interface ServiceEntity {
  id: number;
  isFavorite: boolean;
  name: string;
  creator: User;
  workType: IdNameResponse;
  orderType: IdNameResponse;
  region: IdNameResponse;
  endDate: Date;
}
