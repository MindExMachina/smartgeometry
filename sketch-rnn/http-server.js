// Copyright 2018 Nono Martínez Alonso (Nono.ma)
//
// The MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Author: Nono Martínez Alonso <mail@nono.ma>
 *
 * @fileoverview SketchRNN as a service over HTTP and WebSockets.
 */

// Load HTTP server dependencies
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
// Configure express body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Allow CORS (cross-origin) requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Load sketch-rnn simple predict module
var simple_predict = require('./lib/simple_predict');

// ██╗  ██╗████████╗████████╗██████╗ 
// ██║  ██║╚══██╔══╝╚══██╔══╝██╔══██╗
// ███████║   ██║      ██║   ██████╔╝
// ██╔══██║   ██║      ██║   ██╔═══╝ 
// ██║  ██║   ██║      ██║   ██║     
// ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝     

/**
 * Express HTTP server routes.
 */

/**
 * A POST route to request a prediction from SketchRNN.
 * (from a relative set of strokes).
 */
app.post('/simple_predict', function(req, res) {

    // Load simple_predict.js module
    //var simple_predict = require('./lib/simple_predict');

    // Get strokes from the POST request's parameters
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

/**
 * A POST route to request a prediction from SketchRNN
 * (from an absolute set of strokes).
 */
app.post('/simple_predict_absolute', function(req, res) {

    // Load simple_predict.js module
    //var simple_predict = require('./lib/simple_predict');

    // Get strokes from the POST request's parameters
    var strokes = req.body.strokes;
    var model = req.body.model;
    if (model) {
        console.log("Requesting model " + model);
        simple_predict.load_model(model);
    } 
    else {
        console.log("No model requested");
    }

    // If strokes are provided on the request,
    // set them as input strokes for simple_predict
    if (strokes) {
        var strokes = JSON.parse(strokes);
        simple_predict.set_absolute_strokes(strokes)
    }

    // Request a sketch prediction
    simple_predict.predict();

    // Get the predicted strokes
    var predicted_strokes = simple_predict.output_strokes_absolute();

    // Return the predicted strokes in the response
    res.json(predicted_strokes);

});

/**
 * A GET route to request a prediction from SketchRNN.
 * 
 * e.g, http://localhost:8080/simple_predict?strokes=[[-4,0,1,0,0],[-15,9,1,0,0],[-10,17,1,0,0],[-1,28,1,0,0]]
 */
app.get('/simple_predict', function(req, res) {

    // Load simple_predict.js module
    //var simple_predict = require('./lib/simple_predict');

    // Get strokes from the GET request's parameters
    var strokes = req.param('strokes');

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

/**
 * Start the HTTP server.
 */

app.listen(port);
console.log('Server started at http://localhost:' + port);