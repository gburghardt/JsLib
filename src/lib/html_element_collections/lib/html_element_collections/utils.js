HTMLElementCollections.Utils = {

	prototype: {

		addClassName: function(className) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].addClassName(className);
			}

			return this;
		},

		addEventListener: function(eventName, callback, capturing) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].addEventListener(eventName, callback, capturing);
			}

			callback = null;

			return this;
		},

		forEach: function(callback, context) {
			for (var i = 0, length = this.length; i < length; i++) {
				callback.call(context, this[i], i, this);
			}

			callback = context = null;

			return this;
		},

		getAttribute: function(name) {
			var value = null;

			for (var i = 0, length = this.length; i < length; i++) {
				value = this[i].getAttribute(name);

				if (value) {
					break;
				}
				else {
					value = null;
				}
			}

			return value;
		},

		getElementsByTagName: function(tagName) {
			var nodes = null, collection = new HTMLArray();

			for (var i = 0, length = this.length; i < length; i++) {
				nodes = this[i].getElementsByTagName(tagName);

				if (nodes.length) {
					collection.push.apply(collection, nodes);
				}
			}

			collection.freeze();

			nodes = null;

			return collection;
		},

		getParentByTagName: function(tagName) {
			var node = null;

			for (var i = 0, length = this.length; i < length; i++) {
				node = this[i].getParentByTagName(tagName);

				if (node) {
					break;
				}
			}

			return node;
		},

		getParentByClassName: function(className) {
			var node = null;

			for (var i = 0, length = this.length; i < length; i++) {
				node = this[i].getParentByClassName(tagName);

				if (node) {
					break;
				}
			}

			return node;
		},

		getParentsByClassName: function(className) {
			var nodes = null, collection = new HTMLArray();

			for (var i = 0, length = this.length; i < length; i++) {
				nodes = this[i].getParentsByClassName(className);

				if (nodes.length) {
					collection.push.apply(collection, nodes);
				}
			}

			collection.freeze();

			nodes = null;

			return collection;
		},

		getParentsByTagName: function(tagName) {
			var now = new Date().getTime();
			var nodes = null, collection = new HTMLArray();

			for (var i = 0, length = this.length; i < length; i++) {
				nodes = this[i].getParentsByTagName(tagName);

				if (nodes.length) {
					collection.push.apply(collection, nodes);
				}
			}

			collection.freeze();

			nodes = null;

			return collection;
		},

		setInnerHTML: function(html) {
			html = (html === undefined) ? "" : html;

			for (var i = 0, length = this.length; i < length; i++) {
				this[i].innerHTML = html;
			}

			return this;
		},

		removeAttribute: function(name) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].removeAttribute(name);
			}

			return this;
		},

		removeClassName: function(className) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].removeClassName(className);
			}

			return this;
		},

		removeEventListener: function(eventName, callback, capturing) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].removeEventListener(eventName, callback, capturing);
			}

			callback = null;

			return this;
		},

		querySelector: function(selector) {
			var node = null;

			for (var i = 0, length = this.length; i < length; i++) {
				node = this[i].querySelector(selector);

				if (node) {
					break;
				}
			}

			return node || null;
		},

		querySelectorAll: function(selector) {
			var nodes = null, collection = new HTMLArray();

			for (var i = 0, length = this.length; i < length; i++) {
				nodes = this[i].querySelectorAll(selector);

				if (nodes.length) {
					collection.push.apply(collection, nodes);
				}
			}

			collection.freeze();

			nodes = null;

			return collection;
		},

		setAttribute: function(name, value) {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i].setAttribute(name, value);
			}

			return this;
		}

	}

};

HTMLCollection.include(HTMLElementCollections.Utils);
NodeList.include(HTMLElementCollections.Utils);
