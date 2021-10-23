import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TuiDestroyService, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FilterResponse } from '../../../_models/responses/filter.response';
import { IdNameResponse } from '../../../_models/responses/id-name.response';
import { FiltersService } from '../../../_services/front/filters.service';

@Component({
  selector: 'efes-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [TuiDestroyService],
})
export class FiltersComponent implements OnInit {
  public filters: FilterResponse[] = [];
  public filtersControls: Record<string, FormControl>[] = [];
  constructor(private filtersService: FiltersService, private destroy$: TuiDestroyService) {}

  ngOnInit() {
    this.filters = this.filtersService.filters;
    this.filtersControls = this.filtersService.filterControls;
    this.filtersControls.forEach((control) => {
      const key = Object.keys(control)[0];
      Object.values(control)[0]
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value: IdNameResponse[]) => {
          this.filtersService.genQueryString(key, value);
        });
    });
  }

  public stringify: TuiStringHandler<IdNameResponse> = (filter) => {
    return filter.name;
  };

  public matcher: TuiIdentityMatcher<IdNameResponse> = (f1, f2) => {
    return f1.id === f2.id;
  };
}
