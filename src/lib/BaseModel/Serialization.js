BaseModel.Serialization = {

	prototype: {

		serializeOptions: {},

		escapeHTML: function(x) {
			return String(x).replace(/&/g, "&amp;")
			                .replace(/</g, "&lt;")
			                .replace(/>/g, "&gt;")
			                .replace(/"/g, "&quot;")
			                .replace(/'/g, "&apos;");
		},

		mergeOptions: function() {
			var options = {}, key, overrides;

			for (i = 0, length = arguments.length; i < length; i++) {
				overrides = arguments[i];

				for (key in overrides) {
					if (overrides.hasOwnProperty(key)) {
						options[key] = overrides[key];
					}
				}
			}

			return options;
		},

		serialize: function(type, options) {
			type = type || "queryString";
			options = this.mergeOptions(this.serializeOptions, options || {});
			var methodName = "to" + type.capitalize();
			var x = this[methodName](options);
			return x;
		}

	}

};

BaseModel.include(BaseModel.Serialization);
