describe("BaseModel", function() {

	function TestModel(attributes) {
		this.constructor(attributes);
	}
	TestModel.prototype = {
		__proto__: BaseModel.prototype
	};

	function TestModelPrimaryKeyOverride(attributes) {
		this.constructor(attributes);
	}
	TestModelPrimaryKeyOverride.prototype = {
		__proto__: BaseModel.prototype,
		primaryKey: "foo_id"
	};

	function TestModelAttributes(attributes) {
		this.constructor(attributes);
	}
	TestModelAttributes.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ["firstName", "lastName"]
	};

	it("defines a primary key by default", function() {
		var o = new TestModel();
		expect(o.isValidAttributeKey("id")).toEqual(true);
		expect(o.id).toBeNull();
	});

	it("allows sub classes to override the primary key", function() {
		var o = new TestModelPrimaryKeyOverride();
		expect(o.isValidAttributeKey("foo_id")).toEqual(true);
		expect(o.foo_id).toBeNull();
	});

	describe("valueIsEmpty", function() {

		beforeEach(function() {
			this.model = new TestModel();
		});

		it("returns true for null values", function() {
			expect(this.model.valueIsEmpty(null)).toEqual(true);
		});

		it("returns true for undefined values", function() {
			var foo;
			expect(this.model.valueIsEmpty(foo)).toEqual(true);
		});

		it("returns true for NaN values", function() {
			expect(this.model.valueIsEmpty(NaN)).toEqual(true);
		});

		it("returns true for empty strings", function() {
			expect(this.model.valueIsEmpty("")).toEqual(true);
		});

		it("returns true for strings containing only white space characters", function() {
			expect(this.model.valueIsEmpty("  \t  ")).toEqual(true);
		});

		it("returns true for empty arrays", function() {
			expect(this.model.valueIsEmpty( [] )).toEqual(true);
		});

		it("returns false for everything else", function() {
			expect(this.model.valueIsEmpty( "abc" )).toEqual(false);
			expect(this.model.valueIsEmpty( 0 )).toEqual(false);
			expect(this.model.valueIsEmpty( -1 )).toEqual(false);
			expect(this.model.valueIsEmpty( 1 )).toEqual(false);
			expect(this.model.valueIsEmpty( {} )).toEqual(false);
			expect(this.model.valueIsEmpty( function() {} )).toEqual(false);
			expect(this.model.valueIsEmpty( true )).toEqual(false);
			expect(this.model.valueIsEmpty( false )).toEqual(false);
		});

	});

	describe("valid attributes", function() {

		it("returns false for invalid attributes", function() {
			var o = new TestModelAttributes();
			expect(o.isValidAttributeKey("non_existent")).toEqual(false);
			expect(o.isValidAttributeKey("Name")).toEqual(false);
		});

		it("returns true for valid attributes", function() {
			var o = new TestModelAttributes();
			expect(o.isValidAttributeKey("firstName")).toEqual(true);
			expect(o.isValidAttributeKey("lastName")).toEqual(true);
			expect(o.isValidAttributeKey("id")).toEqual(true);
		});

	});

	describe("constructor", function() {

		it("assigns attributes", function() {
			var o = new TestModelAttributes({id: 123, firstName: "John", lastName: "Doe"});
			expect(o.id).toEqual(123);
			expect(o.firstName).toEqual("John");
			expect(o.lastName).toEqual("Doe");
		});

		it("ignores invalid attributes", function() {
			var o = new TestModelAttributes({id: 123, invalidAttr: "foo"});
			expect(o.hasOwnProperty("invalidAttr")).toEqual(false);
			expect(o.invalidAttr).toBeUndefined();
		});

		it("does not require attributes", function() {
			expect(function() {
				var o = new TestModelAttributes();
			}).not.toThrow(Error);
		});

	});

	describe("attributes", function() {

		describe("getters", function() {

			it("return null when no attribute was given", function() {
				var o = new TestModelAttributes();
				expect(o.id).toBeNull();
				expect(o.firstName).toBeNull();
				expect(o.lastName).toBeNull();
			});

			it("return the value", function() {
				var o = new TestModelAttributes({id: 123});
				expect(o.id).toEqual(123);
				expect(o.firstName).toBeNull();
				expect(o.lastName).toBeNull();

			});

		});

		describe("setters", function() {

			it("put entries in the changedAttributes", function() {
				var o = new TestModelAttributes({firstName: "Fred"});
				expect(o.changedAttributes.id).toBeUndefined();
				expect(o.changedAttributes.firstName).toBeUndefined();
				o.id = 123;
				o.firstName = "Joe";
				expect(o.id).toEqual(123);
				expect(o.firstName).toEqual("Joe");
				expect(o.changedAttributes.id).toBeUndefined();
				expect(o.changedAttributes.firstName).toEqual("Fred");
			});

		});

	});

	describe("validation", function() {

		describe("requires", function() {});

		describe("numeric", function() {});

		describe("max length", function() {});

		describe("atribute formats", function() {});

	});

});
