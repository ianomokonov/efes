import { Component, Input, OnInit } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterResponse } from '../../../_models/responses/filter.response';

@Component({
  selector: 'efes-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less'],
  providers: [TuiDestroyService],
})
export class FiltersComponent implements OnInit {
  @Input()
  public filters: FilterResponse[] = [];
  public filtersForm: FormGroup | undefined;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    let form = {};
    this.filters.forEach((filter) => {
      form = {
        ...form,
        [filter.key]: [null],
      };
    });
    this.filtersForm = this.fb.group(form);
  }
}
