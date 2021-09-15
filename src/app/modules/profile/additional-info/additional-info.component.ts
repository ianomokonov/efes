import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { UserService } from '../../../_services/back/user.service';
import { ProfileResponse } from '../../../_models/responses/profile.response';
import { ModalService } from '../../../components/modal/modal.service';
import { PersonalAboutComponent } from '../_modals/personal-about/personal-about.component';
import { baseModalButton, firstLetterLowerCase } from '../../../_utils/constants';
import { Document } from '../../../_entities/document.entity';
import { FilesComponent } from '../_modals/files/files.component';
import { Company } from '../../../_entities/company.entity';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AdditionalInfoComponent implements OnInit {
  public profile: ProfileResponse | undefined;
  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {}

  ngOnInit(): void {
    this.userService.getProfileInfo().subscribe((profile) => {
      this.profile = profile;
      this.cdr.detectChanges();
    });
  }

  public openPersonalAbout(): void {
    this.modalService
      .open<Company | boolean>(new PolymorpheusComponent(PersonalAboutComponent, this.injector), {
        heading: 'Сведения о компании',
        buttons: baseModalButton,
        data: this.profile?.company,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((company) => {
        if (typeof company !== 'boolean' && this.profile) {
          this.profile.company = company;
          this.cdr.detectChanges();
        }
      });
  }

  public openFileModal(item: Document): void {
    this.modalService
      .open<string>(new PolymorpheusComponent(FilesComponent, this.injector), {
        heading: `Добавить ${firstLetterLowerCase(item.name)}`,
        buttons: baseModalButton,
        data: { documentId: item.id },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((url: string) => {
        // eslint-disable-next-line no-param-reassign
        item.file = url;
        this.cdr.detectChanges();
      });
  }

  public deleteDocument(item: Document): void {
    this.modalService
      .open<boolean>('Вы уверены, что хотите удалить документ?')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result) {
            this.userService.deleteDocument(item.id).subscribe((response) => {
              if (response) {
                // eslint-disable-next-line no-param-reassign
                item.file = '';
                this.cdr.detectChanges();
              }
            });
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
