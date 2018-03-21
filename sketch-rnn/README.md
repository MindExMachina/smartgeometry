# SketchRNN Service

SketchRNN as a service. Get drawing predictions from a set of strokes using an HTTP server or a WebSocket client.

## HTTP server

Start the HTTP server.

```bash
node http-server.js
```

Then test the HTTP server works making a POST request from your Terminal.

```bash
make post
```

Then a GET request.

```bash
make get
```

Now you can try to do the get request on your browser.

Just visit <http://localhost:8080/simple_predict?strokes=[[-4,0,1,0,0],[-15,9,1,0,0],[-10,17,1,0,0],[-1,28,1,0,0]]>.

## WebSocket client

Start the WebSocket client.

```
node websocket-client.js
```

(The server needs to know how to handle the messages.)