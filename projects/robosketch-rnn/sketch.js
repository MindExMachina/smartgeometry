//   ██████╗██╗      █████╗ ███████╗███████╗███████╗███████╗
//  ██╔════╝██║     ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝
//  ██║     ██║     ███████║███████╗███████╗█████╗  ███████╗
//  ██║     ██║     ██╔══██║╚════██║╚════██║██╔══╝  ╚════██║
//  ╚██████╗███████╗██║  ██║███████║███████║███████╗███████║
//   ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝
//                                                          

// Quick Machina-like API to connect to MachinaBridge
class Robot {
    constructor(socket) {
        this.socket = socket;
    }

    Move(x, y) {
        this.socket.send("Move(" + x + "," + y + ",0);");
    }

    Move(x, y, z) {
        this.socket.send("Move(" + x + "," + y + "," + z + ");");
    }

    MoveTo(x, y, z) {
        this.socket.send("MoveTo(" + x + "," + y + "," + z + ");");
    }

    TransformTo(x, y, z, x0, x1, x2, y0, y1, y2) {
        this.socket.send("TransformTo(" + x + "," + y + "," + z + "," +
            x0 + "," + x1 + "," + x2 + "," +
            y0 + "," + y1 + "," + y2 + ");");
    }

    Rotate(x, y, z, angle) {
        this.socket.send("Rotate(" + x + "," + y + "," + z + "," + angle + ");");
    }

    RotateTo(x0, x1, x2, y0, y1, y2) {
        this.socket.send("RotateTo(" + x0 + "," + x1 + "," + x2 + "," +
            y0 + "," + y1 + "," + y2 + ");");
    }

    Axes(j1, j2, j3, j4, j5, j6) {
        this.socket.send("Axes(" + j1 + "," + j2 + "," + j3 + "," + j4 + "," + j5 + "," + j6 + ");");
    }

    AxesTo(j1, j2, j3, j4, j5, j6) {
        this.socket.send("AxesTo(" + j1 + "," + j2 + "," + j3 + "," + j4 + "," + j5 + "," + j6 + ");");
    }

    Speed(speed) {
        this.socket.send("Speed(" + speed + ");");
    }

    SpeedTo(speed) {
        this.socket.send("SpeedTo(" + speed + ");");
    }

    Precision(precision) {
        this.socket.send("Precision(" + precision + ");");
    }

    PrecisionTo(precision) {
        this.socket.send("PrecisionTo(" + precision + ");");
    }

    MotionMode(mode) {
        this.socket.send('MotionMode("' + mode + '");');
    }

    Message(msg) {
        this.socket.send('Message("' + msg + '");');
    }

    Wait(millis) {
        this.socket.send("Wait(" + millis + ");");
    }

    PushSettings() {
        this.socket.send("PushSettings();");
    }

    PopSettings() {
        this.socket.send("PopSettings();");
    }

    Tool(name, x, y, z, x0, x1, x2, y0, y1, y2, weightkg, gx, gy, gz) {
        this.socket.send(`new Tool("${name}",${x},${y},${z},${x0},${x1},${x2},${y0},${y1},${y2},${weightkg},${gx},${gy},${gz});`);
    }

    Attach(toolName) {
        this.socket.send(`Attach("${toolName}");`);
    }

    Detach() {
        this.socket.send("Detach();");
    }
}

// A class representing a sketch-rnn-friendly stroke
class SketchRNNStroke {
    constructor(distanceThreshold) {
        this.vectors = [];      // sketch-rnn vectors: [x, y, down?, up? end?]
        this.started = false;
        this.threshold = distanceThreshold;
        this.ended = false;
        this.streamed = false;
    }

    addStroke(stroke) {
        this.vectors = stroke;
        this.started = true;
        this.ended = true;
    }

    down(x, y) {
        if (!this.started)
        {
            this.vectors.push([x, y, 1, 0, 0]);
            this.started = true;
        }
        else 
        {
            let prev = this.vectors[this.vectors.length - 1];

            if (distance(prev[0], prev[1], x, y) > this.threshold) {
                this.vectors.push([x, y, 1, 0, 0]);
            }
        }   
    }

    add(x, y) {
        let prev = this.vectors[this.vectors.length - 1];

        if (distance(prev[0], prev[1], x, y) > this.threshold) {
            this.vectors.push([x, y, 1, 0, 0]);
        }
    }

    up(x, y) {
        // Always add the last point up, even if under threshold. Improve this?
        this.vectors.push([x, y, 0, 1, 0]);
    }

