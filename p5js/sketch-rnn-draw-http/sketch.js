 // prevent touches on mobile to scroll window
 var firstMove;

 window.addEventListener('touchstart', function(e) {
     firstMove = true;
 });

 window.addEventListener('touchmove', function(e) {
     if (firstMove) {
         e.preventDefault();
         firstMove = false;
     }
 });

 // ensure full screen on resizing
 function windowResized() {
     resizeCanvas(windowWidth, windowHeight);
 }

 // p5 sketch from Folio Item
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
     port = '8080';
 }

 /**
  * Current (cumulative) drawing strokes from both the user
  * and other clients connected to the drawing application.
  */
 let strokes = [];

 /**
  * An stream of incoming strokes to draw, sketched from
  * other clients.
  */
 let incomingStrokes = [];

 /**
  * The stroke that is currently being drawn by the user.
  */
 let currentStroke = [];

 //let drawingMode = 'POLYLINE';
 let drawingMode = 'SKETCH';

 /**
  * Minimum distance (in pixels) between points in a sketched polyline.
  */
 let tolerance = 15;

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
     //ellipse(mouseX, mouseY, 10, 10);

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
         // if (model_prev_pen[2] == 1) {
         // break;
         // }

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
         //if (model_prev_pen[2] == 1) {
         //    break;
         //}

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

 let instantPrediction = true;
 let predictionInputStrokes = [];

 function mouseReleased() {
     addPoint(mouseX, mouseY, 0, 1, 0);
     currentStroke = [];

     if (instantPrediction) {
         requestPrediction(predictionInputStrokes);
         predictionInputStrokes = [];
     }
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
     if (y < windowHeight * 0.88) {

         var location = [x, y, p1, p2, p3];
         strokes.push(location);
         currentStroke.push(location);
         predictionInputStrokes.push(location);
     }
 }

 function distance(x0, y0, x1, y1) {
     const dx = x1 - x0;
     const dy = y1 - y0;
     return Math.sqrt(dx * dx + dy * dy);
 }

 function absolute2relative(strokes) {

     var rStrokes = [];
     let prev_x, prev_y;

     for (var i in strokes) {

         let x = strokes[i][0];
         let y = strokes[i][1];
         let p1 = strokes[i][2];
         let p2 = strokes[i][3];
         let p3 = strokes[i][4];

         if (i > 0) {
             rStrokes.push([x - prev_x, y - prev_y, p1, p2, p3]);
         }

         prev_x = x;
         prev_y = y;
     }

     return rStrokes;
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
             s += '<polyline class="o-line-0" points="';
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

         if (model_pen_up == 1 || i == strokes.length - 1) {
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

 Mousetrap.bind(['command+x', 'command+o', 'ctrl+x'], function(e) {
     console.log('clear');
     strokes = [];
     return false;
 });

 Mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
     console.log('save');
     saveSVG(strokes);
     return false;
 });

 Mousetrap.bind('command+i', function(e) {
     console.log('predict');
     requestPrediction(strokes);
     return false;
 });

 var requestPrediction = function(strokes) {

     let url = 'http://' + host + ':' + port + '/simple_predict_absolute';

     var xhttp = new XMLHttpRequest();

     xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             // Parse strokes from string to JSON
             let newStrokes = JSON.parse(this.responseText);
             // Fix first stroke to not draw connecting line
             newStrokes[0] = [newStrokes[0][1], newStrokes[0][1], 0, 1, 0];
             // Queue all new strokes for animation
             for (var i in newStrokes) {
                 var location = newStrokes[i];
                 incomingStrokes.push(location);
             }

             // console.log(this);
         }
     };

     xhttp.open("POST", url, true);
     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
     xhttp.send("strokes=" + JSON.stringify(strokes));
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

 //  var handleDistributeStroke = function(m) {
 //      var newStrokes = m.params.strokes;
 //      console.log(newStrokes);
 //      for (var i in newStrokes) {
 //          var location = newStrokes[i];
 //          incomingStrokes.push(location);
 //      }
 //  };

 let incomingStrokesProcessor;

 let processIncomingStrokes = function() {
     incomingStrokesProcessor = setInterval(function() {
         var i = 0;
         while (incomingStrokes.length && i < 2) {
             strokes.push(incomingStrokes.shift());
             i++;
         }
     }, 25);
 };

 processIncomingStrokes();