HTMLElement.Adaptors.Mootools = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			$(this).addEvent(type, listener);
		},

		querySelectorAll: function(selector) {
			return document.id(this).getElement(selector);
		},

		removeEventListener: function(type, listener, useCapture) {
			$(this).removeEvent(type, listener);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.Mootools);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Mootools.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Mootools.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.Mootools.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.Mootools.prototype.addEventListener;
