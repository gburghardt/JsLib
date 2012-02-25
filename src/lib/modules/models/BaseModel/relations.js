BaseModel.includeModule("relations", {

	callbacks: {

		__constructor: function(attributes) {
			this._relations = {};
		},

		initAttributes: function() {
			this.initOneToOneRelationships();
			this.initOneToManyRelationships();
		},

		attributes: function(attrs) {
			// TODO: instantiate relationships
		},

		toJSON: function(options) {
			
		},

		toQueryString: function(options) {
			
		},

		toXML: function(options) {
			
		},

		validate: function() {
			
		}
		
	},

	prototype: {

		hasMany: null,

		/*
			{
				foo: {className: "a.b.ClassName"} (assume foreign key is "foo_id")
				bar: {className: "c.e.ClassName", foreignKey: "abc"}
			}
		*/
		hasOne: null,

		_relations: null,

		initOneToManyRelationships: function() {
			
		},

		initOneToOneRelationships: function() {
			if (!this.hasOne) {
				return;
			}

			var key;

			for (key in this.hasOne) {
				if (this.hasOne.hasOwnProperty(key)) {
					if (!this.hasOne[key].foreignKey) {
						this.hasOne[key].foreignKey = key + "_id";
					}

					Object.defineProperty(this.__proto__, key, {
						get: this.createOneToOneRelationshipGetter(key, this.hasOne[key]),
						set: this.createOneToOneRelationshipSetter(key, this.hasOne[key])
					})
				}
			}
		},

		createOneToOneRelationshipGetter: function(key, relationInfo) {
			return function() {
				if (this._relations[key]) {
					return this._relations[key];
				}
				else if (this._attributes[key]) {
					var classReference = BaseModel.modules.relations.self.getClassReference(relationInfo.className);
					this._relations[key] = new classReference(this._attributes[key]);
					classReference = null;
					return this._relations[key];
				}
				else {
					return null;
				}
			};
		},

		createOneToOneRelationshipSetter: function(key, relationInfo) {
			return function(newValue) {
				this._relations[key] = newValue;

				if (newValue === null) {
					this[ relationInfo.foreignKey ] = null;
					this._attributes[key] = null;
				}
				else {
					this[ relationInfo.foreignKey ] = newValue[ newValue.primaryKey ];
				}

				newValue = null;
			};
		}

	},

	self: {
		
		classReferenceCache: {},
		
		getClassReference: function(className) {
			if (!this.classReferenceCache.hasOwnProperty(className)) {
				var context = window;
				var namespacePieces = className.split(/\./g);
				var i = 0;
				var length = namespacePieces.length;
				var namespace, classReference;

				for (i; i < length; i++) {
					namespace = namespacePieces[i];

					if (context[namespace]) {
						if (typeof context[namespace] === "function") {
							classReference = context[namespace];
							this.classReferenceCache[className] = classReference;
							break;
						}
						else {
							context = context[namespace];
							continue;
						}
					}
					else {
						throw new Error("No class reference was found for " + className);
					}
				}

				context = classReference = namespacePieces = null;
			}

			return this.classReferenceCache[className];
		}
		
	}

});
