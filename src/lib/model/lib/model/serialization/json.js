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
			var json = "", moduleCallbacksResult, attrs = {}, i, length, key, hasAttrs = false;

			if (options.rootElement) {
				json += '{"' + options.rootElement + '":';
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
				length = this.validAttributes.length;

				for (i = 0; i < length; i++) {
					key = this.validAttributes[i];

					if (this._attributes.hasOwnProperty(key)) {
						hasAttrs = true;
						attrs[key] = this._attributes[key];
					}
				}
			}

			json += JSON.stringify(attrs);
			moduleCallbacksResult = this.applyModuleCallbacks("toJson", [options]);

			if (moduleCallbacksResult.length) {
				json = json.replace(/\}$/, "");

				if (hasAttrs) {
					json += "," + moduleCallbacksResult.join("") + "}";
				}
				else {
					json += moduleCallbacksResult.join("") + "}";
				}
			}

			if (options.rootElement) {
				json += '}';
			}

			return json;
		}

	}

};

Model.Base.include(Model.Serialization.Json);
