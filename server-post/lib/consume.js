var simple_predict = require('./simple_predict.js');

module.exports.infer = function() {

    // infer new strokes (and store in predicted_strokes)
    simple_predict.predict();
    // accessor for predicted_strokes
    return simple_predict.output_strokes();

}