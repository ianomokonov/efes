import { ValueDateResponse } from '../_models/responses/value-date.response';
import { Company } from '../_entities/company.entity';
import { Document } from '../_entities/document.entity';

export function rateChartBuild(
  documents: Document[],
  company: Company | null,
): ValueDateResponse[] {
  const length = documents.length + 1;
  let addedInfo = 0;
  if (company) {
    addedInfo += 1;
  }
  documents.forEach((document) => {
    if (document.file) addedInfo += 1;
  });
  const result = Math.round((addedInfo / length) * 100);
  return [
    {
      name: 'Не заполнено',
      value: 100 - result,
    },
    {
      name: 'Заполнено',
      value: result,
    },
  ];
}
