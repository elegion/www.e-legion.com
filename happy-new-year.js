(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var Snow = require('./modules/snow');

function happyNewYear() {
  new Snow(document.querySelector('#snow'));
}

document.addEventListener("DOMContentLoaded", function () {
  happyNewYear();
});

},{"./modules/snow":2}],2:[function(require,module,exports){
"use strict";

function Snow(c) {
  var $ = c.getContext("2d");
  var w = c.width = window.innerWidth;
  var h = c.height = c.parentElement.offsetHeight;

  Snowy();
  function Snowy() {
    var snow,
        arr = [];
    var num = 600,
        tsc = 1,
        sp = .5;
    var sc = 1.3,
        t = 0,
        mv = 20,
        min = 1;
    for (var i = 0; i < num; ++i) {
      snow = new Flake();
      snow.y = Math.random() * (h + 50);
      snow.x = Math.random() * w;
      snow.t = Math.random() * (Math.PI * 2);
      snow.sz = 100 / (10 + Math.random() * 100) * sc;
      snow.sp = Math.pow(snow.sz * .8, 2) * .15 * sp;
      snow.sp = snow.sp < min ? min : snow.sp;
      arr.push(snow);
    }

    go();
    function go() {
      window.requestAnimationFrame(go);
      $.clearRect(0, 0, w, h);
      $.fillStyle = '#1c273a';
      $.fillRect(0, 0, w, h);
      $.fill();
      for (var i = 0; i < arr.length; ++i) {
        var f = arr[i];
        f.t += .05;
        f.t = f.t >= Math.PI * 2 ? 0 : f.t;
        f.y += f.sp;
        f.x += Math.sin(f.t * tsc) * (f.sz * .3);
        if (f.y > h + 50) f.y = -10 - Math.random() * mv;
        if (f.x > w + mv) f.x = -mv;
        if (f.x < -mv) f.x = w + mv;
        f.draw();
      }
    }

    function Flake() {
      this.draw = function () {
        this.g = $.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
        this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
        this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
        $.moveTo(this.x, this.y);
        $.fillStyle = this.g;
        $.beginPath();
        $.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
        $.fill();
      };
    }
  }

  window.addEventListener('resize', function () {
    c.width = w = window.innerWidth;
  }, false);
}

module.exports = Snow;

},{}]},{},[1]);
