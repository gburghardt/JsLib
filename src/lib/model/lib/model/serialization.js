Model.Serialization = {

	prototype: {

		serializeOptions: {
			format: "queryString"
		},

		escapeHTML: function(x) {
			return String(x).replace(/&/g, "&amp;")
											.replace(/</g, "&lt;")
											.replace(/>/g, "&gt;")
											.replace(/"/g, "&quot;")
											.replace(/'/g, "&apos;");
		},

		serialize: function(options) {
			options = this.mergePropertyFromPrototypeChain("serializeOptions").merge(options || {});
			var methodName = "to" + options.format.capitalize();
			var x;

			if (this[methodName]) {
				x = this[methodName](options);
			}
			else {
				throw new Error(methodName + " is not a function");
			}

			return x;
		}

	}

};

Model.Base.include(Model.Serialization);
