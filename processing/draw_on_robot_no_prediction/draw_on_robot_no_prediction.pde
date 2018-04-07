/*
  A Processing sketch to draw strokes, and send them to the robot via WebSockets
 
 Before runnign this sketch, make sure you are running the attached version of the 
 Machina Bridge App in the `bridgeapp` folder.
 */

import websockets.*;

WebsocketClient wsc;
MachinaRobot bot;

float drawing_distance_threshold = 3;
float alpha = 0;

float[] model_prev_pen = new float[3];
float model_x;
float model_y;
float origin_x;
float origin_y;
FloatList strokes, prediction;
float prev_x = 0;
float prev_y = 0;
int clickCount = 0;

// Virtual paper data
// Horizontal drawing defined by top-left corner, and width-height in mm
// Should probably match pixel space for easier mapping... 
float cornerX = 200, 
  cornerY = 200, 
  cornerZ = 200;
float paperWidth = 300, 
  paperHeight = 300;
float paperScaleX, paperScaleY;

int travelSpeed = 200, 
  drawingSpeed = 50;

float approachDistance = 25;
int approachPrecision = 5, 
  drawingPrecision = 1;

void setup() {
  pixelDensity(displayDensity());
  size(600, 600);
  strokes = new FloatList();
  prediction = new FloatList();
  
  paperScaleX = paperWidth / width;
  paperScaleY = paperHeight / height;

  wsc = new WebsocketClient(this, "ws://127.0.0.1:6999/Bridge");
  bot = new MachinaRobot(wsc);
  thread("homeRobot");
}

void draw() {

  background(255);

  model_x = origin_x;
  model_y = origin_y;

  drawStrokes(strokes);
}

void keyPressed() {
  if (key == 'r' || key == 'R') {
    thread("robotDrawingRequest");
  } else if (key == 'h' || key == 'H') {
    thread("homeRobot");
  }
}

void robotDrawingRequest() {
  println("Streaming stroke to the robot");
  
  // Note robot XY and processing XY are flipped... 
  model_x = cornerY + paperScaleY * origin_x;
  model_y = cornerX + paperScaleX * origin_y;
  
  bot.PushSettings();
  bot.MotionMode("joint");
  bot.SpeedTo(travelSpeed);
  bot.Precision(approachPrecision);
  bot.TransformTo(model_y, model_x, cornerZ + approachDistance, -1, 0, 0, 0, 1, 0);  // Note robot XY and processing XY are flipped... 
  bot.PopSettings();

  bot.PushSettings();
  bot.MotionMode("linear");
  bot.SpeedTo(drawingSpeed);
  bot.Precision(drawingPrecision);
  bot.Move(0, 0, -approachDistance);  // note first point is not included in the stroke model

  float model_dx, model_dy, model_pen_down, model_pen_up, model_pen_end;
  for (int i = 0; i < strokes.size()/5; i++) {
    println("Parsing " + strokes.get(5*i) + "," + strokes.get(5*i+1) + "," + strokes.get(5*i+2) + "," + strokes.get(5*i+3) + "," + strokes.get(5*i+4));
    model_dx = paperScaleX * strokes.get(5*i);
    model_dy = paperScaleY * strokes.get(5*i+1);  
    model_pen_down = strokes.get(5*i+2);
    model_pen_up = strokes.get(5*i+3);
    model_pen_end = strokes.get(5*i+4);
    
    bot.MoveTo(model_y + model_dy, model_x + model_dx, cornerZ);  // Note robot XY and processing XY are flipped... 
    
    model_x += model_dx;
    model_y += model_dy;

    model_prev_pen[0] = model_pen_down;
    model_prev_pen[1] = model_pen_up;
    model_prev_pen[2] = model_pen_end;
  }
  
  bot.Move(0, 0, approachDistance);
  bot.PopSettings();
  
  homeRobot();  
  
}

void homeRobot() {
  bot.Message("Homing Robot");
  bot.PushSettings();
  bot.SpeedTo(400);
  bot.AxesTo(0, 0, 0, 0, 90, 0);
  bot.PopSettings();
}


//This is an event like onMouseClicked. If you chose to use it, it will be executed whenever the server sends a message 
void webSocketEvent(String msg) {
  println("Message from the server: " + msg);
}


void mousePressed() {
  if (mouseButton == RIGHT) { 
    clickCount = 0;
    strokes = new FloatList();
  } else {

    if (clickCount > 0) {
      float dx = (mouseX - prev_x);
      float dy = (mouseY - prev_y);
      strokes.append(dx);
      strokes.append(dy);
      strokes.append(1);
      strokes.append(0);
      strokes.append(0);
      //println(strokes);
    } else {
      origin_x = mouseX;
      origin_y = mouseY;
      clickCount++;
    }

    prev_x = mouseX;
    prev_y = mouseY;
  }
}



void drawStrokes(FloatList strokes) {

  pushStyle();
  alpha = 0;

  color c;
  float model_dx, model_dy, model_pen_down, model_pen_up, model_pen_end;
  for (int i = 0; i < strokes.size()/5; i++) {

    alpha += 2.0/(strokes.size()/5);
    c = color(0, 255*alpha/2, 255-0.5*alpha*255, 255);
    stroke(c);
    fill(c);

    model_dx = strokes.get(5*i);
    model_dy = strokes.get(5*i+1);  
    model_pen_down = strokes.get(5*i+2);
    model_pen_up = strokes.get(5*i+3);
    model_pen_end = strokes.get(5*i+4);

    // Not needed since we are iteration on points (not on the model)
    if (i != 0 && model_prev_pen[2] == 1) {
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

  popStyle();
}

String stringifyStroke(FloatList strokes, boolean splitInArrays) {
  String s = "[";
  String s2 = "";

  for (int i = 0; i < strokes.size()/5; i++) {

    float model_dx = 0.4*strokes.get(5*i);
    float model_dy = 0.4*strokes.get(5*i+1);  
    float model_pen_down = strokes.get(5*i+2);
    float model_pen_up = strokes.get(5*i+3);
    float model_pen_end = strokes.get(5*i+4);

    if (i > 0) {
      s = s + ",";
      s2 = s2 + ",";
    }  
    s = s + "[" + model_dx + "," + model_dy + "," + model_pen_down
      + "," + model_pen_up + "," + model_pen_end + "]";

    s2 = s2 + model_dx + "," + model_dy + "," + model_pen_down
      + "," + model_pen_up + "," + model_pen_end;
  }

  s = s + "]";

  return splitInArrays ? s : s2;
}


FloatList JSONArrayToFloatList(JSONArray arr) {
  FloatList list = new FloatList();

  JSONArray subarr;
  float[] floats;
  for (int i = 0; i < arr.size(); i++) {
    subarr = arr.getJSONArray(i);
    floats = subarr.getFloatArray();
    list.append(floats);
  }

  return list;
}
