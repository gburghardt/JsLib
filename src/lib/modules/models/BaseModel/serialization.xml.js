BaseModel.extendModule("serialization", {

	prototype: {

		toXml: function(options) {
			options = options || {};
			var attrs, key, xml = [], glue = "", moduleCallbacksResult;

			if (options.changedAttributesOnly) {
				attrs = {};

				for (key in this._changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				attrs = this._attributes;
			}

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

				moduleCallbacksResult = this.applyModuleCallbacks("toXml", [options]);

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

				moduleCallbacksResult = this.applyModuleCallbacks("toXml", [options]);

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
