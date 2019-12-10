(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var defaults = { path: '/' };
  options = options || {};
  options = Object.assign({}, defaults, options);

  if (options.expires && options.expires.toUTCString) {
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

function trackPhoneClick() {
  var phoneLinkList = document.querySelectorAll('a[href^="tel"]');
  phoneLinkList.forEach(function (item) {
    item.addEventListener('click', function (e) {
      fbq('track', 'Click_Number');
    });
  });
}

function trackEmailClick() {
  var emailLinkList = document.querySelectorAll('a[href^="mailto"]');
  emailLinkList.forEach(function (item) {
    item.addEventListener('click', function (e) {
      fbq('track', 'Click_Email');
    });
  });
}

function trackMainPageView() {
  if (document.location.pathname == '/') {
    fbq('track', 'Main');
  }
}

function trackPortfolioVisits() {
  var pathname = document.location.pathname;
  if (pathname.indexOf('/portfolio') >= 0) {
    fbq('track', 'Portfolio');

    var portfolioVisit = getCookie('portfolio-visit') || '{}';
    portfolioVisit = JSON.parse(portfolioVisit);

    portfolioVisit.urls = portfolioVisit.urls || [];
    if (portfolioVisit.urls.indexOf(pathname) < 0) {
      portfolioVisit.urls.push(pathname);
    }
    if (portfolioVisit.urls.length > 3 && !portfolioVisit.tracked) {
      fbq('track', 'Portfolio_3_Pages');
      portfolioVisit.tracked = true;
    }

    setCookie('portfolio-visit', JSON.stringify(portfolioVisit), {});
  }
}

function faceBookEvents() {
  if (typeof fbq === 'undefined') {
    return;
  }

  trackPhoneClick();
  trackEmailClick();
  trackMainPageView();
  trackPortfolioVisits();
}

document.addEventListener("DOMContentLoaded", function () {
  faceBookEvents();
});

},{}]},{},[1]);
