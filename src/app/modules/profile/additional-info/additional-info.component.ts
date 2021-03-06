import { Component, EventEmitter, Inject, Injector, Input, Output } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { UserService } from '../../../_services/back/user.service';
import { ModalService } from '../../../components/modal/modal.service';
import { PersonalAboutComponent } from '../_modals/personal-about/personal-about.component';
import { baseModalButton, firstLetterLowerCase } from '../../../_utils/constants';
import { Document } from '../../../_entities/document.entity';
import { FilesComponent } from '../_modals/files/files.component';
import { Company } from '../../../_entities/company.entity';

@Component({
  selector: 'efes-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.less'],
  providers: [TuiDestroyService],
})
export class AdditionalInfoComponent {
  @Input()
  public company: Company | null | undefined;
  @Input()
  public documents: Document[] | undefined;
  @Output()
  public companyInfoAdded: EventEmitter<Company> = new EventEmitter<Company>();
  @Output()
  public documentChanges: EventEmitter<Document> = new EventEmitter<Document>();
  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private destroy$: TuiDestroyService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService,
  ) {}

  public openPersonalAbout(): void {
    this.modalService
      .open<Company | boolean>(new PolymorpheusComponent(PersonalAboutComponent, this.injector), {
        heading: 'Сведения о компании',
        modalWidth: 50,
        buttons: baseModalButton,
        data: this.company,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((company) => {
        if (typeof company !== 'boolean' && this.company) {
          this.company = company;
          this.companyInfoAdded.emit(this.company);
        }
      });
  }

  public openFileModal(item: Document): void {
    this.modalService
      .open<string>(new PolymorpheusComponent(FilesComponent, this.injector), {
        heading: `Добавить ${firstLetterLowerCase(item.name)}`,
        modalWidth: 40,
        buttons: baseModalButton,
        data: { documentId: item.id, fileUrl: item.file },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((url: string | boolean) => {
        if (typeof url === 'string') {
          // eslint-disable-next-line no-param-reassign
          item.file = url;
          this.documentChanges.emit(item);
        }
      });
  }

  public deleteDocument(item: Document): void {
    this.modalService
      .open<boolean>('Вы уверены, что хотите удалить документ?', {
        modalWidth: 20,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result) {
            this.userService.deleteDocument(item.id).subscribe((response) => {
              if (response) {
                // eslint-disable-next-line no-param-reassign
                item.file = '';
                this.documentChanges.emit(item);
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
