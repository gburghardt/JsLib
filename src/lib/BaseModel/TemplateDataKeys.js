BaseModel.TemplateDataKeys = {
	prototype: {
		getTemplateKeys: function() {
			if (!this._templateKeys) {
				var keys = [], i = 0, length = this.validAttributes.length;

				for (i; i < length; i++) {
					keys.push(this.validAttributes[i]);
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