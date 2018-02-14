var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

// routes

// sample get that receives an array of strokes
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
    res.json(strokes);
});

// to-do in post form
app.post('/post', function(req, res) {
    // var user_id = req.body.id;
    // res.send(user_id + ' ' + token + ' ' + geo);
});

app.listen(port);
console.log('Server started at http: //localhost:' + port);