BaseCollection = Array.extend({

	prototype: {

		className: null,

		classReference: null,

		pointer: 0,

		initialize: function(className) {
			this.className = className || null;
			Array.apply(this, arguments);
		},

		contains: function(x) {
			if (typeof x === "object") {
				if (x.__proto__ === Object.prototype) {
					return this.containsId( x[ this.getClassReference().getPrimaryKey() ] );
				}
				else if (x.getPrimaryKey() ) {
					return this.containsId( x.getPrimaryKey() );
				}
				else {
					return this.containsInstance(x);
				}
			}
			else {
				return this.containsId(x);
			}
		},

		containsId: function(id) {
			if (!id) {
				return false;
			}

			var i = this.length;

			while (i--) {
				if (this[i].getPrimaryKey() == id) {
					return true;
				}
			}

			return false;
		},

		containsInstance: function(instance) {
			var i = this.length;

			while(i--) {
				if (this[i] === instance) {
					return true;
				}
			}

			return false;
		},

		create: function(attributesOrInstance) {
			if (!attributesOrInstance || attributesOrInstance.__proto__ === Object.prototype) {
				attributesOrInstance = this.getModelInstance(attributesOrInstance);
			}
			else {
				throw new Error("Attributes passed to BaseCollection#create must be a direct instance of Object");
			}

			return this.push(attributesOrInstance);
		},

		each: function(context, callback) {
			var i = 0, length = this.length;

			if (!callback) {
				callback = context;
				context = this;
			}

			for (i; i < length; i++) {
				callback.call(context, this[i], i);
			}
		},

		fastForward: function() {
			this.pointer = this.length;
		},

		getClassReference: function() {
			if (!this.classReference) {
				this.classReference = this.className.constantize();
			}

			return this.classReference;
		},

		getModelInstance: function(attributes) {
			var Klass = this.getClassReference();
			var model = null;
			
			if ( attributes && attributes[ Klass.getPrimaryKey() ] ) {
				model = Klass.find( attributes[ Klass.getPrimaryKey() ] ) || new Klass();
			}
			else {
				model = new Klass();
			}

			model.attributes = attributes;
			Klass = null;

			return model;
		},

		isCorrectType: function(model) {
			return (model.__proto__ === this.getClassReference().prototype);
		},

		next: function() {
			var model = null;

			if (this.pointer < this.length) {
				model = this[this.pointer];
				this.pointer++;
			}
			else {
				this.rewind();
			}

			return model;
		},

		pop: function() {
			return (this.length === 0) ? null : Array.prototype.pop.call(this);
		},

		prev: function() {
			var model = null;

			this.pointer--;

			if (this.pointer > -1) {
				model = this[this.pointer];
			}
			else {
				this.rewind();
			}

			return model;
		},

		push: function(model) {
			if (!this.isCorrectType(model)) {
				throw new Error("Item must be a direct instance of " + this.className);
			}
			else if (this.contains(model)) {
				return null;
			}
			else {
				Array.prototype.push.call(this, model);
				return model;
			}
		},

		rewind: function() {
			this.pointer = 0;
		},

		sort: function(columns, direction) {
			columns = (columns instanceof Array) ? columns : [columns];
			direction = (direction || "asc").toLowerCase();

			var getPropertyValues = function(a, b) {
				var i = 0, length = columns.length, values = null, key;

				if (length === 1) {
					values = [ a[ columns[0] ], b[ columns[0] ] ];
				}
				else {
					for (i; i < length; i++) {
						key = columns[i];

						if (a[key] !== b[key]) {
							values = [ a[key], b[key] ];
							break;
						}
					}

					if (!values) {
						values = [ a[ columns[0] ], b[columns[0] ] ];
					}
				}

				a = b = null;

				return values;
			};

			var ascendingSorter = function(a, b) {
				var values = getPropertyValues(a, b);

				a = b = null;

				if (values[0] > values[1]) {
					return 1;
				}
				else if (values[0] < values[1]) {
					return -1;
				}
				else {
					return 0;
				}
			};

			var descendingSorter = function(a, b) {
				var values = getPropertyValues(a, b);

				a = b = null;

				if (values[0] < values[1]) {
					return 1;
				}
				else if (values[0] > values[1]) {
					return -1;
				}
				else {
					return 0;
				}
			};

			var sorter = (direction === "asc") ? ascendingSorter : descendingSorter;

			Array.prototype.sort.call(this, sorter);
			return this;
		}

	}
});
