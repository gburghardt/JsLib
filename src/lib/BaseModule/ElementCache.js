BaseModule = window.BaseModule || {};

BaseModule.ElementCache = {

	included: function(Klass) {
		if (Klass.addCallbacks) {
			Klass.addCallbacks({
				afterInit: "initElementCache",
				beforeDestructor: "destroyElementCache"
			});
		}
	},

	prototype: {

		compiledElementCollections: null,

		compiledElements: null,

		elementCache: null,

		initElementCache: function() {
			this.elementCache = {};
			this.compileElementCollections();
			this.compileElements();
			this.initElementCacheGetters();
		},

		initElementCacheGetters: function() {
			if (this.__proto__.elementCacheInitialized) {
				return;
			}

			var property;

			for (property in this.compiledElements) {
				if (this.compiledElements.hasOwnProperty(property)) {
					Object.defineProperty(this.__proto__, property, {
						enumerable: true,
						get: this.createElementGetter(property)
					});
				}
			}

			for (property in this.compiledElementCollections) {
				if (this.compiledElementCollections.hasOwnProperty(property)) {
					Object.defineProperty(this.__proto__, property, {
						enumerable: true,
						get: this.createElementCollectionGetter(property)
					});
				}
			}

			this.__proto__.elementCacheInitialized = true;
		},

		destroyElementCache: function() {
			if (this.elementCache) {
				this.expireElementCache();
				this.elementCache = null;
			}
		},

		compileElementCollections: function() {
			if (this.__proto__.compiledElementCollections) {
				return;
			}

			var property, proto = this.__proto__, elementCollections;
			this.__proto__.compiledElementCollections = {};

			while (proto) {
				if (proto.hasOwnProperty("elementCollections") && proto.elementCollections) {
					elementCollections = proto.elementCollections;

					for (property in elementCollections) {
						if (elementCollections.hasOwnProperty(property) && !this.__proto__.compiledElementCollections[property]) {
							this.__proto__.compiledElementCollections[property] = elementCollections[property];
						}
					}
				}

				proto = proto.__proto__;
			}

			elementCollections = proto = null;
		},

		compileElements: function() {
			if (this.__proto__.compiledElements) {
				return;
			}

			var property, proto = this.__proto__, elements;
			this.__proto__.compiledElements = {};

			while (proto) {
				if (proto.hasOwnProperty("elements") && proto.elements) {
					elements = proto.elements;

					for (property in elements) {
						if (elements.hasOwnProperty(property) && !this.__proto__.compiledElements[property]) {
							this.__proto__.compiledElements[property] = elements[property];
						}
					}
				}

				proto = proto.__proto__;
			}

			elements = proto = null;
		},

		createElementCollectionGetter: function(property) {
			return function() {
				if (!this.elementCache[property]) {
					this.elementCache[property] = this.element.querySelectorAll( this.compiledElementCollections[property] );
				}

				return this.elementCache[property];
			};
		},

		createElementGetter: function(property) {
			return function() {
				if (!this.elementCache[property]) {
					this.elementCache[property] = this.element.querySelector( this.compiledElements[property] );
				}

				return this.elementCache[property];
			};
		},

		expireElementCache: function() {
			if (arguments.length) {
				for (var i = 0, length = arguments.length; i < length; i++) {
					this.elementCache[ arguments[i] ] = null;
				}
			}
			else {
				for (var property in this.elementCache) {
					if (this.elementCache.hasOwnProperty(property)) {
						this.elementCache[property] = null;
					}
				}
			}
		}

	}

};

BaseModule.include(BaseModule.ElementCache);
