describe("BaseCollection", function() {

	var id = new Date().getTime();

	it("is an instance of Array", function() {
		var collection = new BaseCollection();

		expect(collection).toBeInstanceof(Array);
	});

	describe("initialize", function() {

		it("does not require a class name", function() {
			var collection = new BaseCollection();

			expect(collection.className).toBeNull();
		});

		it("accepts a class name", function() {
			var collection = new BaseCollection("specs.baseCollection.TestModel");

			expect(collection.className).toEqual("specs.baseCollection.TestModel");
			expect(collection.classReference).toBeNull();
		});

		it("accepts a class name that does not exist yet", function() {
			var collection = new BaseCollection("specs.baseCollection.NonExistentModel");

			expect(collection.className).toEqual("specs.baseCollection.NonExistentModel");
			expect(collection.classReference).toBeNull();
		});

	});

	describe("getClassReference", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
		});

		it("lazily gets a reference to a class", function() {
			expect( this.collection.classReference ).toBeNull();
			expect( this.collection.getClassReference() ).toEqual( specs.baseCollection.TestModel );
			expect( this.collection.classReference ).toEqual( specs.baseCollection.TestModel );
		});

		it("throws an error when the class does not exist", function() {
			this.collection.className = "specs.baseCollection.NonExistentModel";

			expect(function() {
				this.collection.getClassReference();
			}).toThrowError();
		});

	});

	describe("contains", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
		});

		it("returns true when a duplicate primary key exists", function() {
			var model1 = new specs.baseCollection.TestModel({id: 123});
			this.collection.push(model1);

			expect(this.collection.contains(123)).toBeTrue();
			expect(this.collection.contains("123")).toBeTrue();
		});

		it("returns true when a duplicate instance exists", function() {
			var model1 = new specs.baseCollection.TestModel({id: 123});
			this.collection.push(model1);

			expect(this.collection.contains(model1)).toBeTrue();
		});

		it("returns true when an attributes hash with a duplicate primary key exists", function() {
			var model1 = new specs.baseCollection.TestModel({id: 123});
			this.collection.push(model1);

			expect(this.collection.contains({id: 123})).toBeTrue();
			expect(this.collection.contains({id: "123"})).toBeTrue();
		});

	});

	describe("create", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
		});

		it("returns and adds a new member with no attributes", function() {
			var model = this.collection.create();

			expect(model).toBeInstanceof(specs.baseCollection.TestModel);
			expect(this.collection[0]).toEqual(model);
			expect(model.name).toBeNull();
			expect(model.price).toBeNull();
		});

		it("returns and adds a new memeber with attributes", function() {
			var model = this.collection.create({name: "Testing", price: 123.34});

			expect(model).toBeInstanceof(specs.baseCollection.TestModel);
			expect(this.collection[0]).toEqual(model);
			expect(model.name).toEqual("Testing");
			expect(model.price).toEqual(123.34);
		});

	});

	describe("each", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
			this.collection.create({id: id++, name: "Test A"});
			this.collection.create({id: id++, name: "Test B"});
		});

		it("iterates over the collection passing the item and index", function() {
			var index = 0, timesCalled = 0, collection = this.collection;

			this.collection.each(function(item, i) {
				timesCalled++;
				expect(i).toEqual(index++);
				expect(item).toBeInstanceof(specs.baseCollection.TestModel);
				expect(this).toEqual(collection);
			});

			expect(timesCalled).toEqual(2);
		});

		it("accepts a context object to set the value of 'this' in the callback", function() {
			var test = this, timesCalled = 0, index = 0;

			this.collection.each(this, function(item, i) {
				timesCalled++;
				expect(i).toEqual(index++);
				expect(this).toEqual(test);
				expect(item).toBeInstanceof(specs.baseCollection.TestModel);
			});

			expect(timesCalled).toEqual(2);
		});

	});

	describe("next", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
			this.collection.create({id: id++, name: "Test A"});
			this.collection.create({id: id++, name: "Test B"});
			this.collection.create({id: id++, name: "Test C"});
		});

		it("returns the next item in the collection and returns null after the last item has been returned", function() {
			expect( this.collection.length ).toEqual(3);
			expect( this.collection.pointer ).toEqual(0);
			expect( this.collection.next() ).toEqual(this.collection[0]);
			expect( this.collection.pointer ).toEqual(1);
			expect( this.collection.next() ).toEqual(this.collection[1]);
			expect( this.collection.pointer ).toEqual(2);
			expect( this.collection.next() ).toEqual(this.collection[2]);
			expect( this.collection.pointer ).toEqual(3);
			expect( this.collection.next() ).toBeNull();
			expect( this.collection.pointer ).toEqual(0);
		});

		it("can be used to traverse the collection frontwards", function() {
			var model = null, timesCalled = 0, i = 0;
			var ids = [ this.collection[0].id, this.collection[1].id, this.collection[2].id ];
			
			while (model = this.collection.next()) {
				expect(model.id).toEqual(ids[i]);
				i++;
				timesCalled++;
			}

			expect(timesCalled).toEqual(this.collection.length);
		});

	});

	describe("member events", function() {});

	describe("pop", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
		});

		it("removes and returns the last member", function() {
			this.collection.create({name: "A"});
			this.collection.create({name: "B"});
			var model = this.collection.pop();

			expect(this.collection.length).toEqual(1);
			expect(model).toBeInstanceof(specs.baseCollection.TestModel);
		});

		it("returns null when there are no members in the collection", function() {
			var model = this.collection.pop();

			expect(this.collection.length).toEqual(0);
			expect(model).toBeNull();
		});

	});

	describe("prev", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
			this.collection.create({id: id++, name: "Test A"});
			this.collection.create({id: id++, name: "Test B"});
			this.collection.create({id: id++, name: "Test C"});
		});

		it("returns null if on the first item", function() {
			expect( this.collection.length ).toEqual(3);
			expect( this.collection.pointer ).toEqual(0);
			expect( this.collection.prev() ).toBeNull();
			expect( this.collection.pointer ).toEqual(0);
		});

		it("returns the previous item in the collection", function() {
			this.collection.next();
			expect( this.collection.pointer ).toEqual(1);
			expect( this.collection.prev() ).toEqual( this.collection[0] );
			expect( this.collection.pointer ).toEqual(0);
			expect( this.collection.prev() ).toBeNull();
			expect( this.collection.pointer ).toEqual(0);
		});

		it("can be used to traverse the collection backwards", function() {
			var model = null, timesCalled = 0, i = 0;
			var ids = [ this.collection[2].id, this.collection[1].id, this.collection[0].id ];

			this.collection.fastForward();

			while (model = this.collection.prev()) {
				expect(model.id).toEqual(ids[i]);
				i++;
				timesCalled++;
			}

			expect(timesCalled).toEqual(this.collection.length);
		});

	});

	describe("publish", function() {});

	describe("push", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
		});

		it("adds a new member by instance to the end of the collection", function() {
			var model = this.collection.push(new specs.baseCollection.TestModel());

			expect(model).toBeInstanceof(specs.baseCollection.TestModel);
			expect(model).toEqual(this.collection[0]);
			expect(this.collection.length).toEqual(1);
		});

		it("throws an error if new item is not the correct type", function() {
			expect(function() {
				this.collection.push(new Object());
			}).toThrowError();
		});

		it("returns null when the same instance is pushed twice", function() {
			var model = new specs.baseCollection.TestModel();
			this.collection.push(model);
			var x = this.collection.push(model);

			expect(this.collection.length).toEqual(1);
			expect(x).toBeNull();
		});

		it("returns null when attributes with the same primary key as an existing instance are pushed", function() {
			var model1 = new specs.baseCollection.TestModel({id: 123, name: "Test"});
			var model2 = new specs.baseCollection.TestModel({id: 123, name: "Test"});
			this.collection.push(model1);
			var x = this.collection.push(model2);

			expect(this.collection.length).toEqual(1);
			expect(this.collection[0]).toEqual(model1);
			expect(x).toBeNull();
		});

	});

	describe("splice", function() {
		// TODO: publish proper events when called
		xit("should be tested");
	});

	describe("subscribe", function() {});

	describe("sort", function() {

		beforeEach(function() {
			this.collection = new BaseCollection("specs.baseCollection.TestModel");
			this.collection.create({id: id++, name: "A", description: "C", price: 13.00, discount: 0.25});
			this.collection.create({id: id++, name: "B", description: "A", price: 132.79, discount: 0.35});
			this.collection.create({id: id++, name: "C", description: "B", price: 132.79, discount: 0.1});
		});

		it("returns an instance of BaseCollection", function() {
			var results = this.collection.sort("name");

			expect(results).toBeInstanceof(Array);
			expect(results).toBeInstanceof(BaseCollection);
		});

		it("sorts by a single column name", function() {
			var expectedResults = [
				this.collection[2].discount,
				this.collection[0].discount,
				this.collection[1].discount
			];
			var results = this.collection.sort("discount");
			var i = 0, length = expectedResults.length;

			for (i; i < length; i++) {
				expect( results[i].discount ).toEqual( expectedResults[i] );
			}
		});

		it("sorts by multiple column names", function() {
			var expectedResults = [
				this.collection[0].description,
				this.collection[2].description,
				this.collection[1].description
			];
			var results = this.collection.sort(["price", "discount"]);
			var i = 0, length = expectedResults.length;

			for (i; i < length; i++) {
				expect( results[i].description ).toEqual( expectedResults[i] );
			}
		});

		it("sorts ascending", function() {
			var expectedResults = [
				this.collection[2].discount,
				this.collection[0].discount,
				this.collection[1].discount
			];
			var results = this.collection.sort("discount", "asc");
			var i = 0, length = expectedResults.length;

			for (i; i < length; i++) {
				expect( results[i].discount ).toEqual( expectedResults[i] );
			}
		});

		it("sorts descending", function() {
			var expectedResults = [
				this.collection[1].discount,
				this.collection[0].discount,
				this.collection[2].discount
			];
			var results = this.collection.sort("discount", "desc");
			var i = 0, length = expectedResults.length;

			for (i; i < length; i++) {
				expect( results[i].discount ).toEqual( expectedResults[i] );
			}
		});

	});

});

window.specs = window.specs || {};

window.specs.baseCollection = {
	TestModel: BaseModel.extend({
		prototype: {
			validAttributes: [
				"name",
				"price",
				"description",
				"discount"
			]
		}
	})
};
