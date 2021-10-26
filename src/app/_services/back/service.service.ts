import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceEntity } from 'src/app/_entities/service.entity';
import { SearchServicesRequest } from 'src/app/_models/requests/search-services.request';
import { FilterResponse } from 'src/app/_models/responses/filter.response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getFilters(): Observable<FilterResponse[]> {
    return this.http.get<FilterResponse[]>(`${this.baseUrl}/services/filters`);
  }

  public getServices(params: SearchServicesRequest): Observable<ServiceEntity[]> {
    return this.http.get<ServiceEntity[]>(`${this.baseUrl}/services`, { params });
  }

  public setFavorite(serviceId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/services/${serviceId}/favorite`, {});
  }
}
