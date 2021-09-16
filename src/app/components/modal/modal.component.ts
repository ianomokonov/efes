import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialog } from '@taiga-ui/cdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ModalOptions } from './modal.interface';

@Component({
  selector: 'efes-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public readonly context: TuiDialog<ModalOptions, boolean>,
  ) {}

  public onClick(value: any) {
    if (typeof value === 'boolean') {
      this.context.completeWith(value);
    }
  }
}
