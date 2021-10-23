import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SearchServicesRequest } from '../../../_models/requests/search-services.request';
import { ServiceService } from '../../../_services/back/service.service';
import { FiltersService } from '../../../_services/front/filters.service';
import { IdNameResponse } from '../../../_models/responses/id-name.response';

@Component({
  selector: 'efes-search-string',
  templateUrl: './search-string.component.html',
  styleUrls: ['./search-string.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [TuiDestroyService],
})
export class SearchStringComponent implements OnInit {
  public searchControl: FormControl;
  public serviceString: SearchServicesRequest | undefined;
  @Output()
  public getServices: EventEmitter<SearchServicesRequest> = new EventEmitter<SearchServicesRequest>();
  public showSideBar = false;
  public filtersControls: Record<string, FormControl>[] = [];
  public filterBadges: IdNameResponse[] = [];
  constructor(
    private service: ServiceService,
    private route: ActivatedRoute,
    private filtersService: FiltersService,
    private fb: FormBuilder,
    private destroy$: TuiDestroyService,
  ) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((searchString) => {
        this.serviceString = {
          ...this.serviceString,
          searchString,
        };
        this.getServices.emit(this.serviceString);
      });
    this.route.queryParams.subscribe((params) => {
      this.filtersService.parseQueryString(params);
      this.serviceString = {
        searchString: this.serviceString?.searchString || '',
        ...params,
      };
      this.getServices.emit(this.serviceString);
    });
  }

  public addFilter(toggle: boolean): void {
    this.showSideBar = toggle;
  }
}
