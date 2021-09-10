import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { TuiValueContentContext } from '@taiga-ui/core';
import { UserService } from '../../_services/back/user.service';
import { isFormInvalid } from '../../_utils/formValidCheck';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less'],
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public roles: IdNameResponse[] = [];
  public readonly content: TuiStringHandler<TuiValueContentContext<number>> = ({ $implicit: id }) =>
    this.getRoleById(id) ? `${this.getRoleById(id)?.name}` : '';

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      password: ['', [Validators.required]],
      roleId: [null, Validators.required],
    });
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

    const signUpData = this.signUpForm.getRawValue();
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

  private getRoleById(id: number): IdNameResponse | undefined {
    return this.roles.find((role) => role.id === id);
  }
}
