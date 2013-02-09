HTMLElement.Adaptors = {
	prototype: {
		querySelector: document.querySelector = function(selector) {
			return this.querySelectorAll(selector)[0] || null;
		}
	}
};

HTMLElement.include(HTMLElement.Adaptors);
