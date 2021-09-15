import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDay, TuiDestroyService, TuiDialog } from '@taiga-ui/cdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { takeUntil } from 'rxjs/operators';
import { ModalOptions } from '../../../../components/modal/modal.interface';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { UserService } from '../../../../_services/back/user.service';
import { SaveCompanyRequest } from '../../../../_models/requests/save-company.request';

@Component({
  selector: 'app-personal-about',
  templateUrl: './personal-about.component.html',
  styleUrls: ['./personal-about.component.less'],
  providers: [
    TuiDestroyService,
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Заполните поле',
      },
    },
  ],
})
export class PersonalAboutComponent {
  public personalAboutForm: FormGroup;
  private readonly company: SaveCompanyRequest;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private destroy$: TuiDestroyService,
    public cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT) public readonly context: TuiDialog<ModalOptions, boolean>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {
    this.personalAboutForm = this.fb.group({
      name: ['', [Validators.required]],
      legalAddress: ['', [Validators.required]],
      actualAddress: ['', [Validators.required]],
      createDate: [null, [Validators.required]],
      taxRegistrationDate: [null, [Validators.required]],
      inn: ['', [Validators.required]],
      correspondentAccount: ['', [Validators.required]],
      ogrn: ['', [Validators.required]],
      bic: ['', [Validators.required]],
      account: ['', [Validators.required]],
      certificateOfProduction: ['', [Validators.required]],
      certificateOfRegistration: ['', [Validators.required]],
      structureDescription: ['', [Validators.required]],
      annualTurnover: ['', [Validators.required]],
      additionalInfo: ['', [Validators.required]],
    });
    const button = this.context.buttons ? this.context.buttons[0] : undefined;
    if (button) {
      button.value = () => this.onSave();
      button.voidType = true;
    }
    this.company = this.context.data;
    if (this.company) {
      this.personalAboutForm.patchValue({
        ...this.company,
        createDate: [TuiDay.fromLocalNativeDate(new Date(this.company.createDate)), null],
        taxRegistrationDate: [
          TuiDay.fromLocalNativeDate(new Date(this.company.taxRegistrationDate)),
          null,
        ],
      });
    }
  }

  public onSave(): void {
    if (isFormInvalid(this.personalAboutForm, this.cdr)) return;
    const data = this.personalAboutForm?.getRawValue();
    data.createDate = data.createDate[0].toUtcNativeDate();
    data.taxRegistrationDate = data.taxRegistrationDate[0].toUtcNativeDate();
    const subscription = this.company
      ? this.userService.updateCompanyInfo(data)
      : this.userService.addCompanyInfo(data);
    subscription.subscribe(
      (res) => {
        if (res) {
          this.context.completeWith(data);
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
