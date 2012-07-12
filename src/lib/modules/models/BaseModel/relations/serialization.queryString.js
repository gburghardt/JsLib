BaseModel.extendModule("relations", {

	callbacks: {

		toQueryString: function(options) {
			var key;
			var i;
			var length;
			var relation;
			var queryString = [];
			var origRootElement = options.rootElement || "";
			var currentRootElement = "";
			var relationQueryString;

			for (key in this.hasOne) {
				if (this.hasOne.hasOwnProperty(key)) {
					relation = this[key];

					if (relation) {
						options.rootElement = (origRootElement) ? origRootElement + "[" + key + "]" : key;
						relationQueryString = relation.toQueryString(options);

						if (relationQueryString) {
							queryString.push(relationQueryString);
						}
					}
				}
			}

			for (key in this.hasMany) {
				if (this.hasMany.hasOwnProperty(key)) {
					relation = this[key];

					if (relation) {
						currentRootElement = (origRootElement) ? origRootElement + "[" + key + "]" : key;

						for (i = 0, length = relation.length; i < length; i++) {
							options.rootElement = currentRootElement + "[" + i + "]";
							relationQueryString = relation[i].toQueryString(options);

							if (relationQueryString) {
								queryString.push(relationQueryString);
							}
						}
					}
				}
			}

			return queryString.length ? queryString.join("&") : undefined;
		}

	}

});
