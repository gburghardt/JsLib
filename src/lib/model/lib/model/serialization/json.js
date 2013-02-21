Model.Serialization.Json = {

	prototype: {

		objectIsEmpty: function(o) {
			var empty = true, key;

			if (o) {
				for (key in o) {
					if (o.hasOwnProperty(key)) {
						empty = false;
						break;
					}
				}
			}

			o = null;

			return empty;
		},

		toJson: function(options) {
			options = options || {};
			var json = [], attrs = {}, key, hasAttrs = false;

			if (options.rootElement) {
				json.push( '{"' + options.rootElement + '":' );
			}

			if (options.changedAttributesOnly) {
				for (key in this._changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				hasAttrs = true;
				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				for (key in this.compiledSchema) {
					if (this.compiledSchema.hasOwnProperty(key)) {
						attrs[key] = this._attributes[key];
						hasAttrs = true;
					}
				}
			}

			json.push( JSON.stringify(attrs) );
			this.notify( "toJson", { options: options, json: json } );

			if (options.rootElement) {
				json.push( '}' );
			}

			attrs = options = null;

			return json.join("");
		}

	}

};

Model.Base.include(Model.Serialization.Json);
