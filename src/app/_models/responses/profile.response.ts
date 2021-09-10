import { Document } from 'src/app/_entities/document.entity';
import { ValueDateResponse } from './value-date.response';

export interface ProfileResponse {
  documents: Document[];
  completeOrders: ValueDateResponse[];
  views: ValueDateResponse[];
  totalSums: ValueDateResponse[];
}
