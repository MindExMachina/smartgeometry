
// You need to install http package before being able to import it
// Go to Sketch > Import Library > Add Library.. >
// Then search for HTTP Requests for Processing
import http.requests.*;

// Create a list (of lists of floats) to store stroke positions
ArrayList<FloatList> inputStrokes = new ArrayList<FloatList>();
ArrayList<FloatList> outputStrokes = new ArrayList<FloatList>();
// Select a model for SketchRNN predictions
String model = "bird";

// State of drawing
float drawingThreshold =20;
boolean isDrawing = false;
boolean shouldDisplayText = false;
float previous_p2 = 0;

void setup() {

  size(800,800);

  //inputStrokes.add(new FloatList(350,280,1,0,0));
  //inputStrokes.add(new FloatList(300,300,1,0,0));
  //inputStrokes.add(new FloatList(350,310,1,0,0));
  
  textAlign(CENTER);
  textSize(14);
}

void draw() {
  
  // Re-draw background
  background(255);
  // Draw input and output strokes (your sketch plus prediction)
  drawStrokes(inputStrokes, color(0,0,0));
  drawStrokes(outputStrokes, color(120,120,120));
  
}

//void mousePressed() {
//  isDrawing = true;
//}

void mouseDragged() {
  
  if(mouseButton == LEFT) {
    
      boolean shouldDrawPoint = false;
      
      if(inputStrokes.size() == 0 || !isDrawing) {
        shouldDrawPoint = true;
      } else {
        FloatList previousPoint = inputStrokes.get(inputStrokes.size()-1);
        float previousX = previousPoint.get(0);
        float previousY = previousPoint.get(1);
        if(distanceFrom(previousX, previousY, mouseX, mouseY) > drawingThreshold) {
          shouldDrawPoint = true;
        }
      }
      
      if(shouldDrawPoint) {
       inputStrokes.add(new FloatList(mouseX,mouseY,1,0,0)); 
      }
    
    if(isDrawing == false) {
       isDrawing = true; 
    }
  }
}

float distanceFrom(float x0, float y0, float x1, float y1) {
   return sqrt(pow(x1-x0, 2) + pow(y1-y0, 2)); 
}

void mouseReleased() {
  if(isDrawing) {
    isDrawing = false;
    inputStrokes.add(new FloatList(mouseX,mouseY,0,1,0)); 
  }
}

// Drawing a set of strokes (with formatting and color)
void drawStrokes(ArrayList<FloatList> strokes, color c) {
  
  float previous_p2 = 1;
  
  beginShape();
  
  for(int i = 1; i < strokes.size(); i++) {
    FloatList position = strokes.get(i);
    
    // Get coordinates of position
    float x = position.get(0);
    float y = position.get(1);
    
    // Get one-hot vector of wether this point is
    // (1,0,0) - you are going to keep drawing to next point
    // (0,1,0) - lifting up the pen, and moving to start another line
    // (0,0,1) - end of drawing
    float p1 = position.get(2);
    float p2 = position.get(3);
    float p3 = position.get(4);
    
    if(shouldDisplayText) {
      fill(0);
      text(str(i), x, y - 5);
    }
    stroke(c);
    
    noFill();
      
    if(previous_p2 == 1) { 
      endShape();
      beginShape();
    }
    
    vertex(x,y);

    previous_p2 = p2;
  }
  
  endShape();
  
}

// INPUT STROKES
// Encode our strokes format into GET request format
String encodeInputStrokes(ArrayList<FloatList> strokes) {
  
  String encodedStrokes = "[";
  
  for(int i = 0; i < strokes.size(); i++) {
  
    FloatList position = strokes.get(i);
    
    if(i > 0) {
      encodedStrokes += ",";
    }
    
    // Get coordinates of position
    float x = position.get(0);
    float y = position.get(1);
    
    // Get one-hot vector of wether this point is
    // (1,0,0) - you are going to keep drawing to next point
    // (0,1,0) - lifting up the pen, and moving to start another line
    // (0,0,1) - end of drawing
    float p1 = position.get(2);
    float p2 = position.get(3);
    float p3 = position.get(4);
    
    encodedStrokes += "["+x+","+y+","+p1+","+p2+","+p3+"]";
  }
  
  encodedStrokes += "]";
  return encodedStrokes;
}

// OUTPUT STROKES
// Decode the SketchRNN response to our own strokes format
ArrayList<FloatList> decodeOutputStrokes(JSONArray arr) {
  
  ArrayList<FloatList> list = new ArrayList<FloatList>();

  JSONArray subarr;
  float[] floats;
  for (int i = 0; i < arr.size(); i++) {
    FloatList position = new FloatList();
    subarr = arr.getJSONArray(i);
    floats = subarr.getFloatArray();
    println(floats);
    position.append(floats);
    list.add(position);
  }

  return list;
}

void predict() {
  // TODO: encode input strokes and use them
  String encodedInputStrokes = encodeInputStrokes(inputStrokes);
  String baseURL = "http://localhost:8080/simple_predict_absolute?model="+model+"&strokes=";
  GetRequest request = new GetRequest(baseURL+encodedInputStrokes);
  request.addHeader("Content-Type", "application/json");
  request.send();
  
  JSONArray responseArray = parseJSONArray(request.getContent());
  outputStrokes = decodeOutputStrokes(responseArray);
}

void keyPressed() {
  if(key == 'p') {
    // Predict if there input strokes
    if(inputStrokes.size() > 0) {
      predict(); 
    } else {
      println("No input strokes. No prediction.");
    }
  } else if(key == '1') {
    model = "bicycle"; 
  } else if(key == '2') {
    model = "crab"; 
  } else if(key == '0') {
    model = "bird"; 
  } else if(key == 'c') {
     inputStrokes = new ArrayList<FloatList>();
     outputStrokes = new ArrayList<FloatList>();
  } else if(key == 'e') {
    // TODO: Export your drawing to a JSON file
    //saveJSONArray(inputStrokes, "date_input.json");
    //saveJSONArray(outputStrokes, "date_prediction.json");
  }
}
