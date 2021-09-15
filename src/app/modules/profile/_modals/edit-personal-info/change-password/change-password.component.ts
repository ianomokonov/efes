import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialog } from '@taiga-ui/cdk';
import { UserService } from '../../../../../_services/back/user.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { ModalOptions } from '../../../../../components/modal/modal.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Заполните поле',
        checkPasswords: 'Пароли не совпадают',
      },
    },
  ],
})
export class ChangePasswordComponent {
  public passwordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT) public readonly context: TuiDialog<ModalOptions, boolean>,
  ) {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: [''],
      },
      { validators: this.checkPasswords },
    );
    const saveButton = this.context.buttons ? this.context.buttons[0] : undefined;
    if (saveButton) {
      saveButton.value = () => this.onSubmit();
      saveButton.voidType = true;
    }
  }

  public onSubmit(): void {
    if (isFormInvalid(this.passwordForm, this.cdr)) return;
    const password = this.passwordForm.controls.password.value;
    this.userService.setNewPassword(password).subscribe((response) => {
      console.log(response);
    });
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };
}
