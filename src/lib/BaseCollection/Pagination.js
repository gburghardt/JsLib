BaseCollection.Pagination = {

	prototype: {

		getFirstPage: function(limit) {
			return this.getPage(0, limit);
		},

		getLastPage: function(limit) {
			if (limit === undefined || limit <= 0) {
				limit = 10;
			}
			else if (limit > this.length) {
				limit = this.length;
			}

			var page = Match.floor(this.length / limit);

			return this.getPage(page, limit);
		},

		pageExists: function(page, limit) {
			
		},

		getPage: function(page, limit) {
			limit = (limit === undefined || limit <= 0) ? 10 : limit;

			if (limit > this.length) {
				limit = this.length;
			}

			var i = page * limit, results = [], length = this.length, end = i + limit;

			if (page >= 0) {
				for (i; i < length && i < end; i++) {
					results.push( this[i] );
				}
			}

			return results;
		}

	}

};

BaseCollection.include(BaseCollection.Pagination);
