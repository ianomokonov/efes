import { NgModule } from '@angular/core';
import {
  TuiFieldErrorModule,
  TuiInputDateTimeModule,
  TuiInputFileModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { TuiDataListModule, TuiLinkModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { PersonalAboutComponent } from './_modals/personal-about/personal-about.component';
import { FilesComponent } from './_modals/files/files.component';
import { EditPersonalInfoComponent } from './_modals/edit-personal-info/edit-personal-info.component';
import { ChangePasswordComponent } from './_modals/edit-personal-info/change-password/change-password.component';
import { StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  imports: [
    ProfileRoutingModule,
    TuiIslandModule,
    CommonModule,
    TuiLoaderModule,
    TuiSvgModule,
    TuiInputFileModule,
    FormsModule,
    TuiInputModule,
    TuiTextAreaModule,
    ReactiveFormsModule,
    TuiInputDateTimeModule,
    TuiFieldErrorModule,
    TuiInputPhoneModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiInputPasswordModule,
    PieChartModule,
    BarChartModule,
    TuiLinkModule,
  ],
  declarations: [
    ProfileComponent,
    PersonalInfoComponent,
    AdditionalInfoComponent,
    PersonalAboutComponent,
    FilesComponent,
    EditPersonalInfoComponent,
    ChangePasswordComponent,
    StatisticsComponent,
  ],
})
export class ProfileModule {}
