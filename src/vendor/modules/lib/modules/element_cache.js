Modules.ElementCache = {

	included: function(Klass) {
		Klass.attempt("addCallbacks", {
			afterInit: "initElementCache",
			beforeDestructor: "destroyElementCache"
		});
	},

	prototype: {

		compiledElementCollections: null,

		compiledElements: null,

		elementCache: null,

		elementCacheOptions: {
			eagerLoad: false,
			enabled: true
		},

		initElementCache: function() {
			this.elementCache = {};
			this.compileElementCollections();
			this.compileElements();
			this.compileElementCacheOptions();
			this.initElementCacheGetters();

			if (this.elementCacheOptions.eagerLoad) {
				this.eagerLoadElementCache();
			}
		},

		initElementCacheGetters: function() {
			if (this.__proto__.elementCacheInitialized) {
				return;
			}

			var property;

			for (property in this.elements) {
				if (this.elements.hasOwnProperty(property)) {
					Object.defineProperty(this.__proto__, property, {
						enumerable: true,
						get: this.createElementGetter(property)
					});
				}
			}

			for (property in this.elementCollections) {
				if (this.elementCollections.hasOwnProperty(property)) {
					Object.defineProperty(this.__proto__, property, {
						enumerable: true,
						get: this.createElementCollectionGetter(property)
					});
				}
			}

			this.__proto__.elementCacheInitialized = true;
		},

		eagerLoadElementCache: function() {
			var key, properties = ["elements", "elementCollections"], i, length, property;

			for (i = 0, length = properties.length; i < length; i++) {
				property = this[ properties[i] ];

				for (key in property) {
					if (property.hasOwnProperty(key)) {
						this[key];
					}
				}
			}
		},

		destroyElementCache: function() {
			if (this.elementCache) {
				this.expireElementCache();
				this.elementCache = null;
			}
		},

		compileElementCacheOptions: function() {
			Object.defineProperty(this, "elementCacheOptions", {
				get: function() {
					if (!this.__proto__.compiledElementCacheOptions) {
						this.__proto__.compiledElementCacheOptions = this.mergePropertyFromPrototypeChain("elementCacheOptions");
					}

					return this.compiledElementCacheOptions;
				}
			});
		},

		compileElementCollections: function() {
			Object.defineProperty(this, "elementCollections", {
				get: function() {
					if (!this.__proto__.compiledElementCollections) {
						this.__proto__.compiledElementCollections = this.mergePropertyFromPrototypeChain("elementCollections");
					}

					return this.compiledElementCollections;
				}
			});
		},

		compileElements: function() {
			Object.defineProperty(this, "elements", {
				get: function() {
					if (!this.__proto__.compiledElements) {
						this.__proto__.compiledElements = this.mergePropertyFromPrototypeChain("elements");
					}

					return this.compiledElements;
				}
			});
		},

		createElementCollectionGetter: function(property) {
			if (this.elementCacheOptions.enabled) {
				return function() {
					if (!this.elementCache[property]) {
						this.elementCache[property] = this.element.querySelectorAll( this.elementCollections[property] );
					}

					return this.elementCache[property];
				};
			}
			else {
				return function() {
					return this.element.querySelectorAll( this.elementCollections[property] );
				};
			}
		},

		createElementGetter: function(property) {
			if (this.elementCacheOptions.enabled) {
				return function() {
					if (!this.elementCache[property]) {
						this.elementCache[property] = this.element.querySelector( this.elements[property] );
					}

					return this.elementCache[property];
				};
			}
			else {
				return function() {
					return this.element.querySelector( this.elements[property] );
				};
			}
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

Modules.Base.include(Modules.ElementCache);
