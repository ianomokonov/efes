import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../_services/back/user.service';
import { User } from '../../_entities/user.entity';
import { ProfileResponse } from '../../_models/responses/profile.response';
import { ValueDateResponse } from '../../_models/responses/value-date.response';
import { rateChartBuild } from '../../_utils/rateChartBuilder';

@Component({
  selector: 'efes-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  providers: [TuiDestroyService],
})
export class ProfileComponent implements OnInit {
  public user: User | undefined;
  public profile: ProfileResponse | undefined;
  public loading: boolean = true;
  public rates: ValueDateResponse[] = [];
  constructor(private userService: UserService, private destroy$: TuiDestroyService) {}

  ngOnInit() {
    this.loading = true;
    forkJoin([this.userService.getUserInfo(), this.userService.getProfileInfo()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, profile]) => {
        this.user = user;
        this.profile = profile;
        this.rates = rateChartBuild(this.profile.documents, this.profile.company);
        this.loading = false;
      });
  }

  public additionalInfoChanges(infoType: 'company' | 'document', item: any): void {
    switch (infoType) {
      case 'company':
        if (this.profile) this.profile.company = item;
        break;
      case 'document':
        this.profile?.documents.map((document) => {
          // eslint-disable-next-line no-param-reassign
          if (document.id === item.id) document.file = item.file;
          return document;
        });
        break;
      default:
        break;
    }
    if (this.profile) this.rates = rateChartBuild(this.profile.documents, this.profile.company);
  }
}
