import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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
