// Copyright 2018 Nono Martínez Alonso (Nono.ma)
//
// The MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Author: Nono Martínez Alonso <mail@nono.ma>
 *
 * @fileoverview SketchRNN as a service over HTTP and WebSockets.
 */

// Load WebSocket dependencies
const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const uuid = require('uuid');

// Configuration

let verbose = true;
const local = true;

let ws_host = 'smartgeometry.herokuapp.com';
let ws_port = '80';

if (local) {
    ws_host = '127.0.0.1';
    ws_port = '3000';
}

// ██╗    ██╗███████╗██████╗ ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗███████╗
// ██║    ██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
// ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗
// ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║
// ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║
//  ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

const options = { constructor: Html5WebSocket };
const rws = new ReconnectingWebSocket('ws://' + ws_host + ':' + ws_port + '/ws', undefined, options);
rws.timeout = 1000;

rws.addEventListener('open', () => {
    // ...
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

var handleClientId = function(m) {
    console.log('Your id is ' + m.params.id);
}

var handleDistributeStroke = function(m) {
    // var newStrokes = m.params.strokes;
    // for (var i in newStrokes) {
    //     var location = newStrokes[i];
    //     strokes.push(location);
    // }
};