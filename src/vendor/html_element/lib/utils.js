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

			appendHTML: function(html) {
				var nodes = new HTMLArray(), i, length;
				nodes.parseHTML(html);

				for (i = 0, length = nodes.length; i < length; i++) {
					this.appendChild(nodes[i]);
				}

				return nodes;
			},

			getData: function(key) {
				var value = this.getAttribute("data-" + key.toLowerCase());
				var data = null;

				if (value) {
					try {
						data = JSON.parse(value);
					}
					catch (error) {
						// fail silently
						data = null;
					}
				}

				return data;
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

				return parents;
			},

			hasClassName: function(className) {
				return new RegExp("(^\\s*|\\s+)" + className + "(\\s+|\\s*$)").test(this.className);
			},

			identify: function() {
				if (!this.id) {
					this.id = this.getAttribute("id") || 'anonoymous-' + this.nodeName.toLowerCase() + '-' + (idIndex++);
					this.setAttribute("id", this.id);
				}

				return this.id;
			},

			insertAfter: function(newNode, referenceNode) {
				if (referenceNode.nextSibling) {
					this.insertBefore(newNode, referenceNode.nextSibling);
				}
				else {
					this.appendChild(newNode);
				}

				newNode = referenceNode = null;
			},

			removeClassName: function(className) {
				if (this.hasClassName(className)) {
					this.className = this.className
						.replace(new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)", "g"), "$1$2")
						.replace(/\s+/g, " ")
						.replace(/^\s+|\s+$/g, "");
				}
			},

			replaceClassName: function(findClass, replaceClass) {
				var findRegex = new RegExp("(^\\s*|\\s+)(" + findClass + ")(\\s+|\\s*$)", "g");

				if (findRegex.test(this.className)) {
					this.className = this.className.replace(findRegex, "$1" + replaceClass + "$3");
				}
				else {
					this.addClassName(replaceClass);
				}
			},

			setData: function(key, data) {
				if (!key) {
					throw new Error("A key argument is required for setData(key, data)");
				}
				else if (data === undefined) {
					throw new Error("A data argument is required for setData(key, data)");
				}
				else if (typeof data === "string") {
					this.setAttribute("data-" + String(key).toLowerCase(), data);
				}
				else {
					this.setAttribute("data-" + String(key).toLowerCase(), JSON.stringify(data));
				}
			}

		}

	};
})();

// HTMLElement is a special object which is not instantiable, but has a prototype.
Function.prototype.include.call(HTMLElement, HTMLElement.Utils);

Object.defineProperty(HTMLElement.prototype, "absoluteLeft", {
	enumerable: false,
	get: function() {
		var node = this;
		var left = node.offsetLeft;

		while (node = node.offsetParent) {
			left += node.offsetLeft;
		}

		node = null;

		return left;
	}
});

Object.defineProperty(HTMLElement.prototype, "absolutePosition", {
	enumerable: false,
	get: function() {
		var node = this;
		var top = node.offsetTop;
		var left = node.offsetLeft;
		var bottom, right;

		while (node = node.offsetParent) {
			left += node.offsetLeft;
			top += node.offsetTop;
		}

		right = left + this.offsetWidth;
		bottom = top + this.offsetHeight;

		node = null;

		return {
			top: top,
			right: right,
			left: left,
			bottom: bottom
		};
	}
});

Object.defineProperty(HTMLElement.prototype, "absoluteTop", {
	enumerable: false,
	get: function() {
		var node = this;
		var top = node.offsetTop;

		while (node = node.offsetParent) {
			top += node.offsetTop;
		}

		node = null;

		return top;
	}
});
