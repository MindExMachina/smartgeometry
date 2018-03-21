var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;

// Configure express body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Express HTTP server routes.
 */

/**
 * A POST route that (optionally) gets a numbers array parameter.
 */
app.post('/numbers', function(req, res) {

    var numbers = [0, 1, 2];

    // Try to get numbers parameter from post request
    if (req.body.numbers) {
        numbers = req.body.numbers;
    }

    // Return the request numbers in the response
    // (or return the default if not provided)
    res.json(numbers);

});

/**
 * A GET route that (optionally) gets a numbers array parameter.
 */
// e.g. http://localhost:8080/numbers?numbers=[[4,5,0,3,2],[4,5,0,3,0]]
// e.g. http://localhost:8080/numbers?numbers=[[4,5,0,3,2],[4,5,0,3,0]]&i=100
app.get('/numbers', function(req, res) {

    var numbers = req.param('numbers');
    if (numbers) {
        var numbers = JSON.parse(numbers);
        var increment = req.param('i') || 1;

        for (var i in numbers) {
            var components = numbers[i];
            for (var j in components) {
                var component = components[j];
                components[j] = parseInt(component) + parseInt(increment);
            }
        }
        res.json(numbers);
    } else {
        res.json({});
    }


});

/**
 * A GET route that takes one parameter on the URL,
 * constructs a JSON string and returns it.
 */
app.get('/color/:color', function(req, res) {

    var m = '{ "method": "color-change", "params": { "color": "' + req.params.color + '" } }';
    res.json(JSON.parse(m));

});

/**
 * Start the http server.
 */
app.listen(port);
console.log('Server started at http://localhost:' + port);