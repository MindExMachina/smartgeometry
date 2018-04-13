import Robot from "./sg/machina";

// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
let AudioContext = window.AudioContext || window.webkitAudioContext;
let GLOBALS = {
    // WS config
    ws: undefined,
    wsHost: '127.0.0.1',
    wsPort: '6999',
    wsPath: 'Bridge',
    currentId: '',

    // Robot stuff
    robot: {
        driver: undefined,
        initialize: function(socket) { 
            this.driver = new Robot(socket);
    
            this.driver.Message(new Date(Date.now()));
            this.driver.Message("Starting Teachable Machina");
            this.driver.SpeedTo(100);
            this.driver.MotionMode("joint");
            this.driver.AxesTo(0,0,0,0,90,0);
            this.driver.TransformTo(451, 0, 807, -1, 0, 0, 0, 1, 0);  // arm.AxesTo(0,0,0,0,90,0) for a IRB1200
            // arm.Rotate(0, 1, 0, -90);
        },
        onMessage: function (msg) {
            let obj = JSON.parse(msg);
            //$"{{\"msg\":\"action-completed\",\"data\":[{e.RemainingActions}]}}");
            if (obj.msg == 'action-completed') {
                if (obj.data[0] < 1) {
                    if (GLOBALS.currentInstruction != 0) {
                        this.sendMotionInstruction();
                    } 
                    else 
                    {
                        this.isStopped = true;
                    }
                }
            }
        },
        sendMotionInstruction: function() {
            console.log("sending instruction");
            switch(GLOBALS.currentInstruction) {
                case 1:
                    this.driver.Move(0, 0, this.displacement);
                    break;

                case 2:
                    this.driver.Move(0, this.displacement, 0);
                    break;

                case 3:
                    this.driver.Move(0, 0, -this.displacement);
                    break;

                case 4: 
                    this.driver.Move(0, -this.displacement, 0);
                    break;
            }
            this.isStopped = false;
        },
        displacement: 10,
        isStopped: true,
    },

    numClasses: 5,
    classNames: [
        'green',
        'purple',
        'orange',
        'red',
        'blue',
        // 'yellow',
        // 'brown'
    ],
    colors: {
        'green': '#2baa5e',
        'purple': '#c95ac5',
        'orange': '#f28621',
        'red': '#e8453c',
        'blue': '#4286f4',
        // 'yellow': '#4286f4',
        // 'brown': '#4286f4'
    },
    rgbaColors: {
        'green': 'rgba(43, 170, 94, 0.25)',
        'purple': 'rgba(201, 90, 197, 0.25)',
        'orange': 'rgba(221, 77, 49, 0.25)',
        'red': 'rgba(232, 69, 60, 0.25)',
        'blue': 'rgba(66, 134, 244, 1)',
        // 'yellow': 'rgba(66, 134, 244, 1)',
        // 'brown': 'rgba(66, 134, 244, 1)'
    },
    classesTrained: {
        'green': false,
        'purple': false,
        'orange': false,
        'red': false,
        'blue': false,
        // 'yellow': false,
        // 'brown': false
    },
    classImages: {
        'green': 'assets/classImages/green.png',
        'purple': 'assets/classImages/purple.png',
        'orange': 'assets/classImages/orange.png',
        'red': 'assets/classImages/red.png',
        'blue': 'assets/classImages/blue.png',
        // 'yellow': 'blue.png',
        // 'brown': 'blue.png'
    },

    currentInstruction: 0,
    classHandlers: {

        // What happens when the classified id is "green"?
        "green": function(id) {
            console.log('This executes when ' + id + ' activates.');
            console.log('Verde');
            // arm.Message("STOP");
            GLOBALS.currentInstruction = 0;  // STOP
        },

        // or "purple"
        "purple": function(id) {
            console.log('This executes when ' + id + ' activates.');
            console.log('Morado.');
            // arm.Message("UP");
            // arm.Move(0, 0, GLOBALS.robotDisplacement);
            GLOBALS.currentInstruction = 1;  // UP
            if (GLOBALS.robot.isStopped) GLOBALS.robot.sendMotionInstruction();
        },

        // or "orange"
        "orange": function(id) {
            console.log('This executes when ' + id + ' activates.');
            console.log('Naranja.');
            // arm.Message("RIGHT");
            // arm.Move(0, GLOBALS.robotDisplacement, 0);
            GLOBALS.currentInstruction = 2;  // RIGHT
            if (GLOBALS.robot.isStopped) GLOBALS.robot.sendMotionInstruction();
        },

        "red": function(id) {
            console.log('This executes when ' + id + ' activates.');
            console.log('Rojo.');
            // arm.Message("DOWN");
            // arm.Move(0, 0, -GLOBALS.robotDisplacement);
            GLOBALS.currentInstruction = 3;  // DOWN
            if (GLOBALS.robot.isStopped) GLOBALS.robot.sendMotionInstruction();
        },

        "blue": function(id) {
            console.log('This executes when ' + id + ' activates.');
            console.log('Naranja.');
            // arm.Message("LEFT");
            // arm.Move(0, -GLOBALS.robotDisplacement, 0);
            GLOBALS.currentInstruction = 4;  // LEFT
            if (GLOBALS.robot.isStopped) GLOBALS.robot.sendMotionInstruction();
        },
        
        
        // If no handler is provided for a class id, this gets executed.

        "default": function(id) {

            console.log('Default class handler. No handler provided for class ' + id + '.');

            // GLOBALS.ws.send('{"method":"send-message", "params": {"text": "This is Teachable Machine here: ' + id + '"}}');
            // GLOBALS.ws.send('{"method":"set-background-color", "params": {"color": "' + GLOBALS.colors[id] + '"}}');

            GLOBALS.currentInstruction = 0;  // STOP
        }
    },

    /* end · sg edit*/
    button: {
        /* start · sg edit*/
        padding: 0,
        frontHeight: 40,
        states: {
            normal: {
                x: 8,
                y: 8
            },
            pressed: {
                x: 4,
                y: 4
            }
        }
    },
    classId: null,
    predicting: false,
    micThreshold: 25,
    audioContext: new AudioContext(),
    isBackFacingCam: false
};

export default GLOBALS;