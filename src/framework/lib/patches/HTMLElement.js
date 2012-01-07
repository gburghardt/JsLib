(function() {

if (!window.HTMLElement) {
  throw new Error("An incompatible browser was detected: " + navigator.userAgent);
}

if (!HTMLElement.prototype.addEventListener) {

  if (window.jQuery) {
    HTMLElement.prototype.addEventListener = document.addEventListener = window.addEventListener = function(type, listener, useCapture) {
      jQuery(this).bind(type, listener);
    };
    HTMLElement.prototype.removeEventListener = document.removeEventListener = window.removeEventListener = function(type, listener, useCapture) {
      jQuery(this).unbind(type, listener);
    };
  }
  else if (window.Prototype) {
    HTMLElement.prototype.addEventListener = document.addEventListener = window.addEventListener = function(type, listener, useCapture) {
      $(this).observe(type, listener);
    };
    HTMLElement.prototype.removeEventListener = document.removeEventListener = window.removeEventListener = function(type, listener, useCapture) {
      $(this).stopObserving(type, listener);
    };
  }
  else if (window.dojo) {
    // TODO: Test dojo
    HTMLElement.prototype.addEventListener = document.addEventListener = window.addEventListener = function(type, listener, useCapture) {
      dojo.query(this).connect(type, listener);
    };
    HTMLElement.prototype.removeEventListener = document.removeEventListener = window.removeEventListener = function(type, listener, useCapture) {
      dojo.query(this).disconnect(type, listener);
    };
  }
  else if (window.Mootools) {
    HTMLElement.prototype.addEventListener = document.addEventListener = window.addEventListener = function(type, listener, useCapture) {
      $(this).addEvent(type, listener);
    };
    HTMLElement.prototype.removeEventListener = document.removeEventListener = window.removeEventListener = function(type, listener, useCapture) {
      $(this).removeEvent(type, listener);
    };
  }
  else if (window.YUI) {
    HTMLElement.prototype.addEventListener = document.addEventListener = window.addEventListener = function(type, listener, useCapture) {
      YAHOO.utils.event.addListener(this, type, listener);
    };
    HTMLElement.prototype.removeEventListener = document.removeEventListener = window.removeEventListener = function(type, listener, useCapture) {
      YAHOO.utils.event.removeListener(this, type, listener);
    };
  }
}

if (!HTMLElement.prototype.querySelector || window.HTML_ELEMENT_OVERRIDE_QUERY_SELECTOR_ALL) {
  HTMLElement.prototype.querySelector = document.querySelector = function(selector) {
    return this.querySelectorAll(selector)[0];
  };

  if (window.Sizzle) {
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return Sizzle(selector, this);
    };
  }
  else if (window.jQuery) {
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return jQuery(this).find(selector);
    };
  }
  else if (window.Prototype) {
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return $(this).select(selector);
    };
  }
  else if (window.dojo) {
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return dojo.query(selector, this);
    };
  }
  else if (window.Mootools) {
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return document.id(this).getElement(selector);
    };
  }
  else if (window.YUI) {
    HTMLElement.prototype.querySelector = document.querySelector = function(selector) {
      return YUI.one(selector);
    };
    HTMLElement.prototype.querySelectorAll = document.querySelectorAll = function(selector) {
      return YUI.all(selector);
    };
  }
}

})();
