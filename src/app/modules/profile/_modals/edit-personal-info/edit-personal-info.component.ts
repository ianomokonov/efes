import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  OnInit,
  Injector,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDestroyService, TuiDialog, TuiStringHandler } from '@taiga-ui/cdk';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { TuiNotification, TuiNotificationsService, TuiValueContentContext } from '@taiga-ui/core';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../_services/back/user.service';
import { ModalOptions } from '../../../../components/modal/modal.interface';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { IdNameResponse } from '../../../../_models/responses/id-name.response';
import { User } from '../../../../_entities/user.entity';
import { baseModalButton } from '../../../../_utils/constants';
import { ModalService } from '../../../../components/modal/modal.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Заполните поле',
        email: 'Email некорректен',
      },
    },
  ],
})
export class EditPersonalInfoComponent implements OnInit {
  public userForm: FormGroup;
  public roles: IdNameResponse[] = [];
  private user: User | undefined;
  public readonly content: TuiStringHandler<TuiValueContentContext<number>> = ({ $implicit: id }) =>
    this.getRoleById(id) ? `${this.getRoleById(id)?.name}` : '';
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    public cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService,
    @Inject(POLYMORPHEUS_CONTEXT) public readonly context: TuiDialog<ModalOptions, boolean>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
    @Inject(Injector) private readonly injector: Injector,
  ) {
    const saveButton = this.context.buttons ? this.context.buttons[1] : undefined;
    const passwordButton = this.context.buttons ? this.context.buttons[0] : undefined;
    if (saveButton) {
      saveButton.value = () => this.onSave();
      saveButton.voidType = true;
    }
    if (passwordButton) {
      passwordButton.value = () => this.changePassword();
      passwordButton.voidType = true;
    }
    this.userForm = this.fb.group({
      surname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      roleId: [null, Validators.required],
    });
    this.user = this.context.data;
    if (this.user) this.userForm.patchValue(this.user);
  }

  ngOnInit() {
    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles;
      const roleId = this.user?.roleId;
      if (roleId) this.userForm.get('roleId')?.setValue(roleId.toString());
    });
  }

  public onSave(): void {
    if (isFormInvalid(this.userForm, this.cdr)) return;
    const data = this.userForm?.getRawValue();
    this.userService.updateUser(data).subscribe(
      (res) => {
        if (res) {
          this.context.completeWith({ ...data, roleName: this.getRoleById(data.roleId)?.name });
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

  public changePassword(): void {
    this.modalService
      .open<boolean>(new PolymorpheusComponent(ChangePasswordComponent), {
        heading: 'Смена пароля',
        buttons: baseModalButton,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        console.log(result);
      });
  }

  private getRoleById(id: number): IdNameResponse | undefined {
    return this.roles.find((role) => role.id === id);
  }
}
