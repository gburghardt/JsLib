BaseModel.Relations.TemplateDataKeys = {
	callbacks: {
		getTemplateKeys: function(keys) {
			var key, keySources = [this.hasOne, this.hasMany], i = 0, length = keySources.length;

			for (i; i < length; i++) {
				for (key in keySources[i]) {
					if (keySources[i].hasOwnProperty(key)) {
						keys.push(key);
					}
				}
			}
		}
	}
};

BaseModel.include(BaseModel.Relations.TemplateDataKeys);