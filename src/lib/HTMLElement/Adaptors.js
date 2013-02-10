(function() {
	var idIndex = 0;

	HTMLElement.Adaptors = {
		self: {
			include: function(mixin) {
				Function.prototype.include.call(this, mixin);
			}
		},
		prototype: {
			identify: function() {
				if (!this.id) {
					this.id = this.getAttribute("id") || 'anonoymous-' + this.nodeName.toLowerCase() + '-' + (idIndex++);
					this.setAttribute("id", this.id);
				}

				return this.id;
			},
			querySelector: document.querySelector = function(selector) {
				return this.querySelectorAll(selector)[0] || null;
			}
		}
	};
})();

// HTMLElement is a special object which is not instantiable, but has a prototype.
Function.prototype.include.call(HTMLElement, HTMLElement.Adaptors);
