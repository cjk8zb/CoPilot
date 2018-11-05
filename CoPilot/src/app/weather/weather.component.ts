import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VoiceService} from '../voice.service';

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


  constructor(private http: HttpClient, private voice: VoiceService) {
  }

  getWeatherInformation(lat, lon) {
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + this.weatherKey;

    const direction = (degree) => {
      const rDegree = (degree + 360 + 180) % 360;
      const dir = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
      if (rDegree >= 345 || rDegree < 15) {
        return dir[0];
      }
      if (rDegree >= 15 && rDegree < 75) {
        return dir[1];
      }
      if (rDegree >= 75 && rDegree < 105) {
        return dir[2];
      }
      if (rDegree >= 105 && rDegree < 165) {
        return dir[3];
      }
      if (rDegree >= 165 && rDegree < 195) {
        return dir[4];
      }
      if (rDegree >= 195 && rDegree < 255) {
        return dir[5];
      }
      if (rDegree >= 255 && rDegree < 285) {
        return dir[6];
      }
      if (rDegree >= 285 && rDegree < 345) {
        return dir[7];
      }
    };

    this.result = this.http.get(url);
    this.result
      .subscribe(data => {
        console.log('data', data);
        this.temperature = Math.round(data['main']['temp']);
        this.windSpeed = data['wind']['speed'];
        this.windDegree = data['wind']['deg'];
        const condition = (data['weather'][0]['description'] || '');
        this.condition = condition.toUpperCase();
        this.city = data['name'];
        this.coordinates = lat + ', ' + lon;
        const conditionT = condition ? ` with ${condition}` : '';
        this.voice.speak(`It’s ${this.temperature} degrees${conditionT}. `
          + `Winds are ${Math.round(this.windSpeed)} miles per hour heading ${direction(this.windDegree)}.`);
      }, error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.getWeatherInformation(39.58, -94.23);
  }

}
