import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export type VoiceServiceCallback = (results: string[], raw: string) => void;
export type VoiceServiceAnalyserCallback = (analyser: AnalyserNode, dataArray: Uint8Array, bufferLength: number) => void;


interface BuildUrlParams {
  protocol?: string;
  host: string;
  port?: number;
  path: string | string[];
  query?: object;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceService {

  listenButtonText = 'Listen';
  listenButtonDisabled = false;
  listenButtonClass = 'btn-primary';
  speakButtonDisabled = false;
  textIn = '';
  mediaRecorder: MediaRecorder;
  public callback: VoiceServiceCallback = () => {
  };
  public analyserCallback: VoiceServiceAnalyserCallback = () => {
  };

  constructor(private http: HttpClient) {
  }

  get isListening() {
    return Boolean(this.mediaRecorder);
  }

  buildUrl({protocol = 'https', host, port = 0, path = '', query = {}}: BuildUrlParams) {
    const portStr = port ? `:${port}` : '';
    const queryParts = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    if (typeof path !== 'string' && Array.isArray(path)) {
      path = path.map(encodeURIComponent).join('/');
    }
    return `${protocol}://${host}${portStr}/${path}${queryString}`;
  }

  // Token management.

  getToken(serviceName) {
    if (this.validToken(serviceName)) {
      return Promise.resolve(storage.local[serviceName].token);
    }

    return this.loadToken(serviceName);
  }

  validToken(serviceName) {
    return storage.local[serviceName] &&
      storage.local[serviceName] &&
      storage.local[serviceName].token &&
      Date.now() < storage.local[serviceName].expires;
  }

  loadToken(serviceName) {
    return this.get(this.buildUrl({
      protocol: 'http',
      host: 'localhost',
      port: 3000,
      path: ['token', serviceName]
    })).then((results: any) => {
      // console.log('results', results);
      return results.token;
//      storage.local[serviceName] = results.data;
//      return storage.local[serviceName].token;
    });
  }

  get(url) {
    return this.http.get(url).toPromise();
  }

  listen() {
    this.listenButtonDisabled = true;

    if (this.mediaRecorder) {
      console.debug('stop listening');
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
      this.listenButtonText = 'Listen';
      this.listenButtonDisabled = false;
      this.listenButtonClass = 'btn-primary';
    } else {
      console.info('start listening');
      return this.getToken('speechToText').then(token => this.buildUrl({
        protocol: 'wss',
        host: 'stream.watsonplatform.net',
        path: 'speech-to-text/api/v1/recognize',
        query: {
          'watson-token': token,
          model: 'en-US_BroadbandModel'
        }
      })).then(url => {
        // console.info('listening - url', url);
        getStream().then(stream => {
          // console.info('listening - stream', stream);
          openSocket(url, this).then(socket => {
            // console.info('listening - socket', socket);
            const ctx = new AudioContext();
            visualize(ctx, stream, this);
            this.mediaRecorder = getMediaRecorder(stream, socket);
            // console.info('listening - mediaRecorder', this.mediaRecorder);
            this.listenButtonText = 'Stop';
            this.listenButtonDisabled = false;
            this.listenButtonClass = 'btn-danger';
            this.mediaRecorder.start(1000);
          });
        });
      });

    }
  }

  speak(textOut) {
    if (!textOut) {
      return;
    }
    console.log('TTS:', textOut);
    return;
    // this.speakButtonDisabled = true;
    // return this.getToken('textToSpeech').then(token => this.buildUrl({
    //   host: 'stream.watsonplatform.net',
    //   path: 'text-to-speech/api/v1/synthesize',
    //   query: {
    //     accept: 'audio/mp3',
    //     voice: 'en-US_AllisonVoice',
    //     text: textOut,
    //     'watson-token': token
    //   }
    // })).then(url => {
    //   const audio = new Audio(url);
    //   return audio.play();
    // }).then(() => {
    //   this.speakButtonDisabled = false;
    // }).catch(error => {
    //   console.error('speak error', error);
    //   this.speakButtonDisabled = false;
    // });
  }

}

function getMediaRecorder(stream, socket) {
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.onstart = function (e) {
    socket.send(JSON.stringify({
      'action': 'start',
      'content-type': 'audio/webm;codecs=opus',
      'interim_results': true
    }));
  };

  mediaRecorder.ondataavailable = function (e) {
    socket.send(e.data);
  };

  mediaRecorder.onstop = function (e) {
    socket.send(JSON.stringify({'action': 'stop'}));
    socket.close();
  };

  return mediaRecorder;
}

function openSocket(url, service: { callback: VoiceServiceCallback }) {
  return new Promise((resolve, reject) => {
    const websocket = new WebSocket(url);
    const partial = [];
    websocket.onopen = function (evt) {
      resolve(websocket);
    };
    websocket.onclose = function (evt) {
      console.info('close', evt);
    };
    websocket.onmessage = function (evt) {
      const message = JSON.parse(evt.data);
      const {results} = message;
      if (results) {
        const result = message.results[0];
        const transcript = result.alternatives[0].transcript;
        if (result.final) {
          partial.push(transcript);
          service.callback(partial, '');
        } else {
          service.callback(partial, transcript);
        }
      }
    };
    websocket.onerror = function (evt) {
      console.error('error', evt);
    };
  });
}

function getStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices && navigator.getUserMedia) {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia({audio: true}, resolve, reject);
    });
  }
  return navigator.mediaDevices.getUserMedia({audio: true});
}

const storage = (() => {

  // console.info('looking for local storage');
  try {
    const key = 'app.storage.local.testing';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
  } catch (e) {
    // Use in-memory storage as a fail-safe.
    // console.warn('local storage not available');
    return {local: {}, session: {}};
  }

  const handler = {
    get: function (obj, prop) {
      const value = obj[prop];
      return value && JSON.parse(value);
    },
    set: function (obj, prop, value) {
      obj[prop] = JSON.stringify(value);
      return true;
    }
  };

  return {
    local: new Proxy(localStorage, handler),
    session: new Proxy(sessionStorage, handler),
  };
})();


function visualize(audioCtx: AudioContext, stream: MediaStream, service: { analyserCallback: VoiceServiceAnalyserCallback }) {
  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  service.analyserCallback(analyser, dataArray, bufferLength);
}
