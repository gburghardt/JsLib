BaseModel.includeModule("serialization", {

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
		var x = "";

		switch (type) {
			case "xml":
				x = this.toXML(options);
				break;
			case "json":
				x = this.toJSON(options);
				break;
			default:
				x = this.toQueryString(options);
				break;
		}

		return x;
	},

	toJSON: function(options) {
		options = options || {};
		var key, json = "";

		if (options.rootElement) {
			json += '{"' + options.rootElement + '":';
		}

		json += JSON.stringify(this.attributes);

		if (options.rootElement) {
			json += '}';
		}

		return json;
	},

	toQueryString: function(options) {
		options = options || {};
		var attrs = this.attributes, key, queryString = [];

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

		return queryString.join("&");
	},

	toXML: function(options) {
		options = options || {};
		var attrs = this.attributes, key, xml = [], glue = "";


		if (options.shorthand) {
			if (!options.rootElement) {
				throw new Error("options.rootElement is required when converting to XML using shorthand format.");
			}

			xml.push("<" + options.rootElement);

			for (key in attrs) {
				if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
					xml.push(key + '="' + this.escapeHTML(attrs[key]) + '"');
				}
			}

			xml.push("/>");
			glue = " ";
		}
		else {
			if (options.rootElement) {
				xml.push("<" + options.rootElement.replace(/\[/g, ":").replace(/\]/g, "") + ">");
			}

			for (key in attrs) {
				if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
					xml.push("<" + key + ">" + this.escapeHTML(attrs[key]) + "</" + key + ">");
				}
			}

			if (options.rootElement) {
				xml.push("</" + options.rootElement.replace(/\[/g, ":").replace(/\]/g, "") + ">");
			}
		}

		return xml.join(glue);
	}

});
