BaseModel.extendModule("relations", {

	callbacks: {

		toJson: function(options) {
			var json = [], results;

			if (this.hasOne) {
				results = this.hasOneToJson();

				if (results) {
					json.push(results);
				}
			}

			if (this.hasMany) {
				results = this.hasManyToJson();

				if (results) {
					json.push(results);
				}
			}

			return (json.length) ? json.join("") : undefined;
		}

	},

	prototype: {

		hasManyToJson: function() {
			var json = [], key, relations, i, length, buffer = [];

			for (key in this.hasMany) {
				if (this.hasMany.hasOwnProperty(key)) {
					relations = this.getHasManyRelation(key);

					if (relations && relations.length) {
						for (i = 0, length = relations.length; i < length; i++) {
							buffer.push(relations[i].toJson());
						}

						json.push('"' + key + '":[' + buffer.join(",") + ']');
					}
				}
			}

			return json.join(",");
		},

		hasOneToJson: function() {
			var json = [], key, relation;

			for (key in this.hasOne) {
				if (this.hasOne.hasOwnProperty(key)) {
					relation = this.getHasOneRelation(key);

					if (relation) {
						json.push('"' + key + '":' + relation.toJson());
					}
				}
			}

			return json.join(",");
		}
		
	}

});
