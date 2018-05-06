import * as tf from '@tensorflow/tfjs';
import yolo, { downloadModel } from 'tfjs-yolo-tiny';

import { Webcam } from './webcam';

import WsClient from './ws-client';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

let model;
const webcam = new Webcam(document.getElementById('webcam'));

// sg
let trackingClass = 'apple';
let drawAllClasses = false; // wether to draw all other classes that are not 'trackingClass'
let threshold = 35;
let verbose = true;
const ws = new WsClient('smartgeometry.herokuapp.com:80');
const log__coordinates = document.querySelector('.c-log__coordinates');
const log__actions = document.querySelector('.c-log__actions');

(async function main() {
    try {
        ga();
        model = await downloadModel();

        /*
        alert("Just a heads up! We'll ask to access your webcam so that we can " +
          "detect objects in semi-real-time. \n\nDon't worry, we aren't sending " +
          "any of your images to a remote server, all the ML is being done " +
          "locally on device, and you can check out our source code on Github.");
        */

        await webcam.setup();

        doneLoading();
        run();
    } catch (e) {
        console.error(e);
        showError();
    }
})();

async function run() {
    let i = 0;

    while (true) {

        clearRects();

        const inputImage = webcam.capture();

        const t0 = performance.now();

        const boxes = await yolo(inputImage, model);

        const t1 = performance.now();
        //console.log("YOLO inference took " + (t1 - t0) + " milliseconds.");

        let foundTrackingClass = false;

        boxes.forEach(box => {
            const {
                top,
                left,
                bottom,
                right,
                classProb,
                className,
            } = box;

            // draw center point
            //drawRect(x - 5, y - 5, 10, 10, '', 'blue');

            // draw bounding box
            if (drawAllClasses) {
                let bx = left;
                let by = top;
                let bw = right - left;
                let bh = bottom - top;

                drawRect(bx, by, bw, bh,
                    `${className} Confidence: ${Math.round(classProb * 100)}%`,
                    'white')
            }

            // is this the object type we are tracking? (say, an orange)
            if (className == trackingClass) {

                foundTrackingClass = true;

                let bx = left;
                let by = top;
                let bw = right - left;
                let bh = bottom - top;

                drawRect(bx, by, bw, bh,
                    `${className} Confidence: ${Math.round(classProb * 100)}%`,
                    'white')

                // calculate bounding box center point
                let x = bx + 0.5 * (bw);
                let y = by + 0.5 * (bh);

                let relativeX = x - 416 / 2;
                let relativeY = -(y - 416 / 2);

                let actions = [];
                let actionsText = 'tell <code>Machina</code> to ';

                if (Math.abs(relativeX) < threshold && Math.abs(relativeY) < threshold) {
                    actions = ['stop'];
                } else {
                    actionsText += '<code>move</code> ';

                    // lateral movement
                    if (relativeX >= threshold) {
                        actions.push('right');
                    } else if (relativeX <= -threshold) {
                        actions.push('left');
                    }

                    // vertical movement
                    if (relativeY >= threshold) {
                        actions.push('up');
                    } else if (relativeY <= -threshold) {
                        actions.push('down');
                    }
                }

                for (var i in actions) {
                    if (i > 0) {
                        actionsText += ' and ';
                    }
                    actionsText += actions[i];
                }

                let isLeft = actions.indexOf('left') > -1 ? true : false;
                let isRight = actions.indexOf('right') > -1 ? true : false;
                let isDown = actions.indexOf('down') > -1 ? true : false;
                let isUp = actions.indexOf('up') > -1 ? true : false;
                let isStop = actions.indexOf('stop') > -1 ? true : false;

                if (isLeft && isUp) {

                } else if (isLeft && isDown) {

                } else if (isRight && isUp) {

                } else if (isRight && isDown) {

                } else if (isRight) {

                } else if (isLeft) {

                } else if (isDown) {

                } else if (isUp) {

                } else if (isStop) {

                }

                log__coordinates.innerHTML = '[' + Math.round(relativeX) + ', ' + Math.round(relativeY) + ']';
                log__actions.innerHTML = actionsText;
            }
        });

        if (!foundTrackingClass) {

            log__coordinates.innerHTML = 'Looking for ' + trackingClass + '..';
            log__actions.innerHTML = '<span class="u-idle">idle</span>';

        }

        await tf.nextFrame();
    }
}

const webcamElem = document.getElementById('webcam-wrapper');

function drawRect(x, y, w, h, text = '', color = 'red') {
    const rect = document.createElement('div');
    rect.classList.add('rect');
    rect.style.cssText = `top: ${y}; left: ${x}; width: ${w}; height: ${h}; border-color: ${color}`;

    const label = document.createElement('div');
    label.classList.add('label');
    label.innerText = text;
    rect.appendChild(label);

    webcamElem.appendChild(rect);
}

function clearRects() {
    const rects = document.getElementsByClassName('rect');
    while (rects[0]) {
        rects[0].parentNode.removeChild(rects[0]);
    }
}

function doneLoading() {
    const elem = document.getElementById('loading-message');
    elem.style.display = 'none';

    const successElem = document.getElementById('success-message');
    successElem.style.display = 'block';

    const webcamElem = document.getElementById('webcam-wrapper');
    webcamElem.style.display = 'block';
}

function showError() {
    const elem = document.getElementById('error-message');
    elem.style.display = 'block';
    doneLoading();
}

function ga() {
    if (process.env.UA) {
        window.dataLayer = window.dataLayer || [];

        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', process.env.UA);
    }
}