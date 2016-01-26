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
