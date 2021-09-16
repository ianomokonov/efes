import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'efes-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
