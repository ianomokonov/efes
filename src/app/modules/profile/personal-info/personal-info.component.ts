import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../_entities/user.entity';
import { ModalService } from '../../../components/modal/modal.service';
import { EditPersonalInfoComponent } from '../_modals/edit-personal-info/edit-personal-info.component';
import { baseModalButton } from '../../../_utils/constants';

@Component({
  selector: 'efes-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class PersonalInfoComponent {
  @Input()
  public user: User | undefined;

  constructor(
    private modalService: ModalService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    @Inject(Injector) private readonly injector: Injector,
  ) {}

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
