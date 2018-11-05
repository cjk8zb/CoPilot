import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import * as airport from './airport.json';
import * as airportFrequency from './airport-frequency.json';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
import { last } from '../../../node_modules/@angular/router/src/utils/collection';

@Component({
  selector: 'app-emergency-landing',
  templateUrl: './emergency-landing.component.html',
  styleUrls: ['./emergency-landing.component.scss']
})
export class EmergencyLandingComponent implements OnInit {
  result: Observable<any>;
  googleKey: 'AIzaSyAXpy2u3ZjYegMeDRILoUWZ_iw_F9hlw7s';
  airportName: string;
  city: string;
  runwayDirection: string;
  coordinates: string;
  distance: number;
  frequency: number;

  lat1 = 0;
  lon1 = 0;
  lat2 = 0;
  lon2 = 0;

  constructor(private http: HttpClient) {}

    getNearestAirport(lat, lon) {
        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius=50000&type=airport&key='+this.googleKey;

        this.lat1 = lat;
        this.lon1 = lon;

        this.result = this.http.get(url);
        this.result
        .subscribe(data => {
            this.airportName = data['results'][0]['name'];
            this.city = data['results'][0]['vicinity'];

            this.lat2 = data['results'][0]['geometry']['location']['lat'];
            this.lon2 = data['results'][0]['geometry']['location']['lng'];

            this.coordinates = data['results'][0]['geometry']['location']['lat'] + ', ' + data['results'][0]['geometry']['location']['lng'];
            this.distance = generateDistance(lat, lon, this.lat2, this.lon2);
        }, error => {
          console.log(error);
        });
    }

    getAirportFrequency() {
      let airportId = (<any>airport).airportId;
      this.frequency = airportFrequency[airportId]['frequency'];
    }

    getTextToSpeak() {
      let bearing = getBearing(this.lat1, this.lon1, this.lat2, this.lon2);
      return "The nearest airport is " + this.airportName + ", " + this.distance + " miles in the direction of " + bearing;
    }

  ngOnInit() {
  }
}

function generateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  var R = 6371e3; // metres
  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2 - lat1);
  var Δλ = toRadians(lon2 - lon1);

  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c);
}

function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  var dLon = (lng2-lng1);
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  var brng = this.toDegrees(Math.atan2(y, x));
  return 360 - ((brng + 360) % 360);
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}