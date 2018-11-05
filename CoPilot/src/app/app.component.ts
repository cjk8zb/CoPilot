import {Component, OnInit} from '@angular/core';
import {VoiceService} from './voice.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  svgPath: SVGPathElement;

  constructor(public voice: VoiceService, private router: Router) {
    this.voice.callback = ((results, raw) => {
      if (raw) {
        console.log('STT (raw):', raw);
        this.parse(raw.toLowerCase());
      } else {
        console.log('STT:', results);
        results.forEach(result => {
          this.parse(result.toLowerCase());
        });
      }
    });

    this.voice.analyserCallback = (analyser, dataArray, bufferLength) => {
      const draw = () => {
        const WIDTH = 800;
        const HEIGHT = 480;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        const sliceWidth = WIDTH / bufferLength;
        let x = 0;


        let path = '';
        for (let i = 0; i < bufferLength; i++) {

          const v = dataArray[i] / 128.0;
          const y = v * HEIGHT / 2;

          if (i === 0) {
            path += `M${x} ${y}`;
          } else {
            path += `L${x} ${y}`;
          }

          x += sliceWidth;
        }

        path += `L${WIDTH} ${HEIGHT / 2}`;
        this.svgPath.setAttribute('d', path);
      };
      draw();
    };
  }

  parse(text) {
    if (text.includes('started')) {
      console.log('travel');
      this.voice.listen();
      // this.voice.speak('How can I help?');
      this.voice.speak('Where are we going today?');
    } else if (text.includes('weather')) {
      console.log('Go to weather!!');
      this.voice.listen();
      this.voice.speak('The weather is great!');
      this.router.navigate(['weather']);
    } else if (text.includes('traffic')) {
      console.log('Go to ATA');
      this.voice.listen();
      this.voice.speak('The sky is yours!');
    } else if (text.includes('traffic')) {
      console.log('Go to weather!!');
      this.voice.listen();
      this.voice.speak('The sky is yours!');
    }
  }

  ngOnInit(): void {
    this.svgPath = <any>document.getElementById('listenVis');
  }


}
//
//
// function parseThroughText(stream: string) {
//   const x = stream.split(' ');
//   for (let i = 0; i < x.length; i++) {
//     if (x[i] = 'weather') {
//       // @ts-ignore
//       const weatherInformation = new WeatherComponent();
//       weatherInformation.getWeatherInformation(39.58, -94.23);
//       speak('The current temperature is' + weatherInformation.temperature.toString() +
//         ', the wind speed is' + weatherInformation.windSpeed.toString() +
//         ', the weather conditions are' + weatherInformation.condition);
//
//     }
//     if (x[i] = 'airport') {
//       // @ts-ignore
//       const weatherInformation = new EmergencyLandingComponent();
//       weatherInformation.getNearestAirport(39.58, -94.23);
//       speak('The nearest airport is' + weatherInformation.airportName);
//     }
//     if (x[i] = 'emergency') {
//       // @ts-ignore
//       const weatherInformation = new EmergencyLandingComponent();
//       weatherInformation.getAirportFrequency();
//       speak('The nearest frequency is' + weatherInformation.frequency.toString());
//     }
//     if (x[i] = 'information') {
//       // @ts-ignore
//       const weatherInformation = new AirTrafficAwarenessComponent();
//       weatherInformation.getFlightInformation();
//       speak('Your aircraft code is' + weatherInformation.aircraftId
//         + ', your current speed, heading and altitude is' + weatherInformation.velocity.toString()
//         + ',' + weatherInformation.heading.toString()
//         + ',' + weatherInformation.altitude.toString());
//     } else {
//       speak('Sorry, i did not understand your request, please rephrase the question?');
//
//     }
//   }
//
// }
