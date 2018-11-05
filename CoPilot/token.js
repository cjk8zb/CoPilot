'use strict';

const express = require('express');
const https = require('https');
const querystring = require('querystring');

class WatsonService {
	constructor({username, password, hostname, path, apikey}) {
		this.hostname = hostname;
		this.path = path;

		
		const apiUrl = encodeURIComponent(`https://${hostname}${path}`);
		const apiPath = `/authorization/api/v1/token?url=${apiUrl}`;

		if (apikey) {
			this.username = 'apikey';
			this.password = apikey;
		} else {
			this.username = username;
			this.password = password;
		}

		const auth = 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64');
		this.options = {
			headers: {Authorization: auth},
			hostname, 
			path: apiPath
		};

	}

	handle(res) {
		console.log('options', this.options);
		https.get(this.options, response => {
			let token = '';
			response.on('data', function (chunk) {
				token += chunk;
			}).on('end', function () {
				console.log('token:', token);
				res.json({token: decodeURIComponent(token), expires: Date.now() + 36e5});
			});
		});
	}

	post(res) {

	}
}

const services = Object.entries(require('./watsonServices.json'))
	.reduce((prev, [key, value]) => Object.assign(prev, {[key]: new WatsonService(value)}), {});

const app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/token/:serviceName', (request, response) => {
	const serviceName = request.params['serviceName'];
	console.log('get token for', serviceName);
	services[serviceName].handle(response);
});

app.get('/translate/:from/:to/:text', (request, response) => {
	const {from, to, text} = request.params;

	const translate = services['translate'];

	const postData = JSON.stringify({
		'text': text,
		'model_id': `${from}-${to}`,
	});
	console.log('postData', postData);
	const options = {
		hostname: translate.hostname,
		// port: 443,
		path: translate.path,
		method: 'POST',
		headers: Object.assign({
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		}, translate.options.headers)
	};

	console.log('options', JSON.stringify(options, null, 3));
	const req = https.request(options, (res) => {
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		let body = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			body += chunk;
			console.log(`BODY: ${chunk}`);
		});
		res.on('end', () => {
			console.log('No more data in response.');
			response.json(JSON.parse(body));
		});
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});

// write data to request body
	req.write(postData);
	req.end();

	//
	// const options = Object.assign({}, translate.options, {method: 'POST'});
	// https.get(this.url, this.options, response => {
	// 	let token = '';
	// 	response.on('data', function (chunk) {
	// 		token += chunk;
	// 	}).on('end', function () {
	// 		console.log('token:', token);
	// 		res.json({token: decodeURIComponent(token), expires: Date.now() + 36e5});
	// 	});
	// });
	// curl --user apikey:{apikey_value}
	// --request POST
	// --header "Content-Type: application/json"
	// --data "{\"text\": [\"Hello, world!\", \"How are you?\"], \"model_id\":\"en-es\"}"
	// https://gateway.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01
});

const port = 3000;
app.listen(port, () => console.info('Listening on port', port));
