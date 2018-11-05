import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';

@Component({
  selector: 'app-air-traffic-awareness',
  templateUrl: './air-traffic-awareness.component.html',
  styleUrls: ['./air-traffic-awareness.component.scss']
})
export class AirTrafficAwarenessComponent implements OnInit {
  result: Observable<any>;
  aircraftId: string;
  velocity: number;
  heading: number;
  altitude: number;
  lat: number;
  lon: number;

  constructor(private http: HttpClient) {
    // Air Traffic Awareness starts
  }

  getFlightInformation() {
    const url = 'localhost:9292/getFlightInformation';

    this.result = this.http.get(url);
    this.result
    .subscribe(data => {
        this.aircraftId = data['aircraftId'];
        this.velocity = data['velocity'];
        this.heading = data['heading'];
        this.altitude = data['altitude'];
        this.lat = data['lat'];
        this.lon = data['lon'];
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
}
