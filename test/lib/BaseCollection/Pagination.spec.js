describe("BaseCollection", function() {

	describe("Pagination", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
			this.collection.create({id: specs.baseCollection.id++, name: "A", price: 13.99});		// 0
			this.collection.create({id: specs.baseCollection.id++, name: "C", price: 76.50});		// 1
			this.collection.create({id: specs.baseCollection.id++, name: "B", price: 5.98});		// 2
			this.collection.create({id: specs.baseCollection.id++, name: "Q", price: 7.89});		// 3
			this.collection.create({id: specs.baseCollection.id++, name: "N", price: 112.45});	// 4
			this.collection.create({id: specs.baseCollection.id++, name: "a", price: 43.72});		// 5
			this.collection.create({id: specs.baseCollection.id++, name: "d", price: 25.99});		// 6
			this.collection.create({id: specs.baseCollection.id++, name: "Aa", price: 32.46});	// 7
			this.collection.create({id: specs.baseCollection.id++, name: "Z", price: 4.50});		// 8
			this.collection.create({id: specs.baseCollection.id++, name: "m", price: 3.85});		// 9
			this.collection.create({id: specs.baseCollection.id++, name: "E", price: 22.50});		// 10
		});

		describe("getPage", function() {

			it("the limit defaults to 10", function() {
				var results = this.collection.getPage(0);
				var i = 0, length = 10;

				for (i; i < length; i++) {
					expect( results[i].price ).toEqual( this.collection[i].price );
				}
			});

			it("sets the limit to the default when the limit is 0 or less", function() {
				var results = this.collection.getPage(0, 0);
				expect( results.length ).toEqual( 10 );
				results = this.collection.getPage(0, -1);
				expect( results.length ).toEqual( 10 );
			});

			it("accepts a limit", function() {
				var results = this.collection.getPage(0, 2);

				expect( results.length ).toEqual( 2 );
				expect( results[0].price ).toEqual( this.collection[0].price );
				expect( results[1].price ).toEqual( this.collection[1].price );
			});

			it("when the limit is too large, caps the limit to the size of the collection", function() {
				var results = this.collection.getPage(0, this.collection.length + 1);

				expect( results.length ).toEqual( this.collection.length );
			});

			it("returns an empty result set for a page number below zero", function() {
				var results = this.collection.getPage(-2, 2);

				expect( results.length ).toEqual( 0 );
			});

			it("returns an empty result set for a page number above the max page", function() {
				var results = this.collection.getPage(1000, 2);

				expect( results.length ).toEqual( 0 );
			});

			it("returns the first page", function() {
				var results = this.collection.getPage(0, 2);

				expect( results.length ).toEqual( 2 );
				expect( results[0].price ).toEqual( this.collection[0].price );
				expect( results[1].price ).toEqual( this.collection[1].price );
			});

			it("returns the last page", function() {
				var results = this.collection.getPage(5, 2);

				expect( results.length ).toEqual( 1 );
				expect( results[0].price ).toEqual( this.collection[10].price );
			});

			it("returns a page", function() {
				var results = this.collection.getPage(1, 3);

				expect( results.length ).toEqual( 3 );
				expect( results[0].price ).toEqual( this.collection[3].price );
				expect( results[1].price ).toEqual( this.collection[4].price );
				expect( results[2].price ).toEqual( this.collection[5].price );
			});

			it("returns as much as possible when the page plus the limit exceeds the collection size", function() {
				var results = this.collection.getPage(2, 5);
				expect( results.length ).toEqual( 1 );
			});

			it("returns an instance of Array, not BaseCollection", function() {
				var results = this.collection.getPage(0);

				expect( results ).toBeInstanceof( Array );
				expect( results ).toNotBeInstanceof( BaseCollection );
			});

			it("respects the sort", function() {
				var expectedResults = [
					this.collection[9].price,
					this.collection[8].price,
					this.collection[2].price,
					this.collection[3].price,
					this.collection[0].price,
					this.collection[10].price,
					this.collection[6].price,
					this.collection[7].price,
					this.collection[5].price,
					this.collection[1].price,
					this.collection[4].price
				];
				this.collection.sort("price");
				var results = this.collection.getPage(0, 2), i = 0, length = results.length;

				for (i; i < length; i++) {
					expect( results[i].price ).toEqual( expectedResults[i] );
				}
			});

		});

		describe("getFirstPage", function() {

			it("has a default limit of 10", function() {
				var results = this.collection.getFirstPage();
				expect( results.length ).toEqual( 10 );
			});

			xit("accepts a limit");

			it("returns the default limit when the limit is zero or below", function() {
				var results = this.collection.getFirstPage(0);
				expect( results.length ).toEqual(10);
				results = this.collection.getFirstPage(-1);
				expect( results.length ).toEqual(10);
			});

			xit("returns the whole collection when the limit is greater than the size");

			xit("returns an empty result set when the collection size is 0");

		});

	});

});
