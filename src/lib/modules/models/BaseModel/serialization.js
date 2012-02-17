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
			var key, json = "", moduleCallbacksResult;

			if (options.rootElement) {
				json += '{"' + options.rootElement + '":';
			}

			json += JSON.stringify(this.attributes);
			moduleCallbacksResult = this.applyModuleCallbacks("toJSON", [options]);

			if (moduleCallbacksResult) {
				json += moduleCallbacksResult.join("");
			}

			if (options.rootElement) {
				json += '}';
			}

			return json;
		},

		toQueryString: function(options) {
			options = options || {};
			var attrs = this.attributes, key, queryString = [], moduleCallbacksResult;

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
		},

		toXML: function(options) {
			options = options || {};
			var attrs = this.attributes, key, xml = [], glue = "", moduleCallbacksResult;


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

				moduleCallbacksResult = this.applyModuleCallbacks("toXML", [options]);

				if (moduleCallbacksResult.length) {
					xml.push(moduleCallbacksResult.join(""));
				}

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

				moduleCallbacksResult = this.applyModuleCallbacks("toXML", [options]);

				if (moduleCallbacksResult) {
					xml.push(moduleCallbacksResult.join(""));
				}

				if (options.rootElement) {
					xml.push("</" + options.rootElement.replace(/\[/g, ":").replace(/\]/g, "") + ">");
				}
			}

			return xml.join(glue);
		}

	}

});
