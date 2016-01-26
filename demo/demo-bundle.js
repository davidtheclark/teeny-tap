(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var tapListener = require('..');
var count = 0;
var docTapListener;

document.getElementById('init').addEventListener('click', function(e) {
  e.stopPropagation();
  if (docTapListener) return;
  docTapListener = true;
  docTapListener = tapListener(document.documentElement, registerTap);
});

document.getElementById('remove').addEventListener('click', function(e) {
  e.stopPropagation();
  if (docTapListener) docTapListener.remove();
  docTapListener = null;
});

function registerTap(e) {
  console.log(e.type);
  count++;
  document.getElementById('count').innerHTML = count;
}

},{"..":2}],2:[function(require,module,exports){
module.exports = function createTapListener(el, callback) {
  var startX = 0;
  var startY = 0;
  var touchStarted = false;
  var touchMoved = false;
  // Assume that if a touchstart event initiates, the user is
  // using touch and click events should be ignored.
  // If this isn't done, touch-clicks will fire the callback
  // twice: once on touchend, once on the subsequent "click".
  var usingTouch = false;

  el.addEventListener('click', handleClick, false);
  el.addEventListener('touchstart', handleTouchstart, false);

  function handleClick(e) {
    if (usingTouch) return;
    callback(e);
  }

  function handleTouchstart(e) {
    usingTouch = true;

    if (touchStarted) return;
    touchStarted = true;

    el.addEventListener('touchmove', handleTouchmove, false);
    el.addEventListener('touchend', handleTouchend, false);
    el.addEventListener('touchcancel', handleTouchcancel, false);

    touchMoved = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function handleTouchmove(e) {
    if (touchMoved) return;

    if (
      Math.abs(e.touches[0].clientX - startX) <= 10
      && Math.abs(e.touches[0].clientY - startY) <= 10
    ) return;

    touchMoved = true;
  }

  function handleTouchend(e) {
    touchStarted = false;
    removeSecondaryTouchListeners();
    if (!touchMoved) {
      callback(e);
    }
  }

  function handleTouchcancel() {
    touchStarted = false;
    touchMoved = false;
    startX = 0;
    startY = 0;
  }

  function removeSecondaryTouchListeners() {
    el.removeEventListener('touchmove', handleTouchmove, false);
    el.removeEventListener('touchend', handleTouchend, false);
    el.removeEventListener('touchcancel', handleTouchcancel, false);
  }

  function removeTapListener() {
    el.removeEventListener('click', handleClick, false);
    el.removeEventListener('touchstart', handleTouchstart, false);
    removeSecondaryTouchListeners();
  }

  return {
    remove: removeTapListener,
  };
};

},{}]},{},[1]);
