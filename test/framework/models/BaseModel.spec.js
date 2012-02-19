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

	it("defines a primary key by default", function() {
		var o = new TestModel();
		expect(o.isValidAttributeKey("id")).toEqual(true);
		expect(o.id).toEqual(null);
	});

	it("allows sub classes to override the primary key", function() {
		var o = new TestModelPrimaryKeyOverride();
		expect(o.isValidAttributeKey("foo_id")).toEqual(true);
		expect(o.foo_id).toEqual(null);
	});
});
