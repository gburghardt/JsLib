HTMLElement.Adaptors.Prototype = {
	prototype: {

		addEventListener: function(type, listener, useCapture) {
			$(this).observe(type, listener);
		},

		queryAncestors: function(selector) {
			return $(this).up(selector);
		},

		queryAncestorsAll: function(selector) {
			// Warning: Because Element#up will only collect all ancestors matching the selector
			//          if an index is provided, we set the index very high. If your document
			//          tree is more than 100,000 nodes deep, this method will become inaccurate.
			//          Then again, if your document tree is more than 100,000 nodes deep, you
			//          probably need to refactor something.
			return $(this).up(selector, 100000);
		},

		querySelectorAll: function(selector) {
			return $(this).select(selector);
		},

		removeEventListener: function(type, listener, useCapture) {
			$(this).stopObserving(type, listener);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.Prototype);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Prototype.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Prototype.prototype.querySelector;
document.addEventListener = document.addEventListener || HTMLElement.Adaptors.Prototype.prototype.addEventListener;
window.addEventListener = window.addEventListener || HTMLElement.Adaptors.Prototype.prototype.addEventListener;
