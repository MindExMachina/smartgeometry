var nj = require('numjs');
var atob = require('atob');
var btoa = require('btoa');
var sk = require('./sketch_rnn.js');

module.exports.run = function() {

    var model;

    sk.set_init_model(model_raw_data);
    model_data = sk.get_model_data();
    model = new sk.SketchRNN(model_data);
    model.set_pixel_factor(screen_scale_factor);
    console.log('todo: set screen_scale_Factor');

    console.log('worked?');
};