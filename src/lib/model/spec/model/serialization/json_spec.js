describe("Model", function() {

	var Product = Model.Base.extend({
		prototype: {
			schema: {
				name: "String",
				description: "String",
				price: "Number",
				notes: "String",
				phone: "String"
			}
		}
	});

	describe("Serialization", function() {

		describe("Json", function() {

			describe("toJson", function() {

				beforeEach(function() {
					this.model = new Product({
						id: 1234,
						name: "Paint",
						description: "Red<br>matte",
						price: 15.99,
						notes: "Per gallon",
						phone: null
					});
				});

				it("serializes attributes into an anonymous object", function() {
					var json = [
						'{',
							'"name":"Paint",',
							'"description":"Red<br>matte",',
							'"price":15.99,',
							'"notes":"Per gallon",',
							'"phone":null,',
							'"id":1234',
						'}'
					].join("");

					expect(this.model.toJson()).toEqual(json);
				});

				it("serializes attributes into a named object", function() {
					var json = [
						'{',
							'"test_validation":{',
								'"name":"Paint",',
								'"description":"Red<br>matte",',
								'"price":15.99,',
								'"notes":"Per gallon",',
								'"phone":null,',
								'"id":1234',
							'}',
						'}'
					].join("");

					expect(this.model.toJson({rootElement: "test_validation"})).toEqual(json);
				});

				it("serializes changed attributes", function() {
					var json = [
						'{',
							'"name":"Stain",',
							'"id":1234',
						'}'
					].join("");
					this.model.name = "Stain";
					expect(this.model.changedAttributes.name).toEqual("Paint");
					expect(this.model.toJson({changedAttributesOnly: true})).toEqual(json);
				});

				it("serializes attributes into with a root element", function() {
					this.model.name = "Ink";
					var expected = '{"test_validation":{"name":"Ink","id":1234}}';
					var actual = this.model.toJson({rootElement: "test_validation", changedAttributesOnly: true});
					expect(actual).toEqual(expected);
				});

				it("serializes only the primary key when no changed attributes exist", function() {
					var json = '{"id":1234}';
					expect(this.model.toJson({changedAttributesOnly: true})).toEqual(json);
				});

				describe("default options", function() {

					it("sets the format", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json" },
								schema: {
									name: "String"
								}
							}
						});
						var model = new Klass({name: "Testing", id: 123});
						var expected = '{"name":"Testing","id":123}';
						var actual = model.serialize();

						expect(actual).toEqual(expected);
					});

					it("includes a root element", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", rootElement: "klass" },
								schema: {
									name: "String"
								}
							}
						});
						var model = new Klass({name: "Testing", id: 123});
						var expected = '{"klass":{"name":"Testing","id":123}}';
						var actual = model.serialize();

						expect(actual).toEqual(expected);
					});

					it("includes only changed attributes", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", changedAttributesOnly: true },
								schema: {
									name: "String",
									description: "String"
								}
							}
						});
						var model = new Klass({name: "Testing", description: "foo", id: 123});
						var expected = '{"name":"Testing changed","id":123}';
						model.name = "Testing changed";
						var actual = model.serialize();

						expect(actual).toEqual(expected);
					});

					it("includes changed attributes, a root element and sets the format", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", changedAttributesOnly: true, rootElement: "klass" },
								schema: {
									name: "String",
									description: "String"
								}
							}
						});
						var model = new Klass({name: "Testing", description: "foo", id: 123});
						var expected = '{"klass":{"name":"Test Changed","id":123}}';
						model.name = "Test Changed";
						var actual = model.serialize();

						expect(actual).toEqual(expected);
					});

					it("allows the root element to be overrided", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", rootElement: "wrong" }
							}
						});
						var model = new Klass({id: 123});
						var expected = '{"right":{"id":123}}';
						var actual = model.serialize({rootElement: "right"});

						expect(actual).toEqual(expected);
					});

					it("allows changed attributes only flag to be overrided", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", changedAttributesOnly: true },
								schema: {
									name: "String",
									description: "String"
								}
							}
						});
						var model = new Klass({name: "Test", description: "Foo", id: 123});
						model.description = "Foo changed";
						var expected = '{"name":"Test","description":"Foo changed","id":123}';
						var actual = model.serialize({changedAttributesOnly: false});

						expect(actual).toEqual(expected);
					});

					it("allows all options to be overrided", function() {
						var Klass = Model.Base.extend({
							prototype: {
								serializeOptions: { format: "json", changedAttributesOnly: true, rootElement: "wrong" },
								schema: {
									name: "String",
									description: "String"
								}
							}
						});
						var model = new Klass({name: "Test", description: "Foo", id: 123});
						model.description = "Foo changed";
						var expected = '{"right":{"name":"Test","description":"Foo changed","id":123}}';
						var actual = model.serialize({changedAttributesOnly: false, rootElement: "right"});

						expect(actual).toEqual(expected);
					});

				});

			});

		});

	});

});
