(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var SnowInteractive = require('./modules/snow-interactive');

function happyNewYear() {
  new SnowInteractive(document.querySelector('#snow'));
}

document.addEventListener("DOMContentLoaded", function () {
  happyNewYear();
});

},{"./modules/snow-interactive":2}],2:[function(require,module,exports){
"use strict";

function SnowInteractive(c) {
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
        window.requestAnimationFrame = requestAnimationFrame;
    })();

    var flakes = [],
        canvas = c,
        ctx = canvas.getContext("2d"),
        flakeCount = 400,
        mX = -100,
        mY = -100;

    setSize();

    function setSize() {
        canvas.width = window.innerWidth;
        var height = canvas.parentNode.offsetHeight;
        canvas.height = height;
    }

    function snow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i],
                x = mX,
                y = mY,
                minDist = 150,
                x2 = flake.x,
                y2 = flake.y;

            var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                dx = x2 - x,
                dy = y2 - y;

            if (dist < minDist) {
                var force = minDist / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;

                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
            } else {
                flake.velX *= .98;
                if (flake.velY <= flake.speed) {
                    flake.velY = flake.speed;
                }
                flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
            }

            ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= canvas.height || flake.y <= 0) {
                reset(flake);
            }

            if (flake.x >= canvas.width || flake.x <= 0) {
                reset(flake);
            }

            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(snow);
    };

    function reset(flake) {
        flake.x = Math.floor(Math.random() * canvas.width);
        flake.y = 0;
        flake.size = Math.random() * 3 + 2;
        flake.speed = Math.random() * 1 + 0.5;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = Math.random() * 0.5 + 0.3;
    }

    function init() {
        for (var i = 0; i < flakeCount; i++) {
            var x = Math.floor(Math.random() * canvas.width),
                y = Math.floor(Math.random() * canvas.height),
                size = Math.random() * 3 + 2,
                speed = Math.random() * 1 + 0.5,
                opacity = Math.random() * 0.5 + 0.3;

            flakes.push({
                speed: speed,
                velY: speed,
                velX: 0,
                x: x,
                y: y,
                size: size,
                stepSize: Math.random() / 30,
                step: 0,
                opacity: opacity
            });
        }

        snow();
    };

    canvas.addEventListener("mousemove", function (e) {
        mX = e.clientX, mY = e.clientY;
    });

    window.addEventListener("resize", function () {
        setSize();
    });

    init();
}

module.exports = SnowInteractive;

},{}]},{},[1]);
