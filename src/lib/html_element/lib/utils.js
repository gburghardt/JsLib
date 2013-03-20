(function() {
	var idIndex = 0;

	HTMLElement.Utils = {

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

			getParentByTagName: function(tagName) {
				var parent = null;
				var currentElement = this;
				tagName = tagName.toUpperCase();

				if (tagName === "*") {
					parent = currentElement.parentNode;
				}
				else {
					while (currentElement.parentNode) {
						currentElement = currentElement.parentNode;

						if (currentElement.nodeName === tagName) {
							parent = currentElement;
							break;
						}
					}
				}

				currentElement = null;

				return parent;
			},

			getParentsByTagName: function(tagName) {
				var parents = [], node = this;
				tagName = tagName.toUpperCase();

				if (tagName === "*") {
					while (node.parentNode) {
						parents.push(node.parentNode);
						node = node.parentNode;
					}
				}
				else {
					while (node.parentNode) {
						node = node.parentNode;

						if (node.nodeName === tagName) {
							parents.push(node);
						}
					}
				}

				return parents;
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
Function.prototype.include.call(HTMLElement, HTMLElement.Utils);
