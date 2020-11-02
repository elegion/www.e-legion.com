(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var buildCountText = require('./modules/build-count-text');
var Cookies = require('./modules/cookies');

function birthdayPage() {
  gallery();
  blocksShift();
  blocksAppear();
  baloonsParty();
}

function blocksShift() {
  var shiftBreakpoiont = 767;
  function shiftCards() {
    var $cards = $(".birthday-card:not(:first-child):not(:last-child)");
    var prevMT = -150;
    $cards.each(function () {
      var $card = $(this);
      var $prev = $card.prev(".birthday-card");
      var prevH = $prev.height();
      var cardH = $card.height();
      var margin = 100 - prevH - prevMT;
      prevMT = margin;
      $card.css({ marginTop: margin + "px" });
    });
    $(".birthday-card:last-child").each(function () {
      var h = $(this).height();
      $(this).css({ marginTop: -h + "px" });
    });
  }

  function unshiftCards() {
    var $cards = $(".birthday-card:not(:first-child)");
    $cards.css({ marginTop: 0 + "px" });
  }

  function onResize() {
    var ww = $(window).width();
    if (ww > shiftBreakpoiont) {
      shiftCards();
    } else {
      unshiftCards();
    }
  }

  $(window).resize(onResize);
  onResize();
}

function gallery() {
  $(".birthday-card-image-list").each(function () {
    if ($(this).find(".birthday-card-image").length > 1) {
      $(this).slick({
        arrows: false,
        dots: true,
        slidesToShow: 1,
        infinite: false
      });
    }
  });
}

function blocksAppear() {
  var animationBreakpoiont = 767;
  function startAppearAnimation() {
    var $animBlocks = $(".birthday-card-year, .birthday-card-text, .birthday-card-image, .birthday-bullet, .birthday-wish");
    $animBlocks.addClass("appeared-block");

    function onScroll() {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();

      $animBlocks.each(function () {
        var $elem = $(this);
        var elemTop = $elem.offset().top;
        if (elemTop < docViewBottom) {
          $elem.addClass("appear");
        }
      });
    }

    $(window).scroll(onScroll);
    onScroll();
  }

  var ww = $(window).width();
  if (ww > animationBreakpoiont) {
    startAppearAnimation();
  }
}

function baloonsParty() {
  var colors = ["purple", "blue", "orange"];
  var $baloons = $("svg.baloon");
  var timeToFly = 10000;
  var flyDelayMax = 1000;
  var swingDelayMax = 3000;
  var animationInProgress = false;

  var likes;
  var likeUrl = $('meta[name="likes-url"]').attr("content");;
  var likeKey = "birthday-likes";

  function getLikesCount() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', likeUrl, true);
    xhr.onload = function () {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText);
        likes = response.Data;
      }
    };
    xhr.onerror = function () {
      console.log("Error likes: network error");
    };
    xhr.send();
  }

  function sendLike() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', likeUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.onerror = function () {
      console.log("Error likes: network error");
    };
    xhr.send();
  }

  function secureLikes() {
    Cookies.set(likeKey, "true", { path: "/", 'max-age': 60 * 60 * 24 * 365 * 10 });
    localStorage.setItem(likeKey, "true");
  }

  function initBaloons() {
    $baloons.each(function () {
      var $baloon = $(this);
      setRndPosition($baloon);
      setColor($baloon);
      setSwingAnimation($baloon);
      fly($baloon);
    });
  }

  function clearBaloonColor($baloon) {
    for (var i = 0; i < colors.length; i++) {
      $baloon.removeClass(colors[i]);
    }
  }

  function resetBaloon($baloon) {
    $baloon.removeAttr('style');
    clearBaloonColor($baloon);
    $baloon.removeClass("swing");
    $baloon.removeClass("can-fly");
  }

  function setRndPosition($baloon) {
    var x = Math.floor(Math.random() * 100); //percents
    var y = Math.floor(Math.random() * 33.33333) + 66.66667; //percents
    $baloon.css({
      top: y + "%",
      left: x + "%"
    });
  }

  function setColor($baloon) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    $baloon.addClass(color);
  }

  function setSwingAnimation($baloon) {
    var swindDelay = Math.floor(Math.random() * swingDelayMax);
    setTimeout(function () {
      $baloon.addClass("swing");
    }, swindDelay);
  }

  function fly($baloon) {
    $baloon.addClass("can-fly");
    var flyDelay = Math.floor(Math.random() * flyDelayMax);
    setTimeout(function () {
      $baloon.css({
        top: "0%"
      });
    }, flyDelay);
    setTimeout(function () {
      resetBaloon($baloon);
    }, timeToFly + flyDelay);
  }

  $(".js-baloon-party").click(function () {
    if (!animationInProgress) {
      initBaloons();
      var txt;
      if (likes !== undefined) {
        txt = $(this).data("countText");
        txt = txt.replace("#COUNT#", buildCountText(likes + 1, "раз", "", "а", ""));
      } else {
        txt = $(this).data("altText");
      }
      $(this).text(txt);

      var votedCookie = Cookies.get(likeKey) === "true";
      var votedStorage = localStorage.getItem(likeKey);
      if (!votedCookie && !votedStorage) {
        secureLikes();
        sendLike();
      } else if (!votedCookie && votedStorage || votedCookie && !votedStorage) {
        secureLikes();
      }

      animationInProgress = true;
      setTimeout(function () {
        animationInProgress = false;
      }, timeToFly + Math.max(swingDelayMax, flyDelayMax));
    }
  });

  getLikesCount();
}

document.addEventListener("DOMContentLoaded", function () {
  birthdayPage();
});

},{"./modules/build-count-text":2,"./modules/cookies":3}],2:[function(require,module,exports){
"use strict";

function buildCountText(count, txtBase, txt1, txt2, txt5, showNum) {
    showNum = showNum !== undefined ? showNum : true;
    var str = '';
    if (count <= 14 && count >= 5) {
        str = txt5;
    } else {
        var num = count % 10;
        if (num == 1) {
            str = txt1;
        } else if (num == 0) {
            str = txt5;
        } else if (num >= 2 && num <= 4) {
            str = txt2;
        } else if (num >= 5 && num <= 9) {
            str = txt5;
        } else {
            str = txt5;
        }
    }
    if (showNum) {
        return count + " " + txtBase + str;
    } else {
        return txtBase + str;
    }
}

module.exports = buildCountText;

},{}],3:[function(require,module,exports){
"use strict";

var Cookies = {
  get: function get(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },

  set: function set(name, value, options) {
    options = options || {};

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (var optionKey in options) {
      updatedCookie += "; " + optionKey;
      var optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }
};

module.exports = Cookies;

},{}]},{},[1]);
