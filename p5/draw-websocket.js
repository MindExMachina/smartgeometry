/**
 * p5.js collaborative drawing client.
 * 
 * Requirements - this script requires the following libraries:
 * - Mousetrap
 * - FileSaver.js
 * - ReconnectingWebsocket
 * - p5.js
 * - github.com/kelektiv/node-uuid
 */

/**
 * Websocket server configuration.
 */

const local = true;

let host = 'smartgeometry.herokuapp.com';
let port = '80';

if (local) {
    host = '127.0.0.1';
    port = '8000';
}

/**
 * Drawing of a Croquetilla with a p5.js flag.
 * TODO: convert to sketch-rnn syntax
 */
let croquetilla = [
    [389, 176, 378, 175, 368, 177, 357, 180, 347, 183, 337, 190, 326, 197, 317, 207, 310, 217, 304, 226, 300, 236, 294, 247, 291, 257, 291, 268, 291, 279, 292, 290, 294, 301, 297, 311, 301, 321, 305, 331, 311, 343, 317, 352, 330, 366, 340, 374, 350, 382, 362, 388, 374, 394, 384, 396, 396, 400, 406, 402, 418, 402, 430, 402, 441, 402, 452, 400, 462, 397, 472, 393, 481, 386, 490, 380, 497, 371, 504, 363, 508, 353, 514, 344, 518, 333, 521, 323, 521, 312, 522, 302, 522, 291, 522, 280, 521, 270, 517, 260, 513, 250, 508, 241, 503, 230, 498, 221, 493, 212, 485, 204, 477, 196, 469, 189, 460, 183, 450, 180, 439, 177, 429, 175, 419, 174, 409, 173, 399, 172, 388, 172],
    [398, 171, 400, 181, 401, 191, 402, 201, 402, 212, 402, 223, 402, 234, 400, 245, 397, 255, 392, 265, 386, 274, 379, 282, 371, 289, 361, 294, 350, 296, 340, 299, 330, 300, 320, 301, 309, 302, 298, 302, 286, 304, 275, 309, 266, 314, 257, 320, 249, 327, 241, 334, 234, 342, 229, 351, 226, 362, 222, 372, 218, 383, 222, 393, 234, 398, 245, 400, 255, 401, 266, 401, 277, 401, 288, 399, 298, 397, 308, 395, 317, 389, 325, 381, 332, 373],
    [397, 175, 397, 186, 398, 196, 399, 206, 399, 217, 399, 228, 403, 238, 406, 248, 411, 259, 416, 268, 421, 277, 428, 285, 436, 293, 446, 299, 455, 306, 466, 311, 476, 315, 488, 318, 498, 321, 508, 323, 518, 324, 528, 325, 539, 327, 549, 330, 560, 334, 569, 339, 579, 345, 588, 351, 597, 357, 604, 367, 610, 376, 616, 387, 623, 395, 632, 400, 622, 402, 610, 401, 599, 401, 589, 399, 579, 397, 569, 394, 559, 391, 549, 387, 538, 382, 528, 378, 519, 373, 509, 369, 500, 364],
    [381, 294, 380, 304, 380, 315, 380, 326, 381, 336],
    [432, 299, 430, 311, 430, 323, 430, 334, 430, 345],
    [355, 359, 364, 364, 374, 369, 385, 373, 396, 376, 406, 377, 416, 378, 426, 380, 437, 379, 448, 376, 457, 371],
    [373, 394, 373, 405, 372, 415, 373, 425, 372, 435, 371, 445, 372, 456, 372, 467, 362, 471, 353, 466, 361, 459, 371, 460],
    [445, 400, 444, 411, 442, 421, 441, 431, 440, 441, 440, 452, 440, 463, 448, 470, 457, 465, 449, 458, 441, 465],
    [298, 303, 288, 299, 278, 294, 267, 288, 257, 285, 247, 280, 237, 277, 227, 271, 218, 266, 214, 256, 204, 254, 201, 264, 208, 272, 218, 270],
    [200, 264, 189, 264, 178, 264, 168, 263, 157, 263, 146, 263, 135, 263, 125, 262, 114, 262, 103, 262, 93, 261, 82, 261, 77, 252, 75, 242, 75, 231, 74, 220, 75, 209, 75, 197, 74, 186, 74, 175, 74, 164, 74, 153, 74, 142, 74, 131, 85, 129, 95, 130, 107, 130, 119, 130, 131, 130, 143, 130, 155, 131, 167, 131, 179, 131, 190, 131, 201, 131, 212, 131, 217, 140, 217, 151, 218, 162, 219, 172, 221, 182, 221, 194, 221, 206, 222, 216, 222, 227, 222, 238, 221, 248, 220, 258],
    [95, 160, 95, 171, 96, 181, 97, 191, 98, 201],
    [93, 162, 103, 160, 113, 164, 113, 175, 103, 179, 93, 180],
    [121, 161, 131, 162, 141, 163],
    [122, 163, 120, 173, 130, 177, 140, 179, 139, 189, 131, 197, 121, 196],
    [145, 194],
    [148, 193, 143, 202],
    [174, 165, 173, 175, 173, 186, 170, 196, 160, 199],
    [200, 166, 190, 169, 185, 178, 194, 186, 204, 190, 200, 200, 190, 202],
    [520, 324, 530, 318, 538, 310, 547, 303, 555, 295, 562, 286, 565, 276, 566, 265, 575, 260, 585, 264, 583, 274, 574, 279, 564, 278]
]

