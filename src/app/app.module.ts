import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiNotificationsModule,
  TUI_SANITIZER,
  TuiButtonModule,
  TuiLinkModule,
  TuiDataListModule,
  TuiLabelModule,
} from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiSelectModule,
  TuiSelectOptionModule,
} from '@taiga-ui/kit';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TokenInterceptor } from './_interceptors/token.interceptor';

@NgModule({
  declarations: [AppComponent, SignInComponent, SignUpComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiNotificationsModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiIslandModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiInputPhoneModule,
    TuiSelectModule,
    TuiSelectOptionModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiLabelModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
