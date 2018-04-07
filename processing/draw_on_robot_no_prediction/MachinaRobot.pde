
// A quick wrapper to make writting instructions in P5 a bit faster
class MachinaRobot {
  
  // using https://github.com/alexandrainst/processing_websockets
  private WebsocketClient socket;
  
  MachinaRobot(WebsocketClient socket) {
    this.socket = socket;
  }
  
  void Move(float x, float y) {
    socket.sendMessage("Move(" + x + "," + y + ",0);");
  }
  
  void Move(float x, float y, float z) {
    socket.sendMessage("Move(" + x + "," + y + "," + z + ");");
  }
  
  void MoveTo(float x, float y, float z) {
    socket.sendMessage("MoveTo(" + x + "," + y + "," + z + ");");
  }
  
  void TransformTo(float x, float y, float z, double x0, double x1, double x2, double y0, double y1, double y2) {
    socket.sendMessage("TransformTo(" + x + "," + y + "," + z + "," +
        x0 + "," + x1 + "," + x2 + "," +
        y0 + "," + y1 + "," + y2 + ");");
  }
  
  void Rotate(float x, float y, float z, float angle) {
    socket.sendMessage("Rotate(" + x + "," + y + "," + z + "," + angle + ");");
  }
  
  void RotateTo(double x0, double x1, double x2, double y0, double y1, double y2) {
    socket.sendMessage("RotateTo(" + x0 + "," + x1 + "," + x2 + "," +
        y0 + "," + y1 + "," + y2 + ");");
  }
  
  void Axes(double j1, double j2, double j3, double j4, double j5, double j6) {
    socket.sendMessage("Axes(" + j1 + "," + j2 + "," + j3 + "," + j4 + "," + j5 + "," + j6 + ");");
  }
  
  void AxesTo(double j1, double j2, double j3, double j4, double j5, double j6) {
    socket.sendMessage("AxesTo(" + j1 + "," + j2 + "," + j3 + "," + j4 + "," + j5 + "," + j6 + ");");
  }
  
  void Speed(int speed) {
    socket.sendMessage("Speed(" + speed + ");");
  }
  
  void SpeedTo(int speed) {
    socket.sendMessage("SpeedTo(" + speed + ");");
  }
  
  void Precision(int precision) {
    socket.sendMessage("Precision(" + precision + ");");
  }
  
  void PrecisionTo(int precision) {
    socket.sendMessage("PrecisionTo(" + precision + ");");
  }
  
  void MotionMode(String mode) {
    socket.sendMessage("MotionMode(\"" + mode + "\");");
  }
  
  void Message(String msg) {
    socket.sendMessage("Message(\"" + msg + "\");");
  }
  
  void Wait(int millis) {
    socket.sendMessage("Wait(" + millis + ");");
  }
 
  void PushSettings() {
    socket.sendMessage("PushSettings();");
  }
  
  void PopSettings() {
    socket.sendMessage("PopSettings();");
  }
  
}
