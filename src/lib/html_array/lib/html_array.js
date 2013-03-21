var HTMLArray = Array.extend({

	includes: HTMLElementCollections.Utils,

	prototype: {

		initialize: function() {
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
		},

		freeze: function() {
			this.frozen = true;
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

			return Array.prototype.push.apply(this, arguments);
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