/**
 * Drawing of a lighthouse.
 * TODO: convert to sketch-rnn syntax
 */
let lighthouse = [
    [466, 394, 466, 383, 470, 371, 479, 357, 481, 345, 484, 325, 486, 309, 487, 299, 488, 286, 489, 275, 491, 265, 491, 254, 492, 244, 493, 233, 494, 221, 494, 210, 496, 200, 496, 186, 496, 174, 496, 163, 506, 159, 520, 159, 530, 157, 540, 154, 551, 153, 560, 158, 563, 171, 566, 188, 568, 202, 571, 218, 572, 234, 576, 253, 577, 264, 580, 276, 582, 292, 583, 308, 586, 322, 588, 335, 589, 349, 591, 362, 593, 373, 594, 384, 596, 397, 597, 408, 598, 418],
    [521, 198, 521, 209, 528, 217, 533, 208, 533, 197, 525, 190, 520, 199],
    [178, 364, 192, 364, 203, 361, 212, 356, 222, 352, 234, 349, 247, 345, 257, 344, 268, 346, 277, 352, 287, 359, 298, 363, 308, 359, 317, 354, 329, 348, 341, 342, 351, 341, 361, 344, 373, 351, 381, 358, 390, 363, 401, 365, 413, 363, 422, 358, 432, 355, 442, 358, 452, 362, 463, 362, 473, 359],
    [154, 310, 165, 310, 176, 310, 187, 310, 202, 310, 214, 310, 225, 310, 238, 310, 249, 310, 261, 310, 275, 310, 286, 310, 299, 310, 311, 310, 323, 310, 333, 311, 344, 311, 356, 311, 367, 311, 378, 311, 390, 311, 403, 312, 414, 312, 426, 312, 437, 312, 448, 312, 459, 312, 471, 312, 481, 311],
    [500, 159, 500, 148, 499, 138, 508, 133, 518, 135, 529, 135, 541, 135, 551, 134, 556, 143, 557, 154],
    [541, 135, 538, 145, 537, 155],
    [518, 134, 519, 146, 519, 157],
    [505, 112, 514, 107, 524, 103, 535, 103, 545, 105, 551, 114],
    [507, 114, 508, 124, 508, 135],
    [551, 118, 550, 128],
    [511, 122, 522, 121, 532, 119, 543, 119],
    [517, 391, 515, 379, 515, 368, 515, 357, 517, 347, 522, 338, 531, 333, 538, 341, 539, 353, 539, 364, 539, 375, 539, 386, 538, 396]
]

/**
 * Current (cumulative) drawing strokes from both the user
 * and other clients connected to the drawing application.
 */
let strokes = [];

/**
 * The stroke that is currently being drawn by the user.
 */
let currentStroke = [];

//let drawingMode = 'POLYLINE';
let drawingMode = 'SKETCH';

/**
 * Minimum distance (in pixels) between points in a sketched polyline.
 */
let tolerance = 3;

/**
 * Sketch-rnn drawing variables.
 */
var model_x, model_y;
var model_prev_pen = [1, 0, 0];
var last_x, last_y;

/**
 * The setup() function serves to initialize your p5.js sketch.
 * Things like setting the canvas size, frame rate, or other
 * global settings.
 */
function setup() {

    if (location.href.split('#s=').length > 1) {
        strokes = JSON.parse(unescape(location.href.split('#s=')[1]));
    }

    // make sure we enforce some minimum size of our demo
    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    // start drawing from somewhere in middle of the canvas
    start_x = screen_width / 2.0;
    start_y = screen_height / 3.0;

    // make the canvas and clear the screens
    createCanvas(screen_width, screen_height);
    frameRate(60);

    strokeWeight(3);
    stroke(255);
    noFill()
}

let baseR = Math.random();
let baseG = Math.random();
let baseB = Math.random();

function draw() {

    background(255);
    background(
        baseR * 200 - 20 * mouseX / 500,
        50 + 20 * mouseY / 500,
        baseB * 255,
        sin(frameCount * 0.01) * 40 + 100);
    ellipse(mouseX, mouseY, 10, 10);

    var origin_x = 0; //windowWidth * 0.5;
    var origin_y = 0; //windowHeight * 0.5;
    model_x = origin_x;
    model_y = origin_y;

    drawAbsoluteStrokes(strokes);
}


