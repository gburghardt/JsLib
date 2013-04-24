(function() {
	var idIndex = 0;

	HTMLElement.Utils = {

		self: {

			include: function(mixin) {
				Function.prototype.include.call(this, mixin);
			}

		},

		prototype: {

			addClassName: function(className) {
				if (!this.hasClassName(className)) {
					this.className += (this.className) ? " " + className : className;
				}
			},

			getParentByClassName: function(className) {
				var parent = null;
				var currentElement = this;

				while (currentElement.parentNode) {
					currentElement = currentElement.parentNode;

					if (currentElement.hasClassName(className)) {
						parent = currentElement;
						break;
					}
				}

				currentElement = null;

				return parent;
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

			getParentsByClassName: function(className) {
				var parents = new HTMLArray(), node = this;

				while (node.parentNode) {
					node = node.parentNode;

					if (node.hasClassName(className)) {
						parents.push(node);
					}
				}

				parents.freeze();

				return parents;
			},

			getParentsByTagName: function(tagName) {
				var parents = new HTMLArray(), node = this;
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

				parents.freeze();

				return parents;
			},

			hasClassName: function(className) {
				return new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)").test(this.className);
			},

			identify: function() {
				if (!this.id) {
					this.id = this.getAttribute("id") || 'anonoymous-' + this.nodeName.toLowerCase() + '-' + (idIndex++);
					this.setAttribute("id", this.id);
				}

				return this.id;
			},

			removeClassName: function(className) {
				// TODO: Fix this
				if (this.hasClassName(className)) {
					this.className = this.className.replace(new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)"), "");
				}
			},

			replaceClassName: function(findClass, replaceClass) {
				var findRegex = new RegExp("(^|\\s+)(" + findClass + ")(\\s+|$)", "g");

				if (findRegex.test(this.className)) {
					this.className = this.className.replace(findRegex, "$1" + replaceClass + "$3");
				}
				else {
					this.addClassName(replaceClass);
				}
			}
		}

	};
})();

// HTMLElement is a special object which is not instantiable, but has a prototype.
Function.prototype.include.call(HTMLElement, HTMLElement.Utils);
