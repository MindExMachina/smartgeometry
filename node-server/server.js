var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
// configure express body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes

// http://localhost:8080/infer?strokes=[[-4,0,1,0,0],[-15,9,1,0,0],[-10,17,1,0,0],[-1,28,1,0,0]]
app.get('/infer', function(req, res) {

    // parse strokes from url
    var strokes = req.param('strokes');

    var simple_predict = require('./lib/simple_predict');
    // if provided, change input strokes
    if (strokes) {
        var strokes = JSON.parse(strokes);
        simple_predict.set_strokes(strokes)
    }
    // infer new strokes (and store in predicted_strokes)
    simple_predict.predict();
    // accessor for predicted_strokes
    var predicted_strokes = simple_predict.output_strokes();

    res.json(predicted_strokes);
});

// http://localhost:8080/infer?strokes=[[-4,0,1,0,0],[-15,9,1,0,0],[-10,17,1,0,0],[-1,28,1,0,0]]
app.post('/infer', function(req, res) {

    // parse strokes from url
    var strokes = req.body.strokes;

    var simple_predict = require('./lib/simple_predict');
    // if provided, change input strokes
    if (strokes) {
        var strokes = JSON.parse(strokes);
        simple_predict.set_strokes(strokes)
    }
    // infer new strokes (and store in predicted_strokes)
    simple_predict.predict();
    // accessor for predicted_strokes
    var predicted_strokes = simple_predict.output_strokes();

    res.json(predicted_strokes);
});

app.get('/', function(req, res) {
    var str = sketchrnn.talk();
    res.send(str);
});

// sample GET request that receives an array of strokes
// e.g. http://localhost:8080/get?strokes=[[4,5,0,3,2],[4,5,0,3,0]]
app.get('/get', function(req, res) {
    var strokes = req.param('strokes');
    var strokes = JSON.parse(strokes);
    var increment = req.param('i') || 1;

    for (var i in strokes) {
        var components = strokes[i];
        for (var j in components) {
            var component = components[j];
            components[j] = parseInt(component) + parseInt(increment);
        }
    }
    ws.send(JSON.stringify({ action: "strokes-0.0.1", params: { strokes: strokes } }));
    res.json(strokes);
});

// same thing as a POST request
app.post('/post', function(req, res) {

    console.log(req.body.strokes);

    var strokes = req.body.strokes;
    var strokes = JSON.parse(strokes);
    var increment = req.param('i') || 1;

    for (var i in strokes) {
        var components = strokes[i];
        for (var j in components) {
            var component = components[j];
            components[j] = parseInt(component) + parseInt(increment);
        }
    }

    res.json(strokes);
});

app.get('/color/:color', function(req, res) {
    var m = '{ "action": "color-change", "data": { "color": "' + req.params.color + '" } }';
    ws.send(m);
    res.json(JSON.parse(m));
});

app.listen(port);
console.log('Server started at http: //localhost:' + port);

// https://github.com/websockets/ws

const WebSocket = require('ws');

const ws = new WebSocket('ws://smartgeometry.herokuapp.com:80/ws', {});

ws.on('open', function open() {
    console.log('connected');
    ws.send('{ "action": "send-message", "params": { "text": "I connected from server.js" } }');
    ws.send('{ "action": "color-change", "data": { "color": "red" } }');
});

ws.on('close', function close() {
    console.log('disconnected');
    // TODO: reconnect
});

ws.on('message', function incoming(data) {

    var j = JSON.parse(data);
    console.log('==============');
    console.log(j.action + ' - ' + JSON.stringify(j.params));

});