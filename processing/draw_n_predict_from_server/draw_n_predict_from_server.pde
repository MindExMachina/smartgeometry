/*
  A Processing sketch to draw strokes, and get a prediction from a sketch-rnn running locally.
  
  Before running this sketch, make sure you are running the 'sketch-rnn/http-server.js' 
  from this repo on your machine.
*/

import http.requests.*;

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

void setup() {
  pixelDensity(displayDensity());
  size(600, 600);
  strokes = new FloatList();
  prediction = new FloatList();
}

void draw() {

  background(255);

  model_x = origin_x;
  model_y = origin_y;
  
  drawStrokes(strokes); //<>//
  drawStrokes(prediction);
}
 //<>//

void keyPressed() { //<>//
  if (key == 'p' || key == 'P') {
    thread("predictionRequest");
  }
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


void predictionRequest() {
  println("Predicting...");

  String stringyStroke = stringifyStroke(strokes, true);
  JSONArray query = parseJSONArray(stringyStroke);
  saveJSONArray(query, "stroke.json");
  
  PostRequest post = new PostRequest("http://localhost:8080/simple_predict?strokes=" + stringyStroke);
  post.addHeader("Content-Type", "application/json");
  post.send();

  JSONArray array = parseJSONArray(post.getContent());
  saveJSONArray(array, "prediction.json");
  prediction = JSONArrayToFloatList(array);
  println(prediction);
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
      break; //<>//
    }

    if (model_prev_pen[0] == 1) {
      line(model_x, model_y, model_x + model_dx, model_y + model_dy); //<>//
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
