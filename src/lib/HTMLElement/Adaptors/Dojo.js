HTMLElement.Adaptors.Dojo = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			dojo.query(this).connect(type, listener);
		},

		querySelectorAll: function(selector) {
			return dojo.query(selector, this);
		},

		removeEventListener: function(type, listener, useCapture) {
			dojo.query(this).disconnect(type, listener);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.Dojo);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Dojo.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Dojo.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.Dojo.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.Dojo.prototype.addEventListener;
