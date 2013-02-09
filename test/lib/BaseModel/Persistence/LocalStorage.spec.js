describe("BaseModel", function() {

	describe("Persistence", function() {

		describe("LocalStorage", function() {

			describe("included", function() {
				it("merges localStorageOptions from parent and child classes", function() {
					var TestModel = BaseModel.extend({
						prototype: {
							localStorageOptions: {table: "test"}
						}
					});
					var instance = new TestModel();

					expect(TestModel.prototype.hasOwnProperty("localStorageOptions")).toBeTrue();
					expect(TestModel.prototype.localStorageOptions.table).toEqual("test");
					expect(TestModel.prototype.localStorageOptions.key).toBeUndefined();
					expect(instance.localStorageOptions.table).toEqual("test");
					expect(instance.localStorageOptions.key).toEqual(":table.:id");
				});
			});

			describe("localStorageOptions", function() {
		
			});

			describe("createNewPrimaryKey", function() {
		
			});

			describe("fetchFromLocalStorage", function() {
		
			});

			describe("findFromLocalStorage", function() {
		
			});

			describe("createLocalStorageKey", function() {
				it("creates a unique key without arguments", function() {
					var TestModel = BaseModel.extend();
					var model = new TestModel({id: 123});
					var key = model.createLocalStorageKey();

					expect(key).toEqual("base_model.123");
				});

				it("creates a unique key given a model instance", function() {
					var TestModel = BaseModel.extend();
					var model = new TestModel({id: 123});
					var key = model.createLocalStorageKey(model);

					expect(key).toEqual("base_model.123");
				});

				it("allows the table name to be changed", function() {
					var TestModel = BaseModel.extend({
						prototype: {
							localStorageOptions: {table: "test_model"}
						}
					});
					var model = new TestModel({id: 123});
					var key = model.createLocalStorageKey(model);

					expect(key).toEqual("test_model.123");
				});

				xit("throws an error if a matcher in localStorageOptions.key results in a null or undefined value");
			});
	
			describe("destroyFromLocalStorage", function() {
		
			});

			describe("saveToLocalStorage", function() {
		
			});

		});

	});

});
