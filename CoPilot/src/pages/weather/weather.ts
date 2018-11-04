import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';

@Component({
    selector: 'pager-weather',
    templateUrl: 'weather.html'
  })

export class SmartWeather {
    result: Observable<any>;
    weatherKey: 'fc9717940cea5400cbb31d1a818b4837';
    temperature: number;
    windSpeed: number;
    windDegree: number;
    condition: string;
    city: string;
    coordinates: string;

    constructor(private http: HttpClient) {}

    getWeatherInformation(lat, lon) {

        let url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&unit=imperial&appid=' + this.weatherKey;
        this.result = this.http.get(url);
        this.result
        .subscribe(data => {
            this.temperature = data['main']['temp'];
            this.windSpeed = data['wind']['speed'];
            this.windDegree = data['wind']['deg'];
            this.condition = data['weather'][0]['description'];
            this.city = '';
            this.coordinates = lat + ', ' + lon;
        }, error => {
        console.log(error);
        });
    }
}
