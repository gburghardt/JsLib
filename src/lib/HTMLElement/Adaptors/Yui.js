HTMLElement.Adaptors.Yui = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			YAHOO.utils.event.addListener(this, type, listener);
		},

		querySelector: function(selector) {
			return YUI.one(selector);
		},

		querySelectorAll: function(selector) {
			return YUI.all(selector);
		},

		removeEventListener: function(type, listener, useCapture) {
			YAHOO.utils.event.removeListener(this, type, listener);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.Yui);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Mootools.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Mootools.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.Yui.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.Yui.prototype.addEventListener;
