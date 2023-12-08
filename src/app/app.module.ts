import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CustomerProfilingComponent } from './customer-profiling/customer-profiling.component';
import { HeaderComponent } from './header/header.component';
import { ItineraryPageComponent } from './itinerary-page/itinerary-page.component';
import { ItineraryPageMainComponent } from './itinerary-page-main/itinerary-page-main.component';
import { ItineraryCardComponent } from './itinerary-card/itinerary-card.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomerProfilingComponent,
    HeaderComponent,
    ItineraryPageComponent,
    ItineraryPageMainComponent,
    ItineraryCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
