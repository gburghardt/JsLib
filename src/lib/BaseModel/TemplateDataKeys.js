BaseModel.TemplateDataKeys = {
	prototype: {
		getTemplateKeys: function() {
			if (!this._templateKeys) {
				var keys = [], key, attrs = this.attributes;

				for (key in attrs) {
					if (attrs.hasOwnProperty(key)) {
						keys.push(key);
					}
				}

				// No need to capture a return value because module callbacks push items
				// onto the keys array.
				this.applyModuleCallbacks("getTemplateKeys", [keys]);
				this._templateKeys = keys;
			}

			return this._templateKeys;
		}
	}
};

BaseModel.include(BaseModel.TemplateDataKeys);