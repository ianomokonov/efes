import { ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDestroyService, TuiDialog } from '@taiga-ui/cdk';
import { FormControl } from '@angular/forms';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ButtonsInterface, ModalOptions } from '../../../../components/modal/modal.interface';
import { UserService } from '../../../../_services/back/user.service';

@Component({
  selector: 'efes-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [TuiDestroyService],
})
export class FilesComponent {
  public fileControl: FormControl;
  private readonly button: ButtonsInterface | undefined;
  public upLoad: boolean = false;
  constructor(
    private userService: UserService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialog<ModalOptions, boolean | string>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {
    this.fileControl = new FormControl();
    this.button = this.context.buttons ? this.context.buttons[0] : undefined;
    if (this.button) {
      this.button.value = () => this.onSave();
      this.button.voidType = true;
    }
  }

  public onSave(): void {
    this.upLoad = true;
    if (this.button) this.button.disabled = true;
    this.cdr.detectChanges();
    const file: File = this.fileControl.value;
    const { documentId } = this.context.data;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);
    this.userService.saveDocument(formData).subscribe(
      (res) => {
        if (res) {
          if (this.button) this.button.disabled = false;
          this.upLoad = false;
          this.cdr.detectChanges();
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
        if (this.button) this.button.disabled = false;
        this.upLoad = false;
        this.cdr.detectChanges();
      },
    );
  }
}
