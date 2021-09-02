import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'rates',
    loadChildren: () => import('./modules/rates/rates.module').then((m) => m.RatesModule),
  },
  {
    path: 'feedback',
    loadChildren: () => import('./modules/feedback/feedback.module').then((m) => m.FeedbackModule),
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
