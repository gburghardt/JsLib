BaseModel.extendModule("relations", {

	callbacks: {

		toXml: function(options) {
			var key;
			var i;
			var length;
			var relation, relations;
			var xml = [];
			var hasManyRelationsExist = false;

			for (key in this.hasOne) {
				if (!this.hasOne.hasOwnProperty(key)) {
					continue;
				}

				relation = this[key];

				if (relation) {
					xml.push(relation.toXml({rootElement: key}));
				}
			}

			for (key in this.hasMany) {
				if (!this.hasMany.hasOwnProperty(key)) {
					continue;
				}

				relations = this[key];

				if (relations && relations.length) {
					if (!hasManyRelationsExist) {
						hasManyRelationsExist = true;
						xml.push("<" + key  + ">");
					}

					for (i = 0, length = relations.length; i < length; i++) {
						xml.push(relations[i].toXml({rootElement: key.singularize()}));
					}
				}
			}

			if (hasManyRelationsExist) {
				xml.push("</" + key + ">");
			}

			return xml.length ? xml.join("") : undefined;
		}

	}

});
