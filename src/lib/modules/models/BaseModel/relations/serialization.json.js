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
			var json = [];
			return json.join("");
		},

		hasOneToJson: function() {
			var json = [], key;

			for (key in this.hasOne) {
				if (this.hasOne.hasOwnProperty(key)) {
					var relation = this.getHasOneRelation(key);

					if (relation) {
						json.push('"' + key + '":' + relation.toJson());
					}
				}
			}

			return json.join(",");
		}
		
	}

});
