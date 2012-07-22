BaseModel.includeModule("relations", {

	callbacks: {

		__constructor: function(attributes) {
			this.relationsAttributes = {};
			this._relations = {};
		},

		initAttributes: function() {
			this.initOneToOneRelationships();
			this.initOneToManyRelationships();
		},

		attributes: function(attrs) {
			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					if (( this.hasOne && this.hasOne.hasOwnProperty(key) ) || ( this.hasMany && this.hasMany.hasOwnProperty(key) )) {
						this.relationsAttributes[key] = attrs[key];
						attrs[key] = null;
						delete attrs[key];
					}
				}
			}
		},

		validate: function() {
			this.validateOneToOneRelationships();
			this.validateOneToManyRelationships();
		}

	},

	prototype: {

		/*
			{
				foos: {className: "a.b.ClassName"} (assume foreign key is "foos_id")
				bars: {className: "a.b.ClassName", foreignKey: "abc"}
			}
		*/
		hasMany: null,

		/*
			{
				foo: {className: "a.b.ClassName"} (assume foreign key is "foo_id")
				bar: {className: "c.e.ClassName", foreignKey: "abc"}
			}
		*/
		hasOne: null,

		relationsAttributes: null,

		_relations: null,

		initOneToManyRelationships: function() {
			if (!this.hasMany) {
				return;
			}

			var key;

			for (key in this.hasMany) {
				if (this.hasMany.hasOwnProperty(key)) {
					if (!this.hasMany[key].foreignKey) {
						this.hasMany[key].foreignKey = key + "_id";
					}

					Object.defineProperty(this.__proto__, key, {
						get: this.createOneToManyRelationshipGetter(key, this.hasMany[key]),
						set: this.createOneToManyRelationshipSetter(key, this.hasMany[key]),
						enumerable: true
					});
				}
			}
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
						get: this.createOneToOneRelationshipGetter(key),
						set: this.createOneToOneRelationshipSetter(key, this.hasOne[key]),
						enumerable: true
					});
				}
			}
		},

		createOneToManyRelationshipGetter: function(key, relationInfo) {
			return function() {
				if (this._relations[key]) {
					return this._relations[key];
				}
				else if (this.relationsAttributes[key]) {
					var i = 0, length = this.relationsAttributes[key].length, classReference;

					this._relations[key] = [];

					for (i; i < length; i++) {
						classReference = BaseModel.modules.relations.self.getClassReference(relationInfo.className);
						this._relations[key].push( new classReference( this.relationsAttributes[key][i] ) );
					}

					classReference = null;
					return this._relations[key];
				}
				else {
					return null;
				}
			};
		},

		createOneToManyRelationshipSetter: function(key, relationInfo) {
			return function(newValue) {
				this.relationsAttributes[key] = null;
				this._relations[key] = newValue;
				newValue = null;
			};
		},

		createOneToOneRelationshipGetter: function(key) {
			return function() {
				return this.getHasOneRelation(key);
			};
		},

		createOneToOneRelationshipSetter: function(key, relationInfo) {
			return function(newValue) {
				this._relations[key] = newValue;
				this.relationsAttributes[key] = null;

				if (newValue === null) {
					this[ relationInfo.foreignKey ] = null;
				}
				else {
					this[ relationInfo.foreignKey ] = newValue[ newValue.primaryKey ];
				}

				newValue = null;
			};
		},

		getHasManyRelation: function(key) {
			if (this._relations[key]) {
				return this._relations[key];
			}
			else if (!this.hasMany[key]) {
				return null;
			}
			else if (this.relationsAttributes[key]) {
				var i = 0, length = this.relationsAttributes[key].length, RelationClass, relationInfo = this.hasMany[key];

				this._relations[key] = [];

				for (i; i < length; i++) {
					RelationClass = BaseModel.modules.relations.self.getClassReference(relationInfo.className);
					this._relations[key].push( new RelationClass( this.relationsAttributes[key][i] ) );
				}

				classReference = null;
				return this._relations[key];
			}
			else {
				return null;
			}
		},

		getHasOneRelation: function(key) {
			if (this._relations[key]) {
				return this._relations[key];
			}
			else if (!this.hasOne[key]) {
				return null;
			}
			else if (this.relationsAttributes[key]) {
				var relationInfo = this.hasOne[key]
				var RelationClass = BaseModel.modules.relations.self.getClassReference(relationInfo.className);
				this._relations[key] = new RelationClass(this.relationsAttributes[key]);
				RelationClass = null;

				return this._relations[key];
			}
			else {
				return null;
			}
		},

		getRelation: function(name) {
			return this.getHasOneRelation(name) || this.getHasManyRelation(name) || null;
		},

		setHasManyRelation: function(name, relation) {
			
		},

		setHasOneRelation: function(name, relation) {
			
		},

		setRelation: function(name) {
			
		},

		validateOneToOneRelationships: function(key) {
			if (!this.hasOne) {
				return;
			}

			var key, relations = this.hasOne, relationship;

			for (key in relations) {
				if (relations.hasOwnProperty(key)) {
					relationship = this[key];

					if (relationship) {
						this.validateRelationship(key, relationship);
					}
				}
			}

			relations = relationship = null;
		},

		validateOneToManyRelationships: function(key) {
			if (!this.hasMany) {
				return;
			}

			var key, relations = this.hasMany, relationship, i, length;

			for (key in relations) {
				if (relations.hasOwnProperty(key) && this[key]) {
					relationship = this[key];

					if (relationship) {
						for (i = 0, length = relationship.length; i < length; i++) {
							this.validateRelationship(key, relationship[i]);
						}
					}
				}
			}

			relations = relationship = null;
		},

		validateRelationship: function(key, relationship) {
			relationship.validate();

			if (!relationship.valid) {
				this.valid = false;
				this.addError(key, "has errors");
			}

			relationship = null;
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
