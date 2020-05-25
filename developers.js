(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function developersLanding() {
  calculator();
}

function calculator() {
  var itemModel = {
    id: 0,
    person: 0,
    price: 3000,
    hours: 1,
    money: 3000
  };

  var calcObject = [];
  var $rows = {};
  var currency = 'USD';
  var currSign = '$';
  var rates = {
    EUR: 0.0128224362,
    USD: 0.0141046798
  };
  var ratesStorageKey = "rates";

  var activeClass = "active";

  function getCurrencyRates() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.exchangeratesapi.io/latest?base=RUB", true);
    xhr.onload = function () {
      if (this.status === 200) {
        localStorage.setItem(ratesStorageKey, this.responseText);
        var ratesObj = JSON.parse(this.responseText);
        rates = {
          EUR: ratesObj.rates.EUR,
          USD: ratesObj.rates.USD
        };
      }
    };
    xhr.send();
  }

  function gatRates() {
    var storeRates = localStorage.getItem(ratesStorageKey);
    if (storeRates) {
      var ratesObj = JSON.parse(storeRates);
      var now = new Date(Date.now() - 24 * 60 * 60 * 1000);
      var year = now.getUTCFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var date = year + '-' + (month < 10 ? '0' + month : month) + '-' + day;
      if (date == ratesObj.date) {
        rates = {
          EUR: ratesObj.rates.EUR,
          USD: ratesObj.rates.USD
        };
        return;
      }
    }
    getCurrencyRates();
  }

  function init() {
    $rows = $(".js-calc-item");
    $rows.each(function () {
      initItem(this);
    });

    initCurrencySwitch();
    initAdd();

    currency = $(".js-calc-currency.active").data("code");
    currSign = $(".js-calc-currency.active").data("sign");
  }

  function initItem(item) {
    var id = $(item).data("itemId");
    var person = parseInt($(item).find(".js-calc-person").val()) || 0;
    var price = parseInt($(item).find(".js-calc-price").data("price"));
    var hours = parseInt($(item).find(".js-calc-hours").val()) || 0;
    var money = price * hours;

    var obj = $.extend({}, itemModel, {
      id: id,
      person: person,
      price: price,
      hours: hours,
      money: money
    });
    calcObject.push(obj);

    initRowUI(item);
  }

  function initRowUI(item) {
    $(item).find('.devselect').selectpicker();
    initHourGroup(item);
    initHours(item);
    initRemove(item);
    initSwitch(item);
  }

  function initHourGroup(item) {
    var groupHoverClass = "developers-calc-group-hover";
    var groupFocusedClass = "developers-calc-group-focused";
    var groupInitedClass = "developers-calc-group-inited";

    var $groups = $(item).find(".js-calc-hours-group").not("." + groupInitedClass);
    $groups.each(function () {
      var self = this;
      $(self).addClass(groupInitedClass);

      $(self).hover(function () {
        $(self).addClass(groupHoverClass);
      }, function () {
        $(self).removeClass(groupHoverClass);
      });

      var $input = $(self).find('input');
      $input.focusin(function () {
        $(self).addClass(groupFocusedClass);
      });
      $input.focusout(function () {
        $(self).removeClass(groupFocusedClass);
      });
    });
  }

  function initHours(item) {
    $(item).find(".js-calc-hours").on("input", function () {
      var hours = parseInt($(this).val()) || 0;
      var $item = $(this).closest(".js-calc-item");
      var id = $item.data("itemId");

      calcObject.some(function (element, index) {
        if (id == element.id) {
          calcObject[index].hours = hours;
          calcObject[index].money = hours * calcObject[index].price;
          return true;
        }
      });
      drawData();
    });
  }

  function initRemove(item) {
    $(item).find(".js-calc-remove").click(function () {
      var $row = $(this).closest(".js-calc-item");
      removeItem($row);
    });
  }

  function initSwitch(item) {
    $(item).find(".js-calc-switch").click(function () {
      var $row = $(this).closest(".js-calc-item");
      if ($row.hasClass(activeClass)) {
        hideItem($row);
      } else {
        showItem($row);
      }
    });
  }

  function initCurrencySwitch() {
    $(".js-calc-currency").click(function (e) {
      e.preventDefault();

      $(".js-calc-currency").removeClass("active");
      $(this).addClass("active");

      currency = $(this).data("code");
      currSign = $(this).data("sign");

      drawData();
    });
  }

  function initAdd() {
    $(".js-calc-add").click(function () {
      addItem();
    });
  }

  function drawData() {
    var total = 0;
    $(calcObject).each(function () {
      var obj = this;
      total += obj.money;
      var $row = $(".js-calc-item[data-item-id='" + obj.id + "']");
      if ($row.length) {
        $row.find(".js-calc-hours").val(obj.hours);
        $row.find(".js-calc-money").text(moneyFormat(obj.money) + '\xA0\u20BD');
      }
    });

    var converted = Math.round(total * rates[currency]);
    var totalFormat = moneyFormat(converted) + '\xA0' + currSign;
    $(".js-calc-total").text(totalFormat);

    if (calcObject.length > 1) {
      $(".js-calc-remove").removeAttr("disabled");
    } else {
      $(".js-calc-remove").attr("disabled", "disabled");
    }
  }

  function removeItem($item) {
    var id = $item.data("itemId");
    $item.remove();
    removeItemData(id);
    drawData();
  }

  function removeItemData(id) {
    calcObject = calcObject.filter(function (item) {
      return item.id !== id;
    });
  }

  function addItem() {
    var tpl = $("#calc-item-tpl").html();
    var itemDom = $(tpl);
    var nextId = calcObject.length ? calcObject[calcObject.length - 1].id + 1 : 1;
    itemDom.attr("data-item-id", nextId);

    initItem(itemDom);

    $(".js-calc-body").append(itemDom);
    drawData();
    showItem(itemDom);
  }

  function showItem($item) {
    $(".js-calc-item").removeClass(activeClass);
    $item.addClass(activeClass);
  }

  function hideItem($item) {
    $item.removeClass(activeClass);
  }

  // Process
  init();
  gatRates();
  drawData();
}

function numberFormat(n) {
  var prec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var dec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var sep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';

  var s = [];

  var toFixedFix = function toFixedFix(n, prec) {
    var k = Math.pow(10, prec);
    return '' + (Math.round(n * k) / k).toFixed(prec);
  };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec);
}

function moneyFormat(n) {
  return numberFormat(n, n == Math.round(n) ? 0 : 2, ',', ' ');
}

document.addEventListener("DOMContentLoaded", function () {
  developersLanding();
});

},{}]},{},[1]);
