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

	function TestValidation(attributes) {
		this.constructor(attributes);
	}
	TestValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: [
			"name",
			"description",
			"price",
			"notes",
			"phone"
		],
		requires: [
			"price",
			"name",
			"description",
			"notes",
			"phone"
		],
		validatesNumeric: [
			"price"
		],
		validatesMaxLength: {
			name: 40,
			description: 256
		},
		validatesFormatOf: {
			name: /^testing.*$/,
			phone: /^\s*\d{3}\s*[-.]*\s*\d{3}\s*[-.]*\s*\d{4}\s*$/
		}
	};

	function TestNumericValidation(attributes) {
		this.constructor(attributes);
	}
	TestNumericValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ["price"],
		validatesNumeric: ["price"]
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

		it("returns false for NaN values", function() {
			expect(this.model.valueIsEmpty(NaN)).toBeFalse();
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

	describe("basicValidation module", function() {

		describe("validateRequiredAttributes", function() {

			it("marks fields with 'empty'-like values as required", function() {
				var o = new TestValidation({price: null, description: "", notes: "			"});
				o.errors = {};
				o.validateRequiredAttributes();

				expect(o.hasErrors()).toBeTrue();
				expect(o.errors.price).toBeArray();
				expect(o.errors.price[0]).toEqual("is required");

				expect(o.errors.name).toBeArray();
				expect(o.errors.name[0]).toEqual("is required");

				expect(o.errors.notes).toBeArray();
				expect(o.errors.notes[0]).toEqual("is required");

				expect(o.errors.description).toBeArray();
				expect(o.errors.description[0]).toEqual("is required");

				expect(o.errors.phone).toBeArray();
				expect(o.errors.phone[0]).toEqual("is required");
			});

			it("validates when no attributes are passed in the constructor", function() {
				var o = new TestValidation();
				o.errors = {};
				o.validateRequiredAttributes();

				expect(o.hasErrors()).toBeTrue();
				expect(o.errors.price).toBeArray();
				expect(o.errors.price[0]).toEqual("is required");

				expect(o.errors.name).toBeArray();
				expect(o.errors.name[0]).toEqual("is required");

				expect(o.errors.notes).toBeArray();
				expect(o.errors.notes[0]).toEqual("is required");

				expect(o.errors.description).toBeArray();
				expect(o.errors.description[0]).toEqual("is required");

				expect(o.errors.phone).toBeArray();
				expect(o.errors.phone[0]).toEqual("is required");
			});

		});

	});

	describe("extendedValidation", function() {

		describe("valueIsNumeric", function() {

			beforeEach(function() {
				this.model = new TestNumericValidation();
			});

			it("returns true for numbers", function() {
				expect(this.model.valueIsNumeric(100)).toBeTrue();
				expect(this.model.valueIsNumeric(-100)).toBeTrue();
				expect(this.model.valueIsNumeric(0.3)).toBeTrue();
			});

			it("returns true for numeric strings", function() {
				expect(this.model.valueIsNumeric("100")).toBeTrue();
				expect(this.model.valueIsNumeric("-100")).toBeTrue();
				expect(this.model.valueIsNumeric("0.3")).toBeTrue();
			});

			it("returns false for empty strings", function() {
				expect(this.model.valueIsNumeric("")).toBeFalse();
			});

			it("returns false for null values", function() {
				expect(this.model.valueIsNumeric(null)).toBeFalse();
			});

			it("returns false for NaN values", function() {
				expect(this.model.valueIsNumeric(NaN)).toBeFalse();
			});

			it ("returns false for strings without numbers", function() {
				expect(this.model.valueIsNumeric("abc")).toBeFalse();
			});

			it ("returns false for strings with numbers and non numeric characters", function() {
				expect(this.model.valueIsNumeric("$10.05")).toBeFalse();
			});

		});

		describe("numeric", function() {

			beforeEach(function() {
				this.model = new TestNumericValidation();
				this.model.errors = {};
				this.model.valid = true;
			});

			it("returns true for empty strings", function() {
				this.model.price = "";
				this.model.validateAttributeDataTypes();
				expect(this.model.valid).toBeTrue();
			});

			it("returns true for null values", function() {
				this.model.price = null;
				this.model.validateAttributeDataTypes();
				expect(this.model.valid).toBeTrue();
			});

			it("returns false for NaN values", function() {
				this.model.price = NaN;
				this.model.validateAttributeDataTypes();
				expect(this.model.valid).toBeFalse();
			});

			it("returns false for non numeric strings", function() {
				this.model.price = "acb";
				this.model.validateAttributeDataTypes();
				expect(this.model.valid).toBeFalse();
			});

			it("returns false for strings with numbers, but other non number characters", function() {
				this.model.price = "$10.99";
				this.model.validateAttributeDataTypes();
				expect(this.model.valid).toBeFalse();
			});

		});

		describe("max length", function() {});

		describe("atribute formats", function() {});

	});

	describe("toJSON", function() {});

	describe("toQueryString", function() {});

	describe("toXML", function() {});

	describe("relations", function() {

		describe("getClassReference", function() {});

	});

});
