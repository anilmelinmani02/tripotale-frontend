import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerProfilingComponent } from './customer-profiling/customer-profiling.component';
import { ItineraryPageComponent } from './itinerary-page/itinerary-page.component';
import { ItineraryPageMainComponent } from './itinerary-page-main/itinerary-page-main.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '' , redirectTo:'home', pathMatch: 'full'},
  // { path: '' , redirectTo:'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'forgot', component:  ForgotPasswordComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'customer-profilling', component:CustomerProfilingComponent},
  { path: 'home', component:HomeComponent, canActivate: [AuthGuard]},
  { path: 'itinerary' , component:ItineraryPageComponent, canActivate: [AuthGuard]},
  { path: 'itinarary-details', component:ItineraryPageMainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
