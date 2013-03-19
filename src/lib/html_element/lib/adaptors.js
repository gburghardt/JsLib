(function() {
	var idIndex = 0;

	HTMLElement.Adaptors = {

		self: {

			include: function(mixin) {
				Function.prototype.include.call(this, mixin);
			}

		},

		prototype: {

			addClass: function(className) {
				if (!this.hasClass(className)) {
					this.className += " " + className;
				}
			},

			hasClass: function(className) {
				return new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)").test(this.className);
			},

			identify: function() {
				if (!this.id) {
					this.id = this.getAttribute("id") || 'anonoymous-' + this.nodeName.toLowerCase() + '-' + (idIndex++);
					this.setAttribute("id", this.id);
				}

				return this.id;
			},

			removeClass: function(className) {
				// TODO: Fix this
				if (this.hasClass(className)) {
					this.className = this.className.replace(new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)"), "");
				}
			}

		}

	};
})();

// HTMLElement is a special object which is not instantiable, but has a prototype.
Function.prototype.include.call(HTMLElement, HTMLElement.Adaptors);
document.querySelector = document.querySelector || HTMLElement.Adaptors.querySelector;
