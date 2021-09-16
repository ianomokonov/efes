import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'efes-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {}
