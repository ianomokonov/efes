import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../_services/back/service.service';
import { SearchServicesRequest } from '../../_models/requests/search-services.request';
import { ServiceEntity } from '../../_entities/service.entity';
import { FiltersService } from '../../_services/front/filters.service';

@Component({
  selector: 'efes-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
  providers: [TuiDestroyService],
})
export class SearchComponent implements OnInit {
  public serviceString: SearchServicesRequest | undefined;
  public services: ServiceEntity[] = [];
  public loading = true;
  constructor(
    private service: ServiceService,
    private filtersService: FiltersService,
    private route: ActivatedRoute,
    private destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.filtersService.genFiltersControls();
  }

  public getServices(searchServices: SearchServicesRequest): void {
    this.loading = true;
    this.service
      .getServices(searchServices)
      .pipe(takeUntil(this.destroy$))
      .subscribe((services) => {
        this.services = services;
        this.loading = false;
      });
  }
}
