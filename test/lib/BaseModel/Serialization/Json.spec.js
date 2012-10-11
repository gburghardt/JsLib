describe("BaseModel", function() {

	describe("Serialization", function() {

		describe("toJson", function() {

			beforeEach(function() {
				this.model = new TestValidation({
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

			it("serializes only the primary key when no changed attributes exist", function() {
				var json = '{"id":1234}';
				expect(this.model.toJson({changedAttributesOnly: true})).toEqual(json);
			});

			describe("default options", function() {

				it("sets the format", function() {
					var Klass = BaseModel.extend({
						prototype: {
							serializeOptions: { format: "json" },
							validAttributes: ["name"]
						}
					});
					var model = new Klass({name: "Testing", id: 123});
					var expected = '{"name":"Testing","id":123}';
					var actual = model.serialize();

					expect(actual).toEqual(expected);
				});

				it("includes a root element", function() {
					var Klass = BaseModel.extend({
						prototype: {
							serializeOptions: { format: "json", rootElement: "klass" },
							validAttributes: ["name"]
						}
					});
					var model = new Klass({name: "Testing", id: 123});
					var expected = '{"klass":{"name":"Testing","id":123}}';
					var actual = model.serialize();

					expect(actual).toEqual(expected);
				});

				it("includes only changed attributes", function() {
					var Klass = BaseModel.extend({
						prototype: {
							serializeOptions: { format: "json", changedAttributesOnly: true },
							validAttributes: ["name", "description"]
						}
					});
					var model = new Klass({name: "Testing", description: "foo", id: 123});
					var expected = '{"name":"Testing changed","id":123}';
					model.name = "Testing changed";
					var actual = model.serialize();

					expect(actual).toEqual(expected);
				});

			});

		});

	});

});
