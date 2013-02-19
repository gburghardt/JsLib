'@import Model.Serialization';

Model.Serialization.QueryString = {

	prototype: {

		toQueryString: function(options) {
			options = options || {};
			var attrs = null, key, queryString = [];

			if (options.changedAttributesOnly) {
				var changedAttributes = this.changedAttributes;
				attrs = {};

				for (key in changedAttributes) {
					if (changedAttributes.hasOwnProperty(key) && changedAttributes[key]) {
						attrs[key] = this.attributes[key];
					}
				}

				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				attrs = this.attributes;
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

			this.notify("onSerialize", { options: options, queryString: queryString } );
			// moduleCallbacksResult = this.applyModuleCallbacks("toQueryString", [options]);

			return queryString.join("&");
		}

	}

};

Model.Base.include(Model.Serialization.QueryString);
