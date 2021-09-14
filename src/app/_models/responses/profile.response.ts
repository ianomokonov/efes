import { Company } from 'src/app/_entities/company.entity';
import { Document } from 'src/app/_entities/document.entity';
import { ValueDateResponse } from './value-date.response';

export interface ProfileResponse {
  documents: Document[];
  company: Company | null;
  completeOrders: ValueDateResponse[];
  views: ValueDateResponse[];
  totalSums: ValueDateResponse[];
}
