import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { IdNameResponse } from '../../_models/responses/id-name.response';
import { FilterResponse } from '../../_models/responses/filter.response';
import { ServiceService } from '../back/service.service';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private queryParams: Params = {};
  private localFilters: FilterResponse[] = [];
  private privateFiltersControls: Record<string, FormControl>[] = [];

  public get filterControls() {
    return this.privateFiltersControls;
  }

  public get filters() {
    return this.localFilters;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: ServiceService,
  ) {}

  public genFiltersControls(): void {
    this.service.getFilters().subscribe((filters) => {
      this.privateFiltersControls = [];
      this.localFilters = filters;
      this.localFilters.forEach((filter) => {
        this.privateFiltersControls.push({
          [filter.key]: this.fb.control(null),
        });
      });
      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        if (params) this.parseQueryString(params);
      });
    });
  }

  public genQueryString(key: string, values: IdNameResponse[]): void {
    this.queryParams[key] = values.map((value) => value.id).join(',') || undefined;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      queryParamsHandling: 'merge',
    });
  }

  public parseQueryString(queryParams: Params): void {
    this.privateFiltersControls = [];
    this.localFilters.forEach((filter) => {
      const values: string = queryParams[filter.key];
      if (values) {
        const valuesArray: string[] = values.split(',');
        const filtersArray: any[] = [];
        valuesArray.forEach((val) => {
          const items = filter.values.find((item) => item.id.toString() === val);
          if (items) filtersArray.push(items);
        });
        this.privateFiltersControls.push({
          [filter.key]: this.fb.control(filtersArray),
        });
      } else {
        this.privateFiltersControls.push({
          [filter.key]: this.fb.control(null),
        });
      }
    });
  }
}
