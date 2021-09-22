import { Component, Input } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ValueDateResponse } from '../../../_models/responses/value-date.response';

@Component({
  selector: 'efes-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less'],
})
export class StatisticsComponent {
  @Input()
  public completeOrders: ValueDateResponse[] = [];
  @Input()
  public views: ValueDateResponse[] = [];
  @Input()
  public totalSums: ValueDateResponse[] = [];
  @Input()
  public rates: ValueDateResponse[] = [];
  public pieColorScheme: Color = {
    name: 'Original',
    domain: ['#E7E6E6', '#3ba1ff'],
    selectable: true,
    group: ScaleType.Linear,
  };
  public barColorScheme: Color = {
    name: 'Original',
    domain: ['#3ba1ff'],
    selectable: true,
    group: ScaleType.Linear,
  };
}
