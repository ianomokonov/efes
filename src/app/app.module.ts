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
  TuiSvgModule,
} from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiSelectModule,
  TuiSelectOptionModule,
} from '@taiga-ui/kit';
import { TUI_DIALOGS } from '@taiga-ui/cdk';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { TokenInterceptor } from './_interceptors/token.interceptor';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './components/modal/modal.service';

@NgModule({
  declarations: [AppComponent, SignInComponent, SignUpComponent, ModalComponent],
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
    TuiFieldErrorModule,
    PolymorpheusModule,
    TuiSvgModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_DIALOGS,
      useExisting: ModalService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