    // Marks this stroke as ended
    end() {
        if (this.vectors.length == 0) return;

        let last = this.vectors[this.vectors.length - 1]; 
        last[2] = 0;
        last[3] = 0;
        last[4] = 1;

        ended = true;
    }

    render() {

        let prev = [];
        let current = [];
        for (let i = 1; i < this.vectors.length; i++) {
            prev = this.vectors[i - 1];
            current = this.vectors[i];

            // If prev was pen up, don't draw anything
            if (prev[3] == 1) continue;

            line(prev[0], prev[1], current[0], current[1]);
        }
    }

    sendToRobot(bot, cornerZ) {
        bot.PushSettings();
        bot.MotionMode("joint");
        bot.SpeedTo(travelSpeed);
        bot.Precision(approachPrecision);
        bot.TransformTo(cornerX + paperScale * this.vectors[0][1], cornerY + paperScale * this.vectors[0][0], cornerZ + approachDistance, -1, 0, 0, 0, 1, 0);  // Note robot XY and processing XY are flipped... 
        bot.PopSettings();

        bot.PushSettings();
        bot.MotionMode("linear");
        bot.SpeedTo(drawingSpeed);
        bot.Precision(drawingPrecision);
        // bot.Move(0, 0, -approachDistance);  // note first point is not included in the stroke model

        for (let i = 0; i < this.vectors.length; i++) {
            bot.MoveTo(cornerX + paperScale *this.vectors[i][1], cornerY + paperScale * this.vectors[i][0], cornerZ);

            // Check if pen up
            if (this.vectors[i][3] == 1) {
                bot.Move(0, 0, penUpDistance);
                if (this.vectors[i + 1]) {
                    bot.MoveTo(cornerX + paperScale * this.vectors[i + 1][1], cornerY + paperScale * this.vectors[i + 1][0], cornerZ + penUpDistance);
                }
            }
            else if (this.vectors[i][4] == 1) {
                bot.Move(0, 0, approachDistance);
            }
        }

        bot.PopSettings();

        this.streamed = true;
    }
}



// Represents an input stroke and its prediction by sketch-rnn
class SketchRNNDoodle {
    constructor(distanceThreshold) {
        this.tolerance = distanceThreshold;
        this.inputStroke = new SketchRNNStroke(distanceThreshold);
        this.predictedStroke = undefined;
        this.started = false;
    }

    down(x, y) {
        this.inputStroke.down(x, y);
        this.started = true;
    }

    add(x, y) {
        this.inputStroke.add(x, y);
    }

    up(x, y) {
        this.inputStroke.up(x, y);
    }

    end() {
        this.inputStroke.end(x, y);
    }

    attachPrediction(prediction) {
        this.predictedStroke = prediction;
    }

    render(drawPrediction) {
        strokeWeight(3);
        stroke(0, this.inputStroke.streamed ? 255 : 127);
        this.inputStroke.render();

        if (drawPrediction && this.predictedStroke) {
            stroke(60, 171, 249, this.predictedStroke.streamed ? 255 : 64);
            this.predictedStroke.render();
        }
    }

    sendNextToRobot(bot) {
        // Send the inputstroke
        if (!this.inputStroke.streamed && this.inputStroke.started) {
            paperScale = paperWidth / width;  // in case widndow changed

            bot.Message("Drawing stroke");
    
            bot.Attach("sharpie1");
            this.inputStroke.sendToRobot(bot, cornerZSharpie1);
    
            bot.Wait(1000);
        }
        // send the prediction
        else if (this.predictedStroke) {
            bot.Attach("sharpie4");
            this.predictedStroke.sendToRobot(bot, cornerZSharpie4);
    
            bot.Wait(1000);
        }

        return this.predictedStroke && this.predictedStroke.streamed;
    }
}







 

//  ██████╗  █████╗ ██████╗  █████╗ ███╗   ███╗███████╗
//  ██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗ ████║██╔════╝
//  ██████╔╝███████║██████╔╝███████║██╔████╔██║███████╗
//  ██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╔╝██║╚════██║
//  ██║     ██║  ██║██║  ██║██║  ██║██║ ╚═╝ ██║███████║
//  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
//                                                     

const local = true;

let host = 'smartgeometry.herokuapp.com';
let port = '80';

if (local) {
    host = '127.0.0.1';
    port = '8080';
}

let tolerance = 15;
let showPredictions = true;
let drawingDoodle = new SketchRNNDoodle(tolerance);
let completedDoodles = [];
let robotDrawnDoodles = []; 

let model_name_current = 'bird';

