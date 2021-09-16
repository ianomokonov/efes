import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDestroyService, TuiDialog } from '@taiga-ui/cdk';
import { FormControl } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { takeUntil } from 'rxjs/operators';
import { ModalOptions } from '../../../../components/modal/modal.interface';
import { UserService } from '../../../../_services/back/user.service';

@Component({
  selector: 'efes-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FilesComponent {
  public fileControl: FormControl;
  constructor(
    private userService: UserService,
    private destroy$: TuiDestroyService,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialog<ModalOptions, boolean | string>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {
    this.fileControl = new FormControl();
    const button = this.context.buttons ? this.context.buttons[0] : undefined;
    if (button) {
      button.value = () => this.onSave();
      button.voidType = true;
    }
  }

  public onSave(): void {
    const file: File = this.fileControl.value;
    const { documentId } = this.context.data;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);
    this.userService.saveDocument(formData).subscribe(
      (res) => {
        if (res) {
          this.context.completeWith(res);
        }
      },
      ({ error }) => {
        this.notificationsService
          .show(error.message, {
            label: 'Ошибка',
            status: TuiNotification.Error,
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      },
    );
  }
}
