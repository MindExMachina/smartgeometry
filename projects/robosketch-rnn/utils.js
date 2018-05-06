
function distance(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
}

// Draw SVG graphic of "absolute" strokes
function getSVG(strokes) {

    var s = '<?xml version="1.0" encoding="utf-8"?>';
    s += '<!-- Generator: Nono.ma p5.js drawing client -->';
    s += '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" ' +
        'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" ' +
        'viewBox="0 0 ' + windowWidth + ' ' + windowHeight + '" ' +
        'style="enable-background:new 0 0 ' + windowWidth + ' ' + windowHeight + ';" ' +
        'xml:space="preserve">';
    s += '<style type="text/css">.o-line-0{fill:none;stroke:#000000;stroke-width:3;}</style>';


    var prev_location;
    var model_prev_pen = [1, 0, 0];

    for (var i = 0; i < strokes.length; i++) {

        if (i == 0 || model_prev_pen[1] == 1) {
            s += '<polyline class="o-line-0" points = "';
        }

        var location = strokes[i];

        let x = location[0];
        let y = location[1];
        let model_pen_down = location[2];
        let model_pen_up = location[3];
        let model_pen_end = location[4];

        // Not needed since we are iteration on points (not on the model)
        // predictions would kill the drawing loop
        //if (model_prev_pen[2] == 1) {
        //    break;
        //}

        if (i > 0) {
            s += ' ';
        }
        s += x + ',' + y;

        if (model_pen_up == 1) {
            // TODO: set this globally
            s += '" style = "fill:none;stroke:black;stroke-width:3"/>';
        }

        model_prev_pen[0] = model_pen_down;
        model_prev_pen[1] = model_pen_up;
        model_prev_pen[2] = model_pen_end;

        prev_location = location;
    }
    s += '</svg>';
    return s;
}


/**
 * FileSaver helpers
 */
function saveSVG(strokes) {
    var svg = getSVG(strokes);
    var blob = new Blob([svg], {
        type: "image/svg+xml"
    });
    saveAs(blob, "drawing.svg");
}

function saveText(s) {
    var blob = new Blob([s], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "draw.txt");
}



function absolute2relative(strokeVectors) {

    var rStrokes = [];
    let prev_x, prev_y;

    for (var i in strokeVectors) {

        let x = strokeVectors[i][0];
        let y = strokeVectors[i][1];
        let p1 = ststrokeVectorsrokes[i][2];
        let p2 = strokeVectors[i][3];
        let p3 = strokeVectors[i][4];

        if (i > 0) {
            rStrokes.push([x - prev_x, y - prev_y, p1, p2, p3]);
        }

        prev_x = x;
        prev_y = y;
    }

    return rStrokes;
}
