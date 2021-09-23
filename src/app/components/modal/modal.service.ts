import { Injectable } from '@angular/core';
import { AbstractTuiDialogService } from '@taiga-ui/cdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ModalOptions } from './modal.interface';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService extends AbstractTuiDialogService<ModalOptions> {
  protected readonly defaultOptions: ModalOptions = {
    heading: 'Подтвердите действие',
    buttons: [
      {
        label: 'Нет',
        appearance: 'danger',
        value: false,
      },
      {
        label: 'Да',
        value: true,
      },
    ],
  } as const;
  protected readonly component = new PolymorpheusComponent(ModalComponent);
}
