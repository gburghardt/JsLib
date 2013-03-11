Model.TemplateDataKeys = {
	prototype: {
		getTemplateKeys: function() {
			if (!this._templateKeys) {
				var key, keys = [];

				if (this.guid) {
					keys.push("guid");
				}

				for (key in this.compiledSchema) {
					if (this.compiledSchema.hasOwnProperty(key)) {
						keys.push(key);
					}
				}

				// No need to capture a return value because module callbacks push items
				// onto the keys array.
				this.notify( "initTemplateDataKeys", { keys : keys } );
				this._templateKeys = keys;
			}

			return this._templateKeys;
		}
	}
};

Model.Base.include(Model.TemplateDataKeys);