// A mapping of (literal) keys to models to load
let availableModels = {
    '1': 'ANGEL', 
    '2': 'bicycle',
    '3': 'bird',
    '4': 'CAT', 
    '5': 'CRAB',
    '6': 'FACE',
    '7': 'FLOWER',
    '8': 'palm_tree' 
};


// Virtual paper data in robot coordinates (note pixel coordinates will be flipped)
// Horizontal drawing defined by top-left corner, and width-height in mm
// Should probably match pixel space for easier mapping...
const ROBOT_MAKE = "UR";

let cornerX = 500,
    cornerY = 500,
    cornerZSharpie1 = 200,  // 28.5 
    cornerZSharpie4 = 200;
let paperWidth = 350;
let paperScale;

let travelSpeed = 200, 
    drawingSpeed = 50;

let approachDistance = 50;
let penUpDistance = 15;
let approachPrecision = 5, 
    drawingPrecision = 1;

let robotDrawer; 







//  ██████╗ ███████╗        ██╗███████╗
//  ██╔══██╗██╔════╝        ██║██╔════╝
//  ██████╔╝███████╗        ██║███████╗
//  ██╔═══╝ ╚════██║   ██   ██║╚════██║
//  ██║     ███████║██╗╚█████╔╝███████║
//  ╚═╝     ╚══════╝╚═╝ ╚════╝ ╚══════╝
/**
 * The setup() function serves to initialize your p5.js sketch.
 * Things like setting the canvas size, frame rate, or other
 * global settings.
 */
function setup() {
    // make sure we enforce some minimum size of our demo
    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    // make the canvas and clear the screens
    createCanvas(screen_width, screen_height);
    frameRate(60);

    noFill();

    clearAllDoodles();
}

function draw() {
    background(255);

    strokeWeight(3);
    stroke(0);

    drawingDoodle.render();
    
    completedDoodles.forEach(doodle => doodle.render(showPredictions));
    robotDrawnDoodles.forEach(doodle => doodle.render(showPredictions));
}






//  ███╗   ███╗ ██████╗ ██╗   ██╗███████╗███████╗
//  ████╗ ████║██╔═══██╗██║   ██║██╔════╝██╔════╝
//  ██╔████╔██║██║   ██║██║   ██║███████╗█████╗  
//  ██║╚██╔╝██║██║   ██║██║   ██║╚════██║██╔══╝  
//  ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝███████║███████╗
//  ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
//                                               
function mousePressed() {
    if (mouseButton == RIGHT) {
    
    } else {
        drawingDoodle.down(mouseX, mouseY);
    }
}

function mouseDragged() {
    drawingDoodle.add(mouseX, mouseY);
}

function mouseReleased() {
    drawingDoodle.up(mouseX, mouseY);
}

function keyTyped() {
    switch(key) {
        case 'c':
            console.log("clearing strokes");
            clearAllDoodles();
            return false;

        case 'p':
            makePrediction();
            return false;

        case 's':
            showPredictions = !showPredictions;
            console.log("Showing predictions: " + showPredictions);
            return false;

        case 'r':
            sendDoodlesToRobot();
            return false;

        case 'h':
            homeRobot(robotDrawer);
            return false;

        // Change model:
        default:
            let numericEntry = availableModels[key];
            if (numericEntry) {
                model_name_current = availableModels[key];
                console.log("Set model to #" + key + " " + model_name_current);
                return false;
            }
            break;
    };

    // return false;  // prevent default browser behavior
}

// /**
//  * Keyboard shortcuts with Mousetrap
//  * https://github.com/ccampbell/mousetrap 
//  */
// Mousetrap.bind(['command+x', 'command+o', 'ctrl+x'], function (e) {
//     console.log('clear');
//     return false;
// });

// Mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
//     console.log('save');
//     saveSVG(strokes);
//     return false;
// });

// Mousetrap.bind('command+i', function (e) {
//     console.log('predict');
//     requestPrediction(strokes);
//     return false;
// });




//  ██╗    ██╗██╗███╗   ██╗██████╗  ██████╗ ██╗    ██╗
//  ██║    ██║██║████╗  ██║██╔══██╗██╔═══██╗██║    ██║
//  ██║ █╗ ██║██║██╔██╗ ██║██║  ██║██║   ██║██║ █╗ ██║
//  ██║███╗██║██║██║╚██╗██║██║  ██║██║   ██║██║███╗██║
//  ╚███╔███╔╝██║██║ ╚████║██████╔╝╚██████╔╝╚███╔███╔╝
//   ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚══╝╚══╝ 

// prevent touches on mobile to scroll window
var firstMove;

window.addEventListener('touchstart', function (e) {
    firstMove = true;
});

