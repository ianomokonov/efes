import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { RatesComponent } from './modules/rates/rates.component';
import { FeedbackComponent } from './modules/feedback/feedback.component';
import { ProfileComponent } from './modules/profile/profile.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, RatesComponent, FeedbackComponent, ProfileComponent],
  imports: [BrowserModule, AppRoutingModule, TabMenuModule, MenubarModule, ButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
