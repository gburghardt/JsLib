HTMLElement.Adaptors.jQuery = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			jQuery(this).bind(type, listener);
		},

		// Find the first ancestor that matches the selector
		queryAncestors: function(selector) {
			return jQuery(this).closest(selector);
		},

		// Find all ancestors that match the selector
		queryAncestorsAll: function(selector) {
			return jQuery(this).parents(selector);
		},

		querySelectorAll: function(selector) {
			return jQuery(this).find(selector);
		},

		removeEventListener: function(type, listener, useCapture) {
			jQuery(this).unbind(type, listener);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.jQuery);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.jQuery.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.jQuery.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.jQuery.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.jQuery.prototype.addEventListener;
