const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
// configure express body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Websocket server configuration.
 */

const local = false;

let ws_host = 'smartgeometry.herokuapp.com';
let ws_port = '80';

if (local) {
    ws_host = '127.0.0.1';
    ws_port = '8000';
}

/**
 * Express HTTP server routes.
 */

app.post('/simple_predict', function(req, res) {

    // Load simple_predict.js module
    var simple_predict = require('./lib/simple_predict');

    // Get strokes from post parameters
    var strokes = req.body.strokes;

    // If strokes are provided on the request,
    // set them as input strokes for simple_predict
    if (strokes) {
        var strokes = JSON.parse(strokes);
        simple_predict.set_strokes(strokes)
    }

    // Request a sketch prediction
    simple_predict.predict();

    // Get the predicted strokes
    var predicted_strokes = simple_predict.output_strokes();

    // Return the predicted strokes in the response
    res.json(predicted_strokes);

});




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

app.get('/color/:color', function(req, res) {
    var m = '{ "action": "color-change", "data": { "color": "' + req.params.color + '" } }';
    ws.send(m);
    res.json(JSON.parse(m));
});

app.listen(port);
console.log('Server started at http: //localhost:' + port);

// ██╗    ██╗███████╗██████╗ ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗███████╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
// ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗
// ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║
// ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║
//  ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

// Websocket client
// https://github.com/websockets/ws

const options = { constructor: Html5WebSocket };
const rws = new ReconnectingWebSocket('ws://' + ws_host + ':' + ws_port + '/ws', undefined, options);
rws.timeout = 1000;

rws.addEventListener('open', () => {
    // console.log('send-strokes');
    // rws.send('{"method":"send-strokes", "params": {"strokes": [[-3,4,1,0,0],[3,10,1,0,0]]}}');
});

rws.addEventListener('message', (e) => {
    handleMessage(JSON.parse(e.data));
});

rws.addEventListener('close', () => {
    console.log('connection closed');
});

rws.onerror = (err) => {
    if (err.code === 'EHOSTDOWN') {
        console.log('server down');
    }
};

// █╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
// ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
// ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
// ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

var verbose = true;

var handleMessage = function(m) {
    var method = m.method;

    if (method) {

        if (verbose) {
            console.log('★ Received ' + method + '.');
        }

        switch (method) {
            case "send-message":
                //handleSendMessage(m);
                break;
            case "client-id":
                handleClientId(m);
                break;
            case "client-list":
                //handleClientList(m);
                break;
            case "notification":
                //handleNotification(m);
                break;
            case "color-change":
                //handleColorChange(m);
                break;
            case "distribute-strokes":
                handleDistributeStroke(m);
                break;
            case "sketch-rnn:get-prediction:0.0.1":
                handleSketchRNNGetPrediction001(m);
                break;
            default:
                if (verbose) console.log('(No handler for ' + method + '.)');
        }
    }
}

var handleClientId = function(m) {
    console.log('Your id is ' + m.params.id);
}

var handleDistributeStroke = function(m) {
    // var newStrokes = m.params.strokes;
    // for (var i in newStrokes) {
    //     var location = newStrokes[i];
    //     strokes.push(location);
    // }
};

var handleSketchRNNGetPrediction001 = function(m) {
    console.log('yay! received a request for a prediction');
    let inputStrokes = m.params.strokes;
    console.log('------------');
    console.log('INPUT STROKES');
    console.log('------------');
    console.log(inputStrokes);
    let outputStrokes = sketchRNNGetPrediction(inputStrokes);
    console.log('------------');
    console.log('OUTPUT STROKES');
    console.log('------------');
    console.log(outputStrokes);

    rws.send(
        '{"method":"send-strokes", ' +
        '"params": {"strokes": ' + JSON.stringify(outputStrokes) + '},' +
        '"id": "' + uuid() + '"}');
}

var uuid = function() {
    return 'placeholder-uuid-node-server';
}

var simple_predict = require('./lib/simple_predict');

/**
 * Get a prediction on how to continue a sketch
 * using Google's Sketch RNN.
 * 
 * @param [[dx, dy, p1, p2, p3], […]] strokes 
 */
var sketchRNNGetPrediction = function(strokes) {

    simple_predict.set_absolute_strokes(strokes)

    // infer new strokes (and store in predicted_strokes)
    simple_predict.predict();

    // accessor for predicted_strokes
    return simple_predict.output_strokes_absolute();

}