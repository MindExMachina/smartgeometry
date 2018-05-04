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