import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SearchServicesRequest } from '../../../_models/requests/search-services.request';
import { ServiceService } from '../../../_services/back/service.service';
import { FilterResponse } from '../../../_models/responses/filter.response';

@Component({
  selector: 'efes-search-string',
  templateUrl: './search-string.component.html',
  styleUrls: ['./search-string.component.less'],
  providers: [TuiDestroyService],
})
export class SearchStringComponent implements OnInit {
  public searchControl: FormControl;
  public serviceString: SearchServicesRequest | undefined;
  public filters: FilterResponse[] = [];
  @Output()
  public getServices: EventEmitter<SearchServicesRequest> = new EventEmitter<SearchServicesRequest>();
  public showSideBar = false;
  constructor(
    private service: ServiceService,
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
    this.service
      .getFilters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.filters = filters;
      });
  }

  public addFilter(toggle: boolean): void {
    this.showSideBar = toggle;
  }
}
