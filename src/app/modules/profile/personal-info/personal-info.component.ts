import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../_services/back/user.service';
import { User } from '../../../_entities/user.entity';
import { ModalService } from '../../../components/modal/modal.service';
import { EditPersonalInfoComponent } from '../_modals/edit-personal-info/edit-personal-info.component';
import { baseModalButton } from '../../../_utils/constants';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class PersonalInfoComponent implements OnInit {
  public user: User | undefined;

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    @Inject(Injector) private readonly injector: Injector,
  ) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  public openPersonalEditModal(): void {
    this.modalService
      .open<User | boolean>(new PolymorpheusComponent(EditPersonalInfoComponent), {
        heading: 'Персональная информация',
        buttons: [
          {
            label: 'Сменить пароль',
            voidType: false,
            appearance: 'secondary',
          },
          ...baseModalButton,
        ],
        data: this.user,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (typeof result !== 'boolean') {
          this.user = result;
          this.user.roleId = Number(result.roleId);
          this.cdr.detectChanges();
        }
      });
  }
}
