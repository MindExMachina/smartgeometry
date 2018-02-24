var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
// configure express body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes

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