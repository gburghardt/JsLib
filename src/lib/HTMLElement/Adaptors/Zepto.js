HTMLElement.Adaptors.Zepto = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			$(this).bind(type, listener);
		},

		// Find the first ancestor that matches the selector
		queryAncestors: function(selector) {
			return $(this).closest(selector);
		},

		// Find all ancestors that match the selector
		queryAncestorsAll: function(selector) {
			return $(this).parents(selector);
		},

		querySelectorAll: function(selector) {
			return $(this).find(selector);
		},

		removeEventListener: function(type, listener, useCapture) {
			$(this).unbind(type, listener);
		}

	}
};


HTMLElement.include(HTMLElement.Adaptors.Zepto);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Zepto.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Zepto.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.Zepto.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.Zepto.prototype.addEventListener;

