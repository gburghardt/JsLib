BaseModel.extendModule("serialization", {

	prototype: {

		toJson: function(options) {
			options = options || {};
			var json = "", moduleCallbacksResult, attrs = {}, i, length, key;

			if (options.rootElement) {
				json += '{"' + options.rootElement + '":';
			}

			if (options.changedAttributesOnly) {
				for (key in this._changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				length = this.validAttributes.length;

				for (i = 0; i < length; i++) {
					key = this.validAttributes[i];
					attrs[key] = this._attributes[key];
				}
			}

			json += JSON.stringify(attrs);
			moduleCallbacksResult = this.applyModuleCallbacks("toJson", [options]);

			if (moduleCallbacksResult.length) {
				json = json.replace(/\}$/, "");
				// FIXME: syntax error is introduced when main model has no attributes set: '{"store": {' + ','
				json += "," + moduleCallbacksResult.join("") + "}";
			}

			if (options.rootElement) {
				json += '}';
			}

			return json;
		}

	}

});
