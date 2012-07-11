BaseModel.extendModule("serialization", {

	prototype: {

		toQueryString: function(options) {
			options = options || {};
			var attrs = null, key, queryString = [], moduleCallbacksResult;

			if (options.changedAttributesOnly) {
				attrs = {};

				for (key in this.changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				attrs = this._attributes;
			}

			if (options.rootElement) {
				for (key in attrs) {
					if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
						queryString.push(options.rootElement + "[" + escape(key) + "]=" + escape(attrs[key]));
					}
				}
			}
			else {
				for (key in attrs) {
					if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
						queryString.push(escape(key) + "=" + escape(attrs[key]));
					}
				}
			}

			moduleCallbacksResult = this.applyModuleCallbacks("toQueryString", [options]);

			if (moduleCallbacksResult.length) {
				queryString.push(moduleCallbacksResult.join(""));
			}

			return queryString.join("&");
		}

	}

});
