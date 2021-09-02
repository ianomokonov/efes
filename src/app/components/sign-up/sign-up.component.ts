import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { UserService } from '../../_services/back/user.service';
import { isFormInvalid } from '../../_utils/formValidCheck';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public showPassword = false;
  public showPasswordConfirm = false;
  public roles: IdNameResponse[] = [];

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.signUpForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        login: ['', [Validators.required]],
        phone: [''],
        password: ['', [Validators.required]],
        passwordConfirm: [''],
        roleId: [null, Validators.required],
      },
      { validators: this.checkPasswords },
    );
  }

  public ngOnInit(): void {
    this.userService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  public signUp() {
    if (isFormInvalid(this.signUpForm)) {
      return;
    }

    const signUpData = this.signUpForm?.getRawValue();
    delete signUpData.passwordConfirm;
    this.userService.signUp(signUpData).subscribe(
      (user) => {
        if (user) {
          this.router.navigate(['/profile']);
        }
      },
      // eslint-disable-next-line no-alert
      ({ error }) => alert(error?.message),
    );
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('passwordConfirm')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };
}
