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

			var _frozen = false;

			Object.defineProperty(this, "frozen", {
				get: function() {
					return _frozen;
				},
				set: function(frozen) {
					if (!_frozen || frozen) {
						_frozen = !!frozen;
					}
					else {
						throw new Error("Cannot unfreeze a frozen HTMLArray");
					}
				}
			});

			this.elementMap = {};

			var type = (htmlOrElements === null) ? "null" : typeof htmlOrElements;

			if (type === "string") {
				this.parseHTML(htmlOrElements);
				this.freeze();
			}
			else if (type === "object") {
				this.push.apply(this, htmlOrElements);
				this.freeze();
			}
		},

		freeze: function() {
			this.frozen = true;
		},

		parseHTML: function(html) {
			var node, div = document.createElement("div");

			div.innerHTML = html.replace(/(^[\s+])|([\s+]$)/g, "");

			while (div.lastChild) {
				node = div.removeChild(div.lastChild);
				this.push(node);
			}

			div = null;
		},

		pop: function() {
			if (this.frozen) {
				throw new Error("Cannot call pop() on a frozen HTMLArray");
			}

			return Array.prototype.pop.apply(this, arguments);
		},

		push: function() {
			if (this.frozen) {
				throw new Error("Cannot call push() on a frozen HTMLArray");
			}

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

		shift: function() {
			if (this.frozen) {
				throw new Error("Cannot call shift() on a frozen HTMLArray");
			}

			return Array.prototype.shift.call(this);
		},

		slice: function() {
			var collection = new HTMLArray();

			collection.push.apply(collection, Array.prototype.slice.apply(this, arguments));
			collection.freeze();

			return collection;
		},

		sort: function() {
			throw new Error("Cannot sort an HTMLArray");
		},

		splice: function() {
			var collection = new HTMLArray();

			collection.push.apply(collection, Array.prototype.splice.apply(this, arguments));

			return collection;
		},

		unshift: function() {
			if (this.frozen) {
				throw new Error("Cannot call unshift() on a frozen HTMLArray");
			}

			Array.prototype.unshift.apply(this, arguments);
		}

	}

});
