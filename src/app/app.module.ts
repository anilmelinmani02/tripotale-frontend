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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ErrorModalComponent } from './alertModal/error-modal/error-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';

const firebaseConfig = {
  apiKey: "AIzaSyAsO-5snlKEEswJqk0b1JkcY5_d3cwusg0",
  authDomain: "tripotale-5f31c.firebaseapp.com",
  projectId: "tripotale-5f31c",
  storageBucket: "tripotale-5f31c.appspot.com",
  messagingSenderId: "535848464026",
  appId: "1:535848464026:web:d3bf9d93cdac09546e3923",
  measurementId: "G-PMEB2R3Z0M"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomerProfilingComponent,
    HeaderComponent,
    ItineraryPageComponent,
    ItineraryPageMainComponent,
    ItineraryCardComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ErrorModalComponent,
    HowItWorksComponent,
    ReferralDetailsComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'inline',
      timeOut: 2500,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
