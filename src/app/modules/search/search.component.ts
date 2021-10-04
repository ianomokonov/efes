import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ServiceService } from '../../_services/back/service.service';
import { SearchServicesRequest } from '../../_models/requests/search-services.request';
import { ServiceEntity } from '../../_entities/service.entity';

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
  constructor(private service: ServiceService, private destroy$: TuiDestroyService) {}

  ngOnInit(): void {
    this.service
      .getServices({ searchString: '' })
      .pipe(take(1))
      .subscribe((services) => {
        this.services = services;
        this.loading = false;
      });
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
