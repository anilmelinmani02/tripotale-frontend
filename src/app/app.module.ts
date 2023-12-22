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
import {  HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';


const firebaseConfig = {
  apiKey: "AIzaSyDp7yyM3_72459eJ2sd6DF6JDzHzBOhHXU",
  authDomain: "tripotale-f1db9.firebaseapp.com",
  projectId: "tripotale-f1db9",
  storageBucket: "tripotale-f1db9.appspot.com",
  messagingSenderId: "152516444939",
  appId: "1:152516444939:web:70cc71eb653aea866a980e",
  measurementId: "G-JMQ061HFB5"
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
