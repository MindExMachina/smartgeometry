
float[] model_prev_pen = new float[3];
float model_x;
float model_y;
float origin_x;
float origin_y;
FloatList strokes = new FloatList(
  -4, 0, 1, 0, 0,-15, 9, 1, 0, 0,-10, 17, 1, 0, 0,-1, 28, 1, 0, 0,14, 13, 1, 0, 0,12, 4, 1, 0, 0,22, 1, 1, 0, 0,14, -11, 1, 0, 0,5, -12, 1, 0, 0,2, -19, 1, 0, 0,-12, -23, 1, 0, 0,-13, -7, 1, 0, 0,-14, -1, 0, 1, 0
);

void setup() {
  pixelDensity(displayDensity());
  size(600,600);
  strokes = new FloatList();
}

void draw() {
  
  background(255);
  
  model_x = origin_x;
  model_y = origin_y;
 
  drawStrokes(strokes);
}

float prev_x = 0;
float prev_y = 0;
int clickCount = 0;

void keyPressed() {
  if(key == 'p' || key == 'P') {
  
    prettyPrint(strokes);
    
  } 
}

void mousePressed() {
  //println(mouseX + " " + mouseY);
  //println("clicked");
  if(mouseButton == RIGHT) { 
    clickCount = 0;
    strokes = new FloatList();
  } else {
    
  if(clickCount > 0) {
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



float alpha = 0;

void drawStrokes(FloatList strokes) {
  
  alpha = 0;
  
  for(int i = 0; i < strokes.size()/5; i++) {
    
    alpha += 2.0/(strokes.size()/5);
    color c = color(0,255*alpha/2,255-0.5*alpha*255,255);
    stroke(c);
    fill(c);
    
    float model_dx = strokes.get(5*i);
    float model_dy = strokes.get(5*i+1);  
    float model_pen_down = strokes.get(5*i+2);
    float model_pen_up = strokes.get(5*i+3);
    float model_pen_end = strokes.get(5*i+4);
      
    // Not needed since we are iteration on points (not on the model)
    if(model_prev_pen[2] == 1) {
      break;
    }
    
    if(model_prev_pen[0] == 1) {
      line(model_x, model_y, model_x + model_dx, model_y + model_dy);

    }
    
    model_x += model_dx;
    model_y += model_dy;
    
    model_prev_pen[0] = model_pen_down;
    model_prev_pen[1] = model_pen_up;
    model_prev_pen[2] = model_pen_end;
    
  }
  
}

void prettyPrint(FloatList strokes) {
  
    String s = "[";
    String s2 = "";
  
  for(int i = 0; i < strokes.size()/5; i++) {

    float model_dx = 0.4*strokes.get(5*i);
    float model_dy = 0.4*strokes.get(5*i+1);  
    float model_pen_down = strokes.get(5*i+2);
    float model_pen_up = strokes.get(5*i+3);
    float model_pen_end = strokes.get(5*i+4);
    
    if(i > 0) {
    s = s + ",";
    s2 = s2 + ",";
    }  
    s = s + "[" + model_dx + "," + model_dy + "," + model_pen_down
          + "," + model_pen_up + "," + model_pen_end + "]";
          
    s2 = s2 + model_dx + "," + model_dy + "," + model_pen_down
          + "," + model_pen_up + "," + model_pen_end;

  }
  
  s = s + "]";
  println(s);
  println("-----");
  println(s2);
}
