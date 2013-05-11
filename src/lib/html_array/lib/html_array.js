var HTMLArray = Array.extend({

	includes: HTMLElementCollections.Utils,

	self: {

		id: new Date().getTime() + "",

		index: 0

	},

	prototype: {

		elementMap: null,

		initialize: function(htmlOrElements) {
			Array.call(this);

			this.elementMap = {};

			var type = (htmlOrElements === null) ? "null" : typeof htmlOrElements;

			if (type === "string") {
				this.parseHTML(htmlOrElements);
			}
			else if (type === "object") {
				this.push.apply(this, htmlOrElements);
			}
		},

		destroy: function() {
			for (var i = 0, length = this.length; i < length; i++) {
				this[i] = null;
			}
		},

		parseHTML: function(html) {
			var node, div = document.createElement("div");

			div.innerHTML = html.replace(/(^\s+)|(\s+$)/g, "");

			while (div.firstChild) {
				node = div.removeChild(div.firstChild);
				this.push(node);
			}

			div = null;

			return this;
		},

		push: function() {
			var elements = arguments, i = 0, length = elements.length, element;

			for (i; i < length; i++) {
				element = elements[i];

				if (!element.__NODE_ID__) {
					element.__NODE_ID__ = this.constructor.id + this.constructor.index++;
				}

				if (!this.elementMap[element.__NODE_ID__]) {
					this.elementMap[element.__NODE_ID__] = true;
					Array.prototype.push.call(this, element);
				}
			}

			// return Array.prototype.push.apply(this, arguments);
		},

		slice: function() {
			var collection = new HTMLArray();

			collection.push.apply(collection, Array.prototype.slice.apply(this, arguments));

			return collection;
		},

		splice: function() {
			var collection = new HTMLArray();

			collection.push.apply(collection, Array.prototype.splice.apply(this, arguments));

			return collection;
		}

	}

});
