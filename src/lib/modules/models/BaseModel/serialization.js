BaseModel.includeModule("serialization", {

	prototype: {

		escapeHTML: function(x) {
			return String(x).replace(/&/g, "&amp;")
			                .replace(/</g, "&lt;")
			                .replace(/>/g, "&gt;")
			                .replace(/"/g, "&quot;")
			                .replace(/'/g, "&apos;");
		},

		serialize: function(type, options) {
			type = type || "queryString";
			options = options || {};
			var methodName = "to" + type.capitalize();
			var x = (!!this[methodName]) ? this[methodName](options) : this.toQueryString(options);
			return x;
		}

	}

});
