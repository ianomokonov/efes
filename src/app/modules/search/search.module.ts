import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiInputModule,
  TuiIslandModule,
  TuiMultiSelectModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { FiltersComponent } from './filters/filters.component';
import { SearchStringComponent } from './search-string/search-string.component';

@NgModule({
  declarations: [SearchComponent, FiltersComponent, SearchStringComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    TuiIslandModule,
    TuiSvgModule,
    TuiLoaderModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiMultiSelectModule,
    TuiTextfieldControllerModule,
  ],
})
export class SearchModule {}