function drawAbsoluteStrokes() {

    alpha = 0;
    var prev_location;
    var model_prev_pen = [1, 0, 0];

    for (var i = 0; i < strokes.length; i++) {

        var location = strokes[i];

        //alpha += 2.0 / (strokes.size() / 5);
        //color c = color(0, 255 * alpha / 2, 255 - 0.5 * alpha * 255, 255);
        //stroke(c);
        //fill(c);

        let x = location[0];
        let y = location[1];
        let model_pen_down = location[2];
        let model_pen_up = location[3];
        let model_pen_end = location[4];

        // Not needed since we are iteration on points (not on the model)
        if (model_prev_pen[2] == 1) {
            break;
        }

        if (prev_location != undefined && model_prev_pen[0] == 1) {
            line(prev_location[0], prev_location[1], x, y);
        }

        model_prev_pen[0] = model_pen_down;
        model_prev_pen[1] = model_pen_up;
        model_prev_pen[2] = model_pen_end;

        prev_location = location;
    }

}

// Draw relative strokes (sketch-rnn like)
function drawRelativeStrokes() {

    alpha = 0;

    for (var i = 0; i < strokes.length; i++) {

        var location = strokes[i];

        //alpha += 2.0 / (strokes.size() / 5);
        //color c = color(0, 255 * alpha / 2, 255 - 0.5 * alpha * 255, 255);
        //stroke(c);
        //fill(c);

        let model_dx = location[0];
        let model_dy = location[1];
        let model_pen_down = location[2];
        let model_pen_up = location[3];
        let model_pen_end = location[4];

        // Not needed since we are iteration on points (not on the model)
        if (model_prev_pen[2] == 1) {
            break;
        }

        if (model_prev_pen[0] == 1) {
            line(model_x, model_y, model_x + model_dx, model_y + model_dy);
        }

        model_x += model_dx;
        model_y += model_dy;

        model_prev_pen[0] = model_pen_down;
        model_prev_pen[1] = model_pen_up;
        model_prev_pen[2] = model_pen_end;
    }

}

function mouseDragged() {
    if (drawingMode == 'SKETCH') {
        tryAddPoint(mouseX, mouseY, 1, 0, 0)
    }
}

function mousePressed() {
    if (mouseButton == RIGHT) {
        strokes = []
    } else {
        if (drawingMode == 'POLYLINE') {
            tryAddPoint(mouseX, mouseY, 1, 0, 0)
        } else if (drawingMode == 'SKETCH') {
            addPoint(mouseX, mouseY, 1, 0, 0)
        }
    }
}

function mouseReleased() {
    addPoint(mouseX, mouseY, 0, 1, 0);
    //if(batchsend) {
    //rws.send('{"method":"send-strokes", "params": {"strokes": ' + JSON.stringify(currentStroke) + '}}');
    //}
    rws.send('{"method":"send-message", "params": {"text": "mouse was released"}}');
    currentStroke = [];
}

// Math and graphics helpers

function tryAddPoint(x, y, p1, p2, p3) {
    let lastPoint = strokes[strokes.length - 1]
    const d = distance(lastPoint[0], lastPoint[1], x, y)
    if (d > tolerance) {
        addPoint(x, y, p1, p2, p3);
    }

}

function addPoint(x, y, p1, p2, p3) {
    var location = [x, y, p1, p2, p3];
    strokes.push(location);
    currentStroke.push(location);
    //if (instantsend) {
    rws.send('{"method":"send-strokes", "params": {"strokes": [' + JSON.stringify(location) + ']}}');
    //}
}

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
        if (model_prev_pen[2] == 1) {
            break;
        }

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
 * Keyboard shortcuts with Mousetrap
 * https://github.com/ccampbell/mousetrap 
 */

Mousetrap.bind('command+s', function(e) {
    console.log('save');
    saveSVG(strokes);
    return false;
});

Mousetrap.bind('command+i', function(e) {
    console.log('predict');
    rws.send(
        '{"method":"sketch-rnn:get-prediction:0.0.1", ' +
        '"params": {"strokes": ' + JSON.stringify(strokes) + '}' +
        '"id": "' + uuid() + '"}');
    return false;
});

/**
 * FileSaver helpers
 */

function saveSVG(strokes) {
    var svg = getSVG(strokes);
    var blob = new Blob([svg], { type: "image/svg+xml" });
    saveAs(blob, "drawing.svg");
}

function saveText(s) {
    var blob = new Blob([s], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "draw.txt");
}

// ██╗    ██╗███████╗██████╗ ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗███████╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
// ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗
// ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║
// ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║
//  ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

//const options = { constructor: Html5WebSocket };
const rws = new ReconnectingWebSocket('ws://' + host + ':' + port + '/ws', undefined, {});
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

var handleClientId = function(m) {
    console.log('Your id is ' + m.params.id);
}

var handleDistributeStroke = function(m) {
    var newStrokes = m.params.strokes;
    for (var i in newStrokes) {
        var location = newStrokes[i];
        strokes.push(location);
    }
};

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
            default:
                if (verbose) console.log('(No handler for ' + method + '.)');
        }
    }
}