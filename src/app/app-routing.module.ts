import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerProfilingComponent } from './customer-profiling/customer-profiling.component';
import { ItineraryPageComponent } from './itinerary-page/itinerary-page.component';
import { ItineraryPageMainComponent } from './itinerary-page-main/itinerary-page-main.component';

const routes: Routes = [
  { path: '' , redirectTo:'home', pathMatch: 'full'},
  { path: 'customer-profilling', component:CustomerProfilingComponent},
  { path: 'home', component:HomeComponent},
  { path: 'itinerary' , component:ItineraryPageComponent},
  { path: 'itinarary-details', component:ItineraryPageMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