window.addEventListener('touchmove', function (e) {
    if (firstMove) {
        e.preventDefault();
        firstMove = false;
    }
});

// ensure full screen on resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}




//  ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
//  ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
//  █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
//  ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
//  ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
//  ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝

function makePrediction() {
    if (!drawingDoodle.started) 
    {
        if (completedDoodles.length == 0) return;
        console.log("Redoing last prediction");
        let lastDoodle = completedDoodles[completedDoodles.length - 1];
        requestPredictionImproved(lastDoodle);
    }
    else 
    {
        console.log("making prediction");
        console.log(drawingDoodle.inputStroke.vectors);
        // let doodle = new SketchRNNDoodle(drawingStroke);
        // predictedDoodles.push(doodle);
        completedDoodles.push(drawingDoodle);
        requestPredictionImproved(drawingDoodle);
        drawingDoodle = new SketchRNNDoodle(tolerance);
    }
}

var requestPredictionImproved = function (srnnDoodle) {
    let url = 'http://' + host + ':' + port + '/simple_predict_absolute';

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Parse strokes from string to JSON
            let newStrokes = JSON.parse(this.responseText);
            // Fix first stroke to not draw connecting line
            newStrokes[0] = [newStrokes[0][0], newStrokes[0][1], 0, 1, 0];

            let pred = new SketchRNNStroke(tolerance);
            pred.addStroke(newStrokes);
            
            srnnDoodle.attachPrediction(pred);
        }
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("model=" + model_name_current.toLowerCase() + "&strokes=" + JSON.stringify(srnnDoodle.inputStroke.vectors));
}


function clearAllDoodles() {
    drawingDoodle = new SketchRNNDoodle(tolerance);
    completedDoodles = [];
    robotDrawnDoodles = [];
}



function sendDoodlesToRobot() {
    // console.log("Sending " + completedDoodles.length + " doodles to robot");

    // If nothing on the buffer, send the current doodle and create a new one
    if (completedDoodles.length == 0) {
        completedDoodles.push(drawingDoodle);
        // requestPredictionImproved(drawingDoodle);
        drawingDoodle = new SketchRNNDoodle(tolerance);
    }

    // Will return true if coomplete doodle has been streamed to robot
    if (completedDoodles[0].sendNextToRobot(robotDrawer)) {
        robotDrawnDoodles.push(completedDoodles.shift());
    }
}





//  ██████╗  ██████╗ ██████╗  ██████╗ ████████╗
//  ██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝
//  ██████╔╝██║   ██║██████╔╝██║   ██║   ██║   
//  ██╔══██╗██║   ██║██╔══██╗██║   ██║   ██║   
//  ██║  ██║╚██████╔╝██████╔╝╚██████╔╝   ██║   
//  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝   
//                                             
const rws = new ReconnectingWebSocket('ws://127.0.0.1:6999/Bridge', undefined, {});
rws.timeout = 1000;

rws.addEventListener('open', () => {
    // console.log('send-strokes');
    // rws.send('{"method":"send-strokes", "params": {"strokes": [[-3,4,1,0,0],[3,10,1,0,0]]}}');
    initializeRobot();
});

rws.addEventListener('message', (e) => {
    // handleMessage(JSON.parse(e.data));
    console.log("Received from server: " + e.data);
});

rws.addEventListener('close', () => {
    console.log('connection closed');
});

rws.onerror = (err) => {
    if (err.code === 'EHOSTDOWN') {
        console.log('server down');
    }
};



function initializeRobot() {
    robotDrawer = new Robot(rws);

    // Init the sharpies (definitions taken from 'toolDefinitionGenerator' in GH)
    robotDrawer.Tool("sharpie1", 67.5, -67.5, 154.459, 0.5, -0.5, -0.70711, 0.70711, 0.70711, 0, 0.1, 0, 0, 59);  // sharpie sticking 60mm out
    robotDrawer.Tool("sharpie4", 69, 69, 156.581, 0.5, 0.5, -0.70711, -0.70711, 0.70711, 0, 0.1, 0, 0, 59);         // sharpie sticking 63mm out

    homeRobot(robotDrawer);
}

function homeRobot(bot) {
    bot.Message("Homing Robot");
    bot.PushSettings();
    bot.SpeedTo(travelSpeed);
    switch (ROBOT_MAKE.toUpperCase()) {
        case "UR":
            bot.AxesTo(0, -90, -90, -90, 90, 90);
            break;
        
        case "ABB":
            bot.AxesTo(0, 0, 0, 0, 90, 0);
            break;
        
        default:
            bot.Message("NOT SURE HOW TO HOME THIS ROBOT...");
            break
    } 
    bot.PopSettings();
}











