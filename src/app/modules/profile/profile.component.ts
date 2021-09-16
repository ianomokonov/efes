import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../_services/back/user.service';
import { User } from '../../_entities/user.entity';
import { ProfileResponse } from '../../_models/responses/profile.response';

@Component({
  selector: 'efes-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ProfileComponent implements OnInit {
  public user: User | undefined;
  public profile: ProfileResponse | undefined;
  public loading: boolean = true;
  constructor(
    private userService: UserService,
    private destroy$: TuiDestroyService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loading = true;
    forkJoin([this.userService.getUserInfo(), this.userService.getProfileInfo()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, profile]) => {
        this.user = user;
        this.profile = profile;
        this.profile.completeOrders.forEach((item) => {
          const newData = item;
          newData.name = item.date;
          return newData;
        });
        this.profile.views.forEach((item) => {
          const newData = item;
          newData.name = item.date;
          return newData;
        });
        this.profile.totalSums.forEach((item) => {
          const newData = item;
          newData.name = item.date;
          return newData;
        });
        this.loading = false;
        this.cdr.detectChanges();
      });
  }
}
