import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EmergencyLandingComponent} from '../emergency-landing/emergency-landing.component';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  result: Observable<any>;
  weatherKey = 'fc9717940cea5400cbb31d1a818b4837';
  temperature: number;
  windSpeed: number;
  windDegree: number;
  condition: string;
  city: string;
  coordinates: string;
  airport: string;

  constructor(private http: HttpClient) {
  }

  getWeatherInformation(lat, lon) {
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + this.weatherKey;

    this.result = this.http.get(url);
    this.result
      .subscribe(data => {
        console.log('data', data);
        this.temperature = Math.round(data['main']['temp']);
        this.windSpeed = data['wind']['speed'];
        this.windDegree = data['wind']['deg'];
        this.condition = (data['weather'][0]['description'] || '').toUpperCase();
        this.city = data['name'];
        this.coordinates = lat + ', ' + lon;
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.getWeatherInformation(39.58, -94.23);
  }

}

function parseThroughText(stream: string) {
  const x = stream.split(' ');
  for ( let i = 0; i < x.length; i++) {
    if ( x[i] = 'weather') {
      // @ts-ignore
      const weatherInformation = new WeatherComponent();
      weatherInformation.getWeatherInformation(39.58, -94.23);
      speak('The current temperature is' + weatherInformation.temperature +
        ', the wind speed is' + weatherInformation.windSpeed +
        ', the weather conditions are' + weatherInformation.condition);

    }
    if ( x[i] = 'airport') {
      // @ts-ignore
      const weatherInformation = new EmergencyLandingComponent();
      weatherInformation.getNearestAirport(39.58, -94.23);
      speak('The nearest airport is' + weatherInformation.airport);
    }
    if ( x[i] = 'emergency') {
      // @ts-ignore
      const weatherInformation = new EmergencyLandingComponent();
      weatherInformation.getAirportFrequency();
      speak('The nearest frequency is' + weatherInformation.frequency);
    }
    if ( x[i] = 'information') {
      // @ts-ignore
      const weatherInformation = new AirTrafficAwarenessComponent();
      weatherInformation.getFlightInformation();
      speak('Your current velocity is' + weatherInformation.velocity
      + ', your current speed, heading and altitude is' + weatherInformation.velocity.toString()
      + ',' + weatherInformation.heading.toString()
      + ',' + weatherInformation.altitude.toString());
    } else {
      speak('Sorry, i did not understand your request, please rephrase the question?');

    }
  }

}
