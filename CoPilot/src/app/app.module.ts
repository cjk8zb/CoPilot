import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { EmergencyLandingComponent } from './emergency-landing/emergency-landing.component';
import { AppRoutingModule } from './app-routing.module';
import { AirTrafficAwarenessComponent } from './air-traffic-awareness/air-traffic-awareness.component';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    EmergencyLandingComponent,
    AirTrafficAwarenessComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
