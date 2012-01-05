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

if (!HTMLElement.prototype.querySelector || window.HTML_ELEMENT_OVERRIDE_QUERY_SELECTOR_ALL) {
  HTMLElement.prototype.querySelector = function(selector) {
    return this.querySelectorAll(selector)[0];
  };

  if (window.Sizzle) {
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return Sizzle(selector, this);
    };
  }
  else if (window.jQuery) {
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return jQuery(this).find(selector);
    };
  }
  else if (window.Prototype) {
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return $(this).select(selector);
    };
  }
  else if (window.dojo) {
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return dojo.query(selector, this);
    };
  }
  else if (window.Mootools) {
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return document.id(this).getElement(selector);
    };
  }
  else if (window.YUI) {
    HTMLElement.prototype.querySelector = function(selector) {
      return YUI.one(selector);
    };
    HTMLElement.prototype.querySelectorAll = function(selector) {
      return YUI.all(selector);
    };
  }
}
