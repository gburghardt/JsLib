if (!window.HTMLElement) {
  throw new Error("An incompatible browser was detected: " + navigator.userAgent);
}

if (!HTMLElement.prototype.addEventListener) {

  // MSIE
  if (HTMLElement.prototype.attachEvent) {
    HTMLElement.prototype.addEventListener = function(type, listener, useCapture) {
      this.attachEvent("on" + type, listener);
    };

    HTMLElement.prototype.removeEventListener = function(type, listener, useCapture) {
      this.detachEvent("on" + type, listener);
    };
  }
  
}
